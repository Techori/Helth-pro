
const HealthCard = require('../models/HealthCard');
const Transaction = require('../models/Transaction');

const processHealthCardPayment = async ({ userId, healthCardId, amount, description }) => {
  try {
    console.log('Processing health card payment:', { userId, healthCardId, amount, description });

    // Find the health card
    const healthCard = await HealthCard.findById(healthCardId);
    if (!healthCard) {
      throw new Error('Health card not found');
    }

    // Validate ownership and status
    if (healthCard.user.toString() !== userId) {
      throw new Error('Not authorized to use this health card');
    }
    if (healthCard.status !== 'active') {
      throw new Error('Health card is not active');
    }

    // Check if this is a credit payment (paying down used credit) or a charge
    const isPayingCredit = description && description.toLowerCase().includes('payment');
    
    if (isPayingCredit) {
      // This is a payment towards used credit - should INCREASE available credit
      if (amount > healthCard.usedCredit) {
        throw new Error(`Cannot pay more than used credit amount of ₹${healthCard.usedCredit}`);
      }

      // Reduce used credit and increase available credit
      healthCard.usedCredit -= amount;
      healthCard.availableCredit += amount;
      
      console.log('Credit payment processed:', {
        newUsedCredit: healthCard.usedCredit,
        newAvailableCredit: healthCard.availableCredit
      });
    } else {
      // This is a regular charge - should DECREASE available credit
      if (healthCard.availableCredit < amount) {
        throw new Error('Insufficient available credit');
      }

      // Update health card balances
      healthCard.availableCredit -= amount;
      healthCard.usedCredit += amount;
    }

    await healthCard.save();

    // Create transaction record
    const transaction = new Transaction({
      user: userId,
      cardNumber: healthCard.cardNumber,
      amount: isPayingCredit ? amount : -amount, // Positive for payments, negative for charges
      type: isPayingCredit ? 'credit_payment' : 'payment',
      description,
      status: 'completed',
      hospital: 'N/A',
      date: new Date()
    });
    await transaction.save();

    return {
      transactionId: transaction._id,
      newAvailableCredit: healthCard.availableCredit,
      newUsedCredit: healthCard.usedCredit,
      amount
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error(error.message);
  }
};

module.exports = { processHealthCardPayment };
