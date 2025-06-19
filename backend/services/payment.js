const HealthCard = require('../models/HealthCard');
const Transaction = require('../models/Transaction');

const processHealthCardPayment = async ({ userId, healthCardId, amount, description }) => {
  try {
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
    if (healthCard.availableCredit < amount) {
      throw new Error('Insufficient available credit');
    }

    // Update health card balances
    healthCard.availableCredit -= amount;
    healthCard.usedCredit += amount;
    await healthCard.save();

    // Create transaction record
    const transaction = new Transaction({
      user: userId,
      cardNumber: healthCard.cardNumber,
      amount,
      type: 'payment',
      description,
      status: 'completed',
      hospital: 'N/A' // No hospital for processing fee
    });
    await transaction.save();

    return {
      transactionId: transaction._id,
      newAvailableCredit: healthCard.availableCredit,
      newUsedCredit: healthCard.usedCredit,
      amount
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { processHealthCardPayment };