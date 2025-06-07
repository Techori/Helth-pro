const face = require("../../models/FaceData");

module.exports = async (req, res) => {
  const { emailId, isNominee } = req.query;
  if (!emailId) {
    return res.status(400).json({ message: "Email ID is required" });
  }
  const query = { emailId };
  if (isNominee === "true") query.isNominee = true;
  else if (isNominee === "false") query.isNominee = false;
  try {
    const found = await face.findOne(query);
    return res.status(200).json({ isFind: found ? 1 : 0 });
  } catch (error) {
    console.error("Error checking face registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
