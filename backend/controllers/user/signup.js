const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");
const Hospital = require("../../models/Hospital");

// Helper to generate UHID
async function generateUHID(stateCode, rtoCode, hospitalShort, User) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  // Find the latest patient to get the last serial
  const lastPatient = await User.findOne({ role: "patient" }).sort({ date: -1 });
  let serial = 1;
  if (lastPatient && lastPatient.uhid) {
    const lastSerial = parseInt(lastPatient.uhid.slice(-4));
    if (!isNaN(lastSerial)) serial = lastSerial + 1;
  }
  const serialStr = serial.toString().padStart(4, '0');
  return `${year}${month}_${stateCode}${rtoCode}_${hospitalShort}${serialStr}`;
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
      role,
      hospitalName,
      location,
      phone,
      services
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    // Additional validation for hospital registration
    if (role === "hospital") {
      if (!hospitalName || !location || !phone) {
        return res.status(400).json({ msg: "All hospital details are required" });
      }
    }

    // Check if user already exists
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
      user.uhid = await generateUHID(stateCode, rtoCode, hospitalShort, User);
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
    console.error("Signup error:", err);
    res.status(500).json({ 
      msg: "Server error during registration",
      error: err.message 
    });
  }
};
