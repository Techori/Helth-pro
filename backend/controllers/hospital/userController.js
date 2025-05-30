// controllers/userController.js
const User = require('../../models/HospitalUser');

exports.addUser = async (req, res) => {
  try {
    const { name, email, initialPassword, role, department } = req.body;

    // Validate input
    if (!name || !email || !initialPassword || !role || !department) {
      return res.status(400).json({ message: "All fields are required: name, email, initialPassword, role, department." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Create a new user
    const newUser = new User({ name, email, initialPassword, role, department });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};