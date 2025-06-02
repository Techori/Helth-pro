const Hospital = require('../../models/Hospital');
const User = require('../../models/User');
const HealthCard = require('../../models/HealthCard');
const Loan = require('../../models/Loan');
const Transaction = require('../../models/Transaction');

module.exports = async (req, res) => {
  try {
    // Assuming req.user.email is the hospital's email ID (from auth middleware)
    const hospital = await User.findOne({ email: req.user.email });

    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    // Total patients linked to this hospital (assuming User has a hospital field)
    const totalPatients = await User.countDocuments({ role: 'patient', hospital: hospital._id });

    // Wallet balances (customize field names as per your schema)
    const hospitalWallet = hospital.walletBalance || 0;
    const financeWallet = hospital.financeWallet || 0;

    // Recent transactions
    const recentTransactions = await Transaction.find({ hospital: hospital._id })
      .sort({ date: -1 })
      .limit(5);

    // Health cards issued
    const totalHealthCards = await HealthCard.countDocuments({ hospital: hospital._id });

    // Loan applications
    const loanApplications = await Loan.countDocuments({ user: req.user.id });

    res.json({
      hospitalProfile: hospital,
      stats: {
        totalPatients,
        hospitalWallet,
        financeWallet,
        totalHealthCards,
        loanApplications,
      },
      recentTransactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};