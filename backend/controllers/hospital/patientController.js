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

    // Generate a unique patientId with retries if already exists
    let patientId;
    let patientExists = true;
    while (patientExists) {
      patientId = `P${Math.floor(10000 + Math.random() * 90000)}`;
      patientExists = await Patient.exists({ patientId });
    }

    // Similarly for UHID
    let uhid;
    let uhidExists = true;
    while (uhidExists) {
      uhid = `UHID${Math.floor(100000 + Math.random() * 900000)}`;
      uhidExists = await Patient.exists({ uhid });
    }

    const newPatient = new Patient({
      patientId,
      uhid,
      name,
      age,
      gender,
      phone,
      email,
      cardNumber: cardNumber || undefined, // avoid null if optional and unique
      cardStatus: cardNumber ? "active" : "inactive",
      cardBalance: 0,
      lastVisit: new Date()
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
