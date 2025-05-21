import { apiRequest } from "./api";
import { AuthUser, UserRole } from "@/types/app.types";

export const loginUser = async (email: string, password: string) => {
  try {
    // Login request to get token
    const data = await apiRequest("/auth", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!data.token) {
      throw new Error("No authentication token received");
    }

    // Store the token
    localStorage.setItem("token", data.token);

    // Get user data
    const userData = await getCurrentUser();
    return { user: userData, error: null };
  } catch (error: any) {
    console.error("Login failed:", error);
    return { user: null, error };
  }
};

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole = "patient"
) => {
  try {
    // Register request
    const data = await apiRequest("/users/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role,
      }),
    });

    if (!data.token) {
      throw new Error("No authentication token received");
    }

    // Store the token
    localStorage.setItem("token", data.token);

    // Get user data
    const userData = await getCurrentUser();
    return { user: userData, error: null };
  } catch (error: any) {
    console.error("Registration failed:", error);
    return { user: null, error };
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const userData = await apiRequest("/auth");
    return {
      id: userData._id,
      email: userData.email,
      role: userData.role as UserRole,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const checkAuthToken = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};
