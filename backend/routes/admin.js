const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  quickActionHospital,
  quickActionLoan,
  quickActionUser,
  quickActionUsercreation,
  quickActionHealthCard,
  addPlatformFee,
  addSalesTarget,
  updatePlatformFee,
  updateUser,
  getUsers
} = require('../controllers/admin/adminController');

// @route   POST api/admin/quick-action/hospital
// @desc    Quick action to register a hospital
// @access  Private (Admin only)
router.post('/quick-action/hospital', auth, quickActionHospital);

// @route   POST api/admin/quick-action/loan
// @desc    Quick action to approve a loan
// @access  Private (Admin only)
router.post('/quick-action/loan', auth, quickActionLoan);

// @route   POST api/admin/quick-action/user
// @desc    Quick action to create a user
// @access  Private (Admin only)
router.post('/quick-action/user', auth, quickActionUser);

// @route   POST api/admin/quick-action/health-card
// @desc    Quick action to create a health card
// @access  Private (Admin only)
router.post('/quick-action/health-card', auth, quickActionHealthCard);

router.post('/quick-action-user', auth, quickActionUser);

router.post('/quick-action-user-creation', auth, quickActionUsercreation);


router.post('/add-fee', auth, addPlatformFee);

router.post('/add-sales-target', auth, addSalesTarget);

router.put('/update-fee/:id', auth, updatePlatformFee);

router.put('/update-user/:id', auth, updateUser)

// Get all users
router.get('/users', auth, getUsers);

module.exports = router;