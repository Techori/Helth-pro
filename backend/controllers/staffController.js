const Staff = require('../models/Staff');

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Error fetching staff members' });
  }
};

// Get staff member by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ message: 'Error fetching staff member' });
  }
};

// Add new staff member
exports.addStaff = async (req, res) => {
  try {
    const { name, email, phone, role, hospital, department } = req.body;

    // Check if email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const staff = new Staff({
      name,
      email,
      phone,
      role,
      hospital,
      department
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    console.error('Error adding staff member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error adding staff member' });
  }
};

// Update staff member
exports.updateStaff = async (req, res) => {
  try {
    const { name, email, phone, role, hospital, department } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingStaff = await Staff.findOne({ email, _id: { $ne: req.params.id } });
      if (existingStaff) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, hospital, department },
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating staff member' });
  }
};

// Delete staff member
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ message: 'Error deleting staff member' });
  }
};

// Update staff status
exports.updateStaffStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    console.error('Error updating staff status:', error);
    res.status(500).json({ message: 'Error updating staff status' });
  }
}; 