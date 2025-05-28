const { validationResult } = require("express-validator");
const FaceData = require("../../models/FaceData");

// Register face data for a user or nominee
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { patientId, faceImage, descriptor, isNominee } = req.body;

    // Debug info to identify authentication issues
    console.log("Face registration request:");
    console.log(
      "- Auth token user ID:",
      req.user ? req.user.id : "No user in request"
    );
    console.log("- Requested patientId:", patientId);
    console.log("- User role:", req.user ? req.user.role : "Unknown");


    if (req.user.id !== patientId && req.user.role !== "admin") {
      return res.status(401).json({
        msg: "Not authorized to register face for this patient",
        authUser: req.user.id,
        requestedPatient: patientId,
      });
    }

    // Check if face data already exists for this user (same type - self or nominee)
    const existingFace = await FaceData.findOne({
      user: patientId,
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
      user: patientId,
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
