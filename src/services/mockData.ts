
import { Appointment } from "@/types/app.types";

export const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    patientName: "John Doe",
    patientId: "P12345",
    hospitalName: "City General Hospital",
    hospitalId: "H001",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "2025-06-15",
    time: "10:00 AM",
    status: "confirmed",
    reason: "Annual heart checkup",
    notes: ""
  },
  {
    id: "apt-002",
    patientName: "Jane Smith",
    patientId: "P12345",
    hospitalName: "Metro Healthcare",
    hospitalId: "H002",
    doctorName: "Dr. Michael Chen",
    specialty: "Dermatology",
    date: "2025-06-22",
    time: "02:30 PM",
    status: "pending",
    reason: "Skin allergy consultation",
    notes: ""
  },
  {
    id: "apt-003",
    patientName: "Robert Brown",
    patientId: "P54321",
    hospitalName: "City General Hospital",
    hospitalId: "H001",
    doctorName: "Dr. Lisa Wong",
    specialty: "Orthopedics",
    date: "2025-05-30",
    time: "11:15 AM",
    status: "completed",
    reason: "Follow-up after knee surgery",
    notes: "Patient recovering well"
  }
];

export const mockTransactions = [
  {
    id: "trx-001",
    user_id: "P12345",
    amount: 1500,
    type: "payment",
    description: "Consultation fee",
    status: "completed",
    created_at: "2025-05-15T09:30:00Z"
  },
  {
    id: "trx-002",
    user_id: "P12345",
    amount: 5000,
    type: "payment",
    description: "Health card top-up",
    status: "completed",
    created_at: "2025-05-10T14:20:00Z"
  },
  {
    id: "trx-003",
    user_id: "P54321",
    amount: 3500,
    type: "payment",
    description: "Laboratory tests",
    status: "completed",
    created_at: "2025-05-12T11:45:00Z"
  }
];

// Add missing mock data needed for BookAppointment.tsx
export const mockHospitals = [
  {
    id: "H001",
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    rating: 4.5,
    specialties: ["Cardiology", "Orthopedics", "Neurology", "Pediatrics"]
  },
  {
    id: "H002",
    name: "Metro Healthcare",
    address: "456 Park Avenue, Midtown",
    rating: 4.2,
    specialties: ["Dermatology", "Ophthalmology", "ENT", "Psychiatry"]
  },
  {
    id: "H003",
    name: "Community Medical Center",
    address: "789 Garden Road, Westside",
    rating: 4.0,
    specialties: ["Family Medicine", "Internal Medicine", "Gynecology", "Pulmonology"]
  }
];

export const mockDoctors = [
  {
    id: "D001",
    name: "Dr. Sarah Johnson",
    hospitalId: "H001",
    specialty: "Cardiology",
    qualification: "MD, DM Cardiology",
    experience: 12,
    rating: 4.8,
    availability: ["Monday: 9AM - 2PM", "Wednesday: 10AM - 4PM", "Friday: 11AM - 3PM"]
  },
  {
    id: "D002",
    name: "Dr. Michael Chen",
    hospitalId: "H002",
    specialty: "Dermatology",
    qualification: "MBBS, MD Dermatology",
    experience: 8,
    rating: 4.6,
    availability: ["Tuesday: 10AM - 6PM", "Thursday: 11AM - 7PM", "Saturday: 9AM - 1PM"]
  },
  {
    id: "D003",
    name: "Dr. Lisa Wong",
    hospitalId: "H001",
    specialty: "Orthopedics",
    qualification: "MBBS, MS Orthopedics",
    experience: 15,
    rating: 4.9,
    availability: ["Monday: 2PM - 6PM", "Wednesday: 9AM - 12PM", "Thursday: 3PM - 7PM"]
  },
  {
    id: "D004",
    name: "Dr. James Wilson",
    hospitalId: "H003",
    specialty: "Family Medicine",
    qualification: "MD Family Medicine",
    experience: 10,
    rating: 4.7,
    availability: ["Monday: 9AM - 5PM", "Tuesday: 9AM - 5PM", "Friday: 9AM - 1PM"]
  }
];
