
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");

const signup = require("../controllers/user/signup");
const userController = require("../controllers/user/get");
const updateController = require("../controllers/user/update");
const forgotPassword = require("../controllers/user/forgotPassword");
const verifyResetPassword = require("../controllers/user/verifyResetPassword");

router.post(
  "/signup",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  signup
);

router.get("/get", auth, userController.getUser);
router.post("/verify-password", auth, userController.verifyPassword);
router.put("/update", auth, updateController.updateUser);
router.put("/update-password", auth, updateController.updatePassword);

// Forgot Password Route
router.post("/forgot-password", forgotPassword);

// Reset Password Route
router.post(
  "/verify-reset-password",
  [
    check("token", "Reset token is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  verifyResetPassword
);

module.exports = router;
