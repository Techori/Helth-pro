
const Patient = require("../../models/Patient");

exports.addPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      cardNumber
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required." });
    }

    // Generate a custom patientId like "P12345"
    const patientId = `P${Math.floor(10000 + Math.random() * 90000)}`;

    // Auto-generate a unique UHID
    const uhid = `UHID${Math.floor(100000 + Math.random() * 900000)}`;

    const newPatient = new Patient({
      patientId,
      name,
      age,
      gender,
      phone,
      email,
      uhid,
      cardNumber: cardNumber || null,
      cardStatus: cardNumber ? "active" : "inactive",
      cardBalance: 0,
      lastVisit: new Date(),
    });

    await newPatient.save();

    res.status(201).json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate field", error });
    }
    res.status(500).json({ message: "Server error", error });
  }
};
