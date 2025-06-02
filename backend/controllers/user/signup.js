const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      firstName,
      lastName,
      email,
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
    res.status(500).send("Server Error");
  }
};