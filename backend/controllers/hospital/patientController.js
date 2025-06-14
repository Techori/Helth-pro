const Patient = require("../../models/Patient");
const HealthCard = require("../../models/HealthCard");
const HospitalPatients = require("../../models/hospitalPatients"); // Adjust path as needed

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
    const { name, age, gender, phone, email, cardNumber } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !age || !gender) {
      return res.status(400).json({ message: "Name, phone, email, age, and gender are required." });
    }

    // Generate a unique patientId with retries if already exists
    let patientId;
    let patientExists = true;
    while (patientExists) {
      patientId = `HP${Math.floor(10000 + Math.random() * 90000)}`; // Prefix 'HP' for HospitalPatients
      patientExists = await HospitalPatients.exists({ patientId });
    }

    // Generate a unique UHID
    let uhid;
    let uhidExists = true;
    while (uhidExists) {
      uhid = `UHID${Math.floor(100000 + Math.random() * 900000)}`;
      uhidExists = await HospitalPatients.exists({ uhid });
    }

    const newHospitalPatient = new HospitalPatients({
      patientId,
      uhid,
      name,
      age,
      gender,
      phone,
      email,
      cardNumber: cardNumber || undefined, // Avoid null for unique sparse field
      cardStatus: cardNumber ? "active" : "inactive",
      cardBalance: 0,
      lastVisit: new Date(),
      // faceImage and faceEmbeddings are optional, so not included
    });

    await newHospitalPatient.save();

    res.status(201).json({ message: "Hospital patient added successfully", patient: newHospitalPatient });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate field (e.g., email, patientId, or uhid)", error });
    }
    res.status(500).json({ message: "Server error", error });
  }
};
