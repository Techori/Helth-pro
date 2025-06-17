// Using direct fetch `${LOCAL_API_URL}/face-auth/isRegistered`against local dev API
const LOCAL_API_URL =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://helth-pro.onrender.com/api"
    : "http://localhost:4000/api";

// Data interfaces for face authentication
interface FaceData {
  emailId: string;
  faceImage?: string;
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
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token missing.");
    // Get user email
    const userRes = await fetch(`${LOCAL_API_URL}/users/get`, {
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    });
    if (!userRes.ok) throw new Error("Failed to fetch user data");
    const userData = await userRes.json();
    const emailId = userData.email;
    if (!emailId) throw new Error("User email not found");
    const reqBody = { ...faceData, emailId };
    // Register face data
    const res = await fetch(`${LOCAL_API_URL}/face-auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(reqBody),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Registration failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Face registration failed:", error);
    throw error;
  }
};

/**
 * Verify face data during payment process
 */
export const verifyFace = async (
  verificationData: FaceData
): Promise<VerificationResult> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token missing.");
    const { emailId, descriptor } = verificationData;
    const reqBody = { emailId, descriptor };
    // Validate face data
    const res = await fetch(`${LOCAL_API_URL}/face-auth/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(reqBody),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Verification failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Face verification failed:", error);
    throw error;
  }
};

/**
 * Check if face data is registered for user or nominee
 */
export const isFaceRegistered = async (
  emailId: string,
  isNominee: boolean = false
): Promise<boolean> => {
  const params = new URLSearchParams({
    emailId,
    isNominee: isNominee.toString(),
  });
  const res = await fetch(
    `${LOCAL_API_URL}/face-auth/isRegistered?${params.toString()}`,
    { method: "GET" }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to check registration");
  }
  const data = await res.json();
  return data.isFind === 1;
};
