const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const patientController=require('../controllers/hospital/patientController');
// Get all hospitals
router.get('/', hospitalController.getAllHospitals);

// Get hospital by ID
router.get('/:id', hospitalController.getHospitalById);

// Add new hospital registration
router.post('/', hospitalController.addHospital);

// Approve hospital registration
router.patch('/:id/approve', hospitalController.approveHospital);

// Reject hospital registration
router.patch('/:id/reject', hospitalController.rejectHospital);

// Update hospital details
router.put('/:id', hospitalController.updateHospital);

// Delete hospital
router.delete('/:id', hospitalController.deleteHospital);


router.post('/patients', patientController.addPatient);

module.exports = router; 