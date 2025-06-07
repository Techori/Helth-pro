
import { apiRequest } from './api';
import { Hospital } from '@/types/app.types';


// Get all hospitals
export const getAllHospitals = async (): Promise<Hospital[]> => {
  return apiRequest("/hospitals");
};

// Get hospital by Hospital ID
export const getHospitalByHospitalId = async (hospitalId: string): Promise<Hospital> => {
  return apiRequest(`/hospitals/${hospitalId}`);
};

// Register a new hospital
export const registerHospital = async (
  hospitalData: Partial<Hospital>
): Promise<Hospital> => {
  return apiRequest("/hospitals", {
    method: "POST",
    body: JSON.stringify(hospitalData),
  });
};


// Update hospital by Hospital ID
export const updateHospital = async (hospitalId: string, hospitalData: Partial<Hospital>): Promise<Hospital> => {
  return apiRequest(`/hospitals/${hospitalId}`, {
    method: 'PUT',
    body: JSON.stringify(hospitalData)
  });
};

// Get hospital status by Hospital ID
export const getHospitalStatus = async (hospitalId: string): Promise<{ status: string }> => {
  return apiRequest(`/hospitals/${hospitalId}/status`);
};

// Get hospitals by status
export const getHospitalsByStatus = async (
  status: "active" | "pending" | "inactive"
): Promise<Hospital[]> => {
  return apiRequest(`/hospitals?status=${status}`);

};

// Get user details at payment
export const getPaymentUser = async (searchTerm: string): Promise<any> => {
  return apiRequest(
    `/hospitals/get-user?searchTerm=${encodeURIComponent(searchTerm)}`
  );
};
// Get hospital analytics
export const getHospitalAnalytics = async (hospitalId: string) => {
  return apiRequest(`/hospitals/${hospitalId}/analytics`);
};

