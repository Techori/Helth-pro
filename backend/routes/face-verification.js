const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");


const register = require("../controllers/face-auth/register");
const validate = require("../controllers/face-auth/validate");

// @route   POST api/face-auth/register
// @desc    Register face data for a user or nominee
// @access  Private
router.post(
  "/register",
  auth,
  [
    check("patientId", "Patient ID is required").not().isEmpty(),
    check("faceImage", "Face image data is required").not().isEmpty(),
    check("descriptor", "Face descriptor is required").isArray(),
    check("isNominee", "Nominee status must be specified").isBoolean(),
  ],
  register
);

// @route   POST api/face-auth/validate
// @desc    Validate face during payment process
// @access  Public
router.post(
  "/validate",
  [
    check("patientId", "Patient ID is required").not().isEmpty(),
    check("faceImage", "Face image data is required").not().isEmpty(),
    check("descriptor", "Face descriptor is required").isArray(),
  ],
  validate
);

module.exports = router;
