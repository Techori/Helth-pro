const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth
 * @access  Public
 */
module.exports = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }

  const { email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Optional: Validate selected role if provided
    if (role) {
      const selectedRole = role.toLowerCase();
      if (user.role !== selectedRole) {
        return res.status(400).json({
          msg: "Selected role does not match your account type",
          expectedRole: user.role,
        });
      }
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        email: user.email, // Adding email for better logging
      },
    };
    // Sign and return JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 }, // 100 hours
      (err, token) => {
        if (err) {
          console.error("Token generation error:", err);
          throw err;
        }
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      }
    );
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
