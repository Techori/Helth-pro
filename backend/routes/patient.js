const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
const auth=require('../middleware/auth');
const getDashboard = require('../controllers/patient/dashboard');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Configure face-api.js
const FACE_DETECTION_OPTIONS = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 });
const FACE_MATCH_THRESHOLD = 0.6;

// Register new patient with face data
router.post('/register', async (req, res) => {
  try {
    const { name, age, gender, contact, faceImage } = req.body;

    // Convert base64 image to buffer
    const imageBuffer = Buffer.from(faceImage.split(',')[1], 'base64');
    const img = await canvas.loadImage(imageBuffer);

    // Detect face and compute face descriptor
    const detection = await faceapi.detectSingleFace(img, FACE_DETECTION_OPTIONS)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return res.status(400).json({ error: 'No face detected in the image' });
    }

    // Create new patient with face embeddings
    const patient = new Patient({
      name,
      age,
      gender,
      contact,
      faceEmbeddings: Array.from(detection.descriptor),
      faceImage
    });

    await patient.save();

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.contact.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering patient' });
  }
});


// Verify patient using face
router.post('/verify', async (req, res) => {
  try {
    const { faceImage } = req.body;

    // Convert base64 image to buffer
    const imageBuffer = Buffer.from(faceImage.split(',')[1], 'base64');
    const img = await canvas.loadImage(imageBuffer);

    // Detect face and compute face descriptor
    const detection = await faceapi.detectSingleFace(img, FACE_DETECTION_OPTIONS)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return res.status(400).json({ error: 'No face detected in the image' });
    }

    // Get all patients
    const patients = await Patient.find({});
    const queryDescriptor = Array.from(detection.descriptor);

    // Find matching patient
    let bestMatch = null;
    let bestDistance = Infinity;

    for (const patient of patients) {
      const distance = faceapi.euclideanDistance(queryDescriptor, patient.faceEmbeddings);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = patient;
      }
    }

    // Check if the best match is within threshold
    if (bestDistance <= FACE_MATCH_THRESHOLD) {
      res.json({
        verified: true,
        patient: {
          id: bestMatch._id,
          name: bestMatch.name,
          email: bestMatch.contact.email
        }
      });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Error verifying patient' });
  }
});

// Get patient by email or cardNumber
router.get('/get-user', async (req, res) => {
  try {
    const { searchTerm } = req.query;
    console.log('Search term:', searchTerm);

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const patient = await Patient.findOne({
      $or: [
        { email: searchTerm },
        { cardNumber: searchTerm }
      ]
    }).select('-__v -password'); // Exclude sensitive fields

    console.log('Found patient:', patient);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const responseData = {
      id: patient._id,
      name: patient.name,
      email: patient.email,
      cardNumber: patient.cardNumber,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      cardStatus: patient.cardStatus ,
      cardBalance: patient.cardBalance,
      loanLimit: patient.loanLimit,
      loanBalance: patient.loanBalance
    };
    console.log('Response data:', responseData);

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error fetching patient' });
  }
});


// Dashboard route
router.get('/dashboard', auth, getDashboard);

module.exports = router;