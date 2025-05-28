import { apiRequest } from "./api";

// Support both local and production environments
const USE_LOCAL_API = true;
const LOCAL_API_URL = "http://localhost:4000/api";
const PROD_API_URL = "https://helth-pro.onrender.com/api";
const API_URL = USE_LOCAL_API ? LOCAL_API_URL : PROD_API_URL;

interface FaceData {
  patientId: string;
  faceImage: string;
  descriptor: number[];
  isNominee?: boolean;
}

interface VerificationResult {
  success: boolean;
  isNominee?: boolean;
  score?: number;
  message: string;
}

/**
 * Register face data for a patient or nominee
 */
export const registerFace = async (
  faceData: FaceData
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(
      `Registering face for ${faceData.isNominee ? "nominee" : "patient"}`
    );

    // Get auth token - important for authorization check
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token missing. Please log in again.");
    }

    // Extract user ID from token and use it as patientId
    const loggedInUserId = getUserIdFromToken(token);
    console.log("Extracted user ID from token:", loggedInUserId);

    // Override the patientId with the ID from the token to match authentication
    const requestData = {
      ...faceData,
      patientId: loggedInUserId,
    };

    console.log("Face registration data:", requestData);

    // Use direct fetch to local server for face auth endpoints
    const response = await fetch(`${API_URL}/face-auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error("Face registration server response:", errorText);
      throw new Error(JSON.stringify(errorText));
    }

    const result = await response.json();
    console.log("Face registration result:", result);
    return result;
  } catch (error) {
    console.error("Face registration failed:", error);
    throw error;
  }
};

/**
 * Helper function to extract user ID from JWT token
 */
const getUserIdFromToken = (token: string): string => {
  try {
    // JWT tokens are in format: header.payload.signature
    const payload = token.split(".")[1];
    // Decode the base64 payload
    const decoded = atob(payload);
    console.log("Decoded JWT payload:", decoded);
    const decodedPayload = JSON.parse(decoded);

    // Check the structure of the decoded payload
    if (decodedPayload.user && decodedPayload.user.id) {
      return decodedPayload.user.id;
    } else if (decodedPayload.id) {
      return decodedPayload.id;
    } else {
      console.error("Could not find user ID in token payload:", decodedPayload);
      return "";
    }
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return "";
  }
};

/**
 * Verify face data during payment process
 */
export const verifyFace = async (
  verificationData: FaceData
): Promise<VerificationResult> => {
  try {
    console.log(`Verifying face for patient ID: ${verificationData.patientId}`);

    // Get auth token - important for authorization check
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token missing. Please log in again.");
    }

    // Extract user ID from token and use it as patientId
    const loggedInUserId = getUserIdFromToken(token);
    console.log(
      "Extracted user ID from token for verification:",
      loggedInUserId
    );

    // Override the patientId with the ID from the token to match authentication
    const requestData = {
      ...verificationData,
      patientId: loggedInUserId,
    };

    // Use direct fetch to local server for face auth endpoints
    const response = await fetch(`${API_URL}/face-auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.json();
      console.error("Face verification server response:", errorText);
      throw new Error(JSON.stringify(errorText));
    }

    const result = await response.json();
    console.log("Face verification result:", result);
    return result;
  } catch (error) {
    console.error("Face verification failed:", error);
    throw error;
  }
};
