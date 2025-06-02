const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");

const register = require("../controllers/face-auth/register");
const validate = require("../controllers/face-auth/validate");
const isRegistered = require("../controllers/face-auth/isRegistered");
// @route   POST api/face-auth/register
// @desc    Register face data for a user or nominee
// @access  Private
router.post(
  "/register",
  auth,
  [
    check("emailId", "Valid email ID is required").isEmail(),
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
    check("emailId", "Valid email ID is required").isEmail(),
    check("descriptor", "Face descriptor is required").isArray(),
  ],
  validate
);

const { query } = require("express-validator");
router.get(
  "/isRegistered",
  [
    query("emailId", "Invalid Email ID").isEmail(),
    query("isNominee").optional().isBoolean(),
  ],
  isRegistered
);

module.exports = router;
