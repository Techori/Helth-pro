const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const patientController = require('../controllers/hospital/patientController');
const auth = require('../middleware/auth');

// Get all hospitals
router.get('/', auth, hospitalController.getAllHospitals);

// Get hospital by ID
router.get('/:id', auth, hospitalController.getHospitalById);

// Add new hospital registration
router.post('/', auth, hospitalController.addHospital);

// Approve hospital registration
router.patch('/:id/approve', auth, hospitalController.approveHospital);

// Reject hospital registration
router.patch('/:id/reject', auth, hospitalController.rejectHospital);

// Update hospital details
router.put('/:id', auth, hospitalController.updateHospital);

// Delete hospital
router.delete('/:id', auth, hospitalController.deleteHospital);

router.post('/patients', auth, patientController.addPatient);

module.exports = router;