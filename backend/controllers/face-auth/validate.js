const { validationResult } = require("express-validator");
const FaceData = require("../../models/FaceData");

// Validate face during payment process
const validate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { emailId, descriptor } = req.body;

    // Find patient's face data (both self and nominee)
    const faceRecords = await FaceData.find({
      emailId: emailId,
    });

    if (faceRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No face data registered for this patient",
      });
    }

    // Compare with submitted face descriptor
    let bestMatch = null;
    let bestScore = 999;

    for (const record of faceRecords) {
      // Calculate Euclidean distance between face descriptors
      const distance = calculateFaceDistance(descriptor, record.descriptor);

      if (distance < bestScore) {
        bestScore = distance;
        bestMatch = record;
      }
    }

    // Threshold for face similarity (typically 0.5-0.6 is good)
    const MATCH_THRESHOLD = 0.6;

    if (bestScore <= MATCH_THRESHOLD) {
      // Successful match
      return res.json({
        success: true,
        isNominee: bestMatch.isNominee,
        score: bestScore,
        message: `Face verified successfully as ${
          bestMatch.isNominee ? "nominee" : "patient"
        }`,
      });
    } else {
      // No match found
      return res.status(401).json({
        success: false,
        score: bestScore,
        message: "Face verification failed - no matching face data found",
      });
    }
  } catch (err) {
    console.error("Error validating face:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Helper function to calculate Euclidean distance between face descriptors
function calculateFaceDistance(descriptor1, descriptor2) {
  if (
    !descriptor1 ||
    !descriptor2 ||
    descriptor1.length !== descriptor2.length
  ) {
    throw new Error("Invalid descriptor comparison");
  }

  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const diff = descriptor1[i] - descriptor2[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

module.exports = validate;
