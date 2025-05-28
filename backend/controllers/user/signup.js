const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");

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

    user = new User({
      firstName,
      lastName,
      email,
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
