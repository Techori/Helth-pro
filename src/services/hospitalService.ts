
import { apiRequest } from './api';
import { Hospital } from '@/types/app.types';

// Get all hospitals
export const getAllHospitals = async (): Promise<Hospital[]> => {
  return apiRequest('/hospitals');
};

// Get hospital by ID
export const getHospitalById = async (id: string): Promise<Hospital> => {
  return apiRequest(`/hospitals/${id}`);
};

// Register a new hospital
export const registerHospital = async (hospitalData: Partial<Hospital>): Promise<Hospital> => {
  return apiRequest('/hospitals', {
    method: 'POST',
    body: JSON.stringify(hospitalData)
  });
};

// Update hospital
export const updateHospital = async (id: string, hospitalData: Partial<Hospital>): Promise<Hospital> => {
  return apiRequest(`/hospitals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hospitalData)
  });
};

// Get hospital status
export const getHospitalStatus = async (id: string): Promise<{ status: string }> => {
  return apiRequest(`/hospitals/${id}/status`);
};

// Get hospitals by status
export const getHospitalsByStatus = async (status: 'active' | 'pending' | 'inactive'): Promise<Hospital[]> => {
  return apiRequest(`/hospitals?status=${status}`);
};
