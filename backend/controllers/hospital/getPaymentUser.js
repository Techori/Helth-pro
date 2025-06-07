const Patient = require("../../models/Patient");

const getPaymentUser = async (req, res) => {
  const { searchTerm } = req.query;
  if (!searchTerm) {
    return res.status(400).json({ message: "Search term is required" });
  }
  try {
    const patient = searchTerm.startsWith("RIMC-")
      ? await Patient.findOne({ cardNumber: searchTerm })
      : await Patient.findOne({ email: searchTerm });
    if (patient) {
      return res.status(200).json(patient);
    }
    return res.status(404).json({ message: "Patient not found" });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getPaymentUser };
