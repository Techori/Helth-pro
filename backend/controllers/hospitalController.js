const Hospital = require('../models/Hospital');

// Seed initial data
const seedInitialData = async () => {
  try {
    const count = await Hospital.countDocuments();
    if (count === 0) {
      const initialHospitals = [
        {
          _id: "HSP12345",
          name: "City General Hospital",
          location: "Mumbai, Maharashtra",
          contactPerson: "Dr. Rajesh Kumar",
          phone: "9876543210",
          email: "info@citygeneralhospital.com",
          services: ["General", "Cardiology", "Orthopedics", "Neurology"],
          status: "Pending",
          totalPatients: 0,
          totalTransactions: 0,
          currentBalance: 0
        },
        {
          _id: "HSP12346",
          name: "Wellness Multispecialty Hospital",
          location: "Delhi, Delhi",
          contactPerson: "Dr. Priya Sharma",
          phone: "9876543211",
          email: "contact@wellnesshospital.com",
          services: ["General", "Gynecology", "Pediatrics", "ENT"],
          status: "Pending",
          totalPatients: 0,
          totalTransactions: 0,
          currentBalance: 0
        },
        {
          _id: "HSP12340",
          name: "Apollo Hospitals",
          location: "Chennai, Tamil Nadu",
          contactPerson: "Dr. Sudha Rao",
          phone: "9876543200",
          email: "contact@apollohospitals.com",
          services: ["General", "Cardiology", "Neurology", "Gastroenterology"],
          status: "Active",
          totalPatients: 2450,
          totalTransactions: 3250000,
          currentBalance: 175000
        }
      ];

      await Hospital.insertMany(initialHospitals);
      console.log('Initial hospital data seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

// Call seed function when the controller is loaded
seedInitialData();

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Error fetching hospitals' });
  }
};

// Get hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    console.log('Fetching hospital with ID:', req.params.id);
    const hospital = await Hospital.findById(req.params.id);
    
    if (!hospital) {
      console.log('Hospital not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Hospital not found' });
    }

    console.log('Found hospital:', {
      id: hospital._id,
      name: hospital.name,
      currentBalance: hospital.currentBalance
    });

    res.json({
      _id: hospital._id,
      name: hospital.name,
      currentBalance: hospital.currentBalance,
      status: hospital.status,
      totalTransactions: hospital.totalTransactions
    });
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ message: 'Error fetching hospital' });
  }
};

// Add new hospital registration
exports.addHospital = async (req, res) => {
  try {
    const { name, location, contactPerson, phone, email, services } = req.body;

    // Check if email already exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate a new hospital ID
    const lastHospital = await Hospital.findOne().sort({ _id: -1 });
    const lastId = lastHospital ? parseInt(lastHospital._id.replace('HSP', '')) : 12339;
    const newId = `HSP${lastId + 1}`;

    const hospital = new Hospital({
      _id: newId,
      name,
      location,
      contactPerson,
      phone,
      email,
      services,
      status: 'Pending'
    });

    await hospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    console.error('Error adding hospital:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding hospital' });
  }
};

// Approve hospital registration
exports.approveHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { status: 'Active' },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Error approving hospital:', error);
    res.status(500).json({ message: 'Error approving hospital' });
  }
};

// Reject hospital registration
exports.rejectHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Error rejecting hospital:', error);
    res.status(500).json({ message: 'Error rejecting hospital' });
  }
};

// Update hospital details
exports.updateHospital = async (req, res) => {
  try {
    const { name, location, contactPerson, phone, email, services } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingHospital = await Hospital.findOne({ email, _id: { $ne: req.params.id } });
      if (existingHospital) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { name, location, contactPerson, phone, email, services },
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Error updating hospital:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating hospital' });
  }
};

// Delete hospital
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({ message: 'Error deleting hospital' });
  }
}; 