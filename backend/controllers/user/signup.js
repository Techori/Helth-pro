const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");
const Hospital = require("../../models/Hospital");
const mongoose = require("mongoose");

// Helper to generate UHID
async function generateUHID(User) {
  let uhid;
  let uhidExists = true;
  while (uhidExists) {
    uhid = `UHID${Math.floor(100000 + Math.random() * 900000)}`;
    uhidExists = await User.exists({ uhid });
  }
  return uhid;
}

// Helper to generate Hospital ID
async function generateHospitalId(Hospital) {
  let hospitalId;
  let hospitalIdExists = true;
  while (hospitalIdExists) {
    hospitalId = `H${Math.floor(10000 + Math.random() * 90000)}`;
    hospitalIdExists = await Hospital.exists({ _id: hospitalId });
  }
  return hospitalId;
}

module.exports = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role = "patient",
      hospitalName,
      location,
      phone,
      services,
    } = req.body;

    // Check if user with same email exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Check if hospital with same email exists
    if (role === "hospital") {
      const existingHospital = await Hospital.findOne({ email: email.toLowerCase() });
      if (existingHospital) {
        return res.status(400).json({ msg: "Hospital with this email already exists" });
      }
    }

    // Validate role
    const validRoles = ["patient", "hospital", "sales", "crm", "agent", "support"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role specified" });
    }

    // Additional validation for hospital role
    if (role === "hospital" && (!hospitalName || !location || !phone)) {
      return res.status(400).json({ msg: "Hospital name, location and phone are required for hospital registration" });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
      phone
    });

    // Generate Hospital ID for hospitals
    if (role === "hospital") {
      user.hospitalId = await generateHospitalId(Hospital);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // If user is registering as a hospital, create a hospital entry
    if (role === "hospital") {
      try {
        const hospital = new Hospital({
          _id: user.hospitalId, // Use the same hospitalId as in user
          name: hospitalName,
          location: location,
          contactPerson: `${firstName} ${lastName}`,
          phone: phone,
          email: email.toLowerCase(),
          services: services ? services.split(',').map(s => s.trim()) : ["General"],
          registrationDate: new Date(),
          status: "Pending",
          totalPatients: 0,
          totalTransactions: 0,
          currentBalance: 0,
          user: user._id // Add user reference
        });

        await hospital.save();
        console.log('Hospital created successfully:', hospital._id);
      } catch (hospitalError) {
        // If hospital creation fails, delete the user
        await User.findByIdAndDelete(user._id);
        console.error('Hospital creation failed:', hospitalError);
        return res.status(500).json({ 
          msg: "Failed to create hospital profile",
          error: hospitalError.message 
        });
      }
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            ...(user.hospitalId && { hospitalId: user.hospitalId })
          }
        });
      }
    );
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).send("Server Error");
  }
}