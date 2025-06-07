const User = require('../../models/User');
const Hospital = require('../../models/Hospital');

exports.updateHospitalProfile = async (req, res) => {
  try {
    const { name, address, city, state, zipCode, contactPerson, contactEmail, contactPhone, hospitalType, bedCount, status, emergencyServices, date } = req.body;

    // Validate required fields
    if (!contactEmail) {
      return res.status(400).json({ msg: 'Required field (contactEmail) is missing.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    // Find the hospital associated with the contactEmail
    let hospital = await Hospital.findOne({ contactEmail: contactEmail });
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found for this email.' });
    }

    // Update fields in the Hospital model
    hospital.name = name || hospital.name;
    hospital.address = address || hospital.address;
    hospital.city = city || hospital.city;
    hospital.state = state || hospital.state;
    hospital.zipCode = zipCode || hospital.zipCode;
    hospital.contactPerson = contactPerson || hospital.contactPerson;
    hospital.contactEmail = contactEmail || hospital.contactEmail;
    hospital.contactPhone = contactPhone || hospital.contactPhone;
    hospital.hospitalType = hospitalType || hospital.hospitalType;
    hospital.bedCount = bedCount || hospital.bedCount;
    hospital.status = status || hospital.status;
    hospital.emergencyServices = emergencyServices !== undefined ? emergencyServices : hospital.emergencyServices;
    hospital.date = date || hospital.date;

    // Save updated hospital
    await hospital.save();

    res.status(200).json({ msg: 'Hospital profile updated successfully', data: hospital });
  } catch (err) {
    console.error('Error updating hospital profile:', err.message);
    if (err.code === 11000) { // Duplicate key error (e.g., email already exists)
      return res.status(400).json({ msg: 'Email already in use by another hospital.' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};