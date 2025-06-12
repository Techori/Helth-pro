const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Get all staff members
router.get('/', staffController.getAllStaff);

// Get staff member by ID
router.get('/:id', staffController.getStaffById);

// Add new staff member
router.post('/', staffController.addStaff);

// Update staff member
router.put('/:id', staffController.updateStaff);

// Delete staff member
router.delete('/:id', staffController.deleteStaff);

// Update staff status
router.patch('/:id/status', staffController.updateStaffStatus);

module.exports = router; 