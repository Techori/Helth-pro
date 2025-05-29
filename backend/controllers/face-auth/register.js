const { validationResult } = require("express-validator");
const FaceData = require("../../models/FaceData");
// Import User to verify email ownership
const User = require("../../models/User");

// Register face data for a user or nominee
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { emailId, faceImage, descriptor, isNominee } = req.body;

    // Ensure the authenticated user owns the emailId or is admin
    const authUserId = req.user.id;
    const authUserRole = req.user.role;
    const userRecord = await User.findById(authUserId).select("-password");
    if (!userRecord) {
      return res.status(404).json({ msg: "Authenticated user not found" });
    }
    if (userRecord.email !== emailId && authUserRole !== "admin") {
      return res.status(401).json({
        msg: "Not authorized to register face for this user",
      });
    }

    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No authentication token provided" });
    }

    // Debug info to identify authentication issues
    console.log("Face registration request:");
    console.log("- Auth user ID:", authUserId);
    console.log("- Requested emailId:", emailId);
    console.log("- User role:", authUserRole);

    // Check if face data already exists for this user (same type - self or nominee)
    const existingFace = await FaceData.findOne({
      emailId: emailId,
      isNominee: isNominee,
    });

    if (existingFace) {
      // Update existing face data
      existingFace.faceImage = faceImage;
      existingFace.descriptor = descriptor;
      existingFace.registrationDate = new Date();
      await existingFace.save();

      return res.json({
        success: true,
        message: `${
          isNominee ? "Nominee" : "Patient"
        } face data updated successfully`,
      });
    }

    // Create new face data
    const newFaceData = new FaceData({
      emailId: emailId,
      faceImage,
      descriptor,
      isNominee,
    });

    await newFaceData.save();

    res.json({
      success: true,
      message: `${
        isNominee ? "Nominee" : "Patient"
      } face registered successfully`,
    });
  } catch (err) {
    console.error("Error registering face:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

module.exports = register;
