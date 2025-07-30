const User = require('../../models/User');
const HealthCard = require('../../models/HealthCard');
const Loan = require('../../models/Loan');
const Transaction = require('../../models/Transaction');
const Notification = require('../../models/Notification');

module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching dashboard data for user:', userId);

    // Get user health cards
    const healthCards = await HealthCard.find({ user: userId });
    const activeHealthCards = healthCards.filter(card => card.status === 'active');

    // Get user loans
    const loans = await Loan.find({ user: userId });

    // Get recent transactions
    const recentTransactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Get notifications
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Calculate stats
    const totalHealthCards = healthCards.length;
    const activeLoans = loans.filter(loan => loan.status === 'approved').length;
    const activeLoans1 = loans.filter(loan => loan.status === 'approved');
    const totalSpent = recentTransactions
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Calculate average credit utilization across active health cards
    const creditUtilization = activeHealthCards.length > 0
      ? activeHealthCards.reduce((sum, card) => {
          const used = card.usedCredit || 0;
          const limit = card.approvedCreditLimit || card.availableCredit || 1;
          return sum + (used / limit);
        }, 0) / activeHealthCards.length * 100
      : 0;

    const dashboardData = {
      healthCards: activeHealthCards.length > 0 
        ? activeHealthCards.map(card => ({
            balance: card.availableCredit || 0,
            limit: card.approvedCreditLimit,
            cardNumber: card.cardNumber,
            status: card.status,
            expiryDate: card.expiryDate,
            usedCredit: card.usedCredit || 0
          }))
        : [{
            balance: 0,
            limit: 0,
            cardNumber: '',
            status: 'none',
            expiryDate: '',
            usedCredit: 0
          }],
      loans: activeLoans1.map(loan => ({
        id: loan._id,
        loanApplicationNumber:loan.applicationNumber||0,
        amount: loan.loanDetails.approvedAmount || 0,
        remainingBalance: loan.remainingBalance || 0,
        nextEmiDate: loan.nextEmiDate,
        emiAmount: loan.monthlyPayment || 0,
        status: loan.status,
        approvedDate:loan.approvalDate
      })),
      recentTransactions: recentTransactions.map(transaction => ({
        id: transaction._id,
        description: transaction.description || 'Transaction',
        amount: transaction.amount,
        date: transaction.date || transaction.createdAt,
        status: transaction.status,
        type: transaction.amount > 0 ? 'credit' : 'debit'
      })),
      notifications: notifications.map(notification => ({
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        unread: notification.unread !== false,
        createdAt: notification.createdAt
      })),
      stats: {
        totalHealthCards,
        activeLoans,
        totalSpent,
        creditUtilization: Math.round(creditUtilization * 100) / 100
      }
    };

    console.log('Dashboard data prepared:', dashboardData);
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      msg: 'Server error fetching dashboard data',
      error: error.message 
    });
  }
};