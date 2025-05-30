const Patient = require("../../models/Patient");
const HealthCard = require("../../models/HealthCard");


exports.addHealthCard = async (req, res) => {
  try {
    const { patientId, cardType, expiryDate } = req.body;

    if (!patientId || !expiryDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if patient exists using patientId
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Generate a unique card number
    let cardNumber;
    let cardExists = true;
    while (cardExists) {
      cardNumber = `RIMC-${Math.floor(10000 + Math.random() * 90000)}`;
      cardExists = await HealthCard.exists({ cardNumber });
    }

    const newCard = await HealthCard.create({
      patientId,
      cardNumber,
      cardType,
      expiryDate,
      status: 'active' // Optional: directly activate it
    });

    // Update patient with card info
    patient.cardNumber = cardNumber;
    patient.cardStatus = 'active';
    await patient.save();

    res.status(201).json({ message: "Health card issued", data: newCard });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate card number", error });
    }
    res.status(500).json({ message: "Server error", error });
  }
};



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
