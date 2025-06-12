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
async function generateHospitalId(User) {
  let hospitalId;
  let hospitalIdExists = true;
  while (hospitalIdExists) {
    hospitalId = `HOSP${Math.floor(100000 + Math.random() * 900000)}`;
    hospitalIdExists = await User.exists({ hospitalId });
  }
  return hospitalId;
}

module.exports = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { firstName, lastName, email, password, role, stateCode, rtoCode, hospitalShort } = req.body;

  try {
    let user = await User.findOne({ email });
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

    // Create user
    user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: role || "patient",
    });

    // Generate UHID for patients
    if ((role || "patient") === "patient") {
      user.uhid = await generateUHID(User);
    }

    // Generate Hospital ID for hospitals
    if (role === "hospital") {
      user.hospitalId = await generateHospitalId(User);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // If user is registering as a hospital, create a hospital entry
    if (role === "hospital") {
      try {
        const hospitalId = `HSP${Date.now().toString().slice(-6)}`;
        const hospital = new Hospital({
          _id: hospitalId,
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
          currentBalance: 0
        });

        await hospital.save();
        console.log('Hospital created successfully:', hospitalId);
      } catch (hospitalError) {
        // If hospital creation fails, delete the user
        await User.findByIdAndDelete(user._id);
        console.error("Hospital creation error:", hospitalError);
        return res.status(500).json({ 
          msg: "Failed to create hospital profile",
          error: hospitalError.message 
        });
      }
    }

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
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error01");
  }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.collection('hospitals').dropIndex('contactEmail_1');
    // ...
  } catch (err) {
    // Ignore error if index doesn't exist
    if (err.code !== 26) {
      console.error('Error dropping indexes:', err);
    }
  }
});