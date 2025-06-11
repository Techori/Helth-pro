import { apiRequest } from './api';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  hospital: string;
  department: string;
  status: string;
  lastLogin: string;
}

export interface NewStaffMember {
  name: string;
  email: string;
  phone: string;
  role: string;
  hospital: string;
  department: string;
}

// Mock data for development and fallback
const mockStaffData: StaffMember[] = [
  {
    id: "HS-001",
    name: "Dr. Anil Kapoor",
    email: "anil.kapoor@citygeneralhospital.com",
    phone: "+91 9876543210",
    role: "Hospital Manager",
    hospital: "City General Hospital",
    department: "Administration",
    status: "Active",
    lastLogin: "06/04/2025 10:23 AM"
  },
  {
    id: "HS-002",
    name: "Meena Shah",
    email: "meena.shah@citygeneralhospital.com",
    phone: "+91 9876543211",
    role: "Billing Staff",
    hospital: "City General Hospital",
    department: "Finance",
    status: "Active",
    lastLogin: "06/04/2025 09:45 AM"
  },
  {
    id: "HS-003",
    name: "Rahul Verma",
    email: "rahul.verma@citygeneralhospital.com",
    phone: "+91 9876543212",
    role: "Front Desk Staff",
    hospital: "City General Hospital",
    department: "Reception",
    status: "Active",
    lastLogin: "06/04/2025 08:30 AM"
  },
  {
    id: "HS-004",
    name: "Sunita Patel",
    email: "sunita.patel@citygeneralhospital.com",
    phone: "+91 9876543213",
    role: "Finance Staff",
    hospital: "City General Hospital",
    department: "Finance",
    status: "Active",
    lastLogin: "05/04/2025 04:15 PM"
  },
  {
    id: "HS-005",
    name: "Dr. Raj Malhotra",
    email: "raj.malhotra@lifecarehospital.com",
    phone: "+91 9876543214",
    role: "Hospital Manager",
    hospital: "LifeCare Hospital",
    department: "Administration",
    status: "Active",
    lastLogin: "06/04/2025 11:10 AM"
  },
  {
    id: "HS-006",
    name: "Pooja Singh",
    email: "pooja.singh@lifecarehospital.com",
    phone: "+91 9876543215",
    role: "Relationship Manager",
    hospital: "LifeCare Hospital",
    department: "Marketing",
    status: "Active",
    lastLogin: "05/04/2025 02:30 PM"
  },
  {
    id: "HS-007",
    name: "Vikram Agarwal",
    email: "vikram.agarwal@citymedicalcenter.com",
    phone: "+91 9876543216",
    role: "Finance Staff",
    hospital: "City Medical Center",
    department: "Finance",
    status: "Inactive",
    lastLogin: "01/04/2025 10:45 AM"
  },
  {
    id: "HS-008",
    name: "Neha Reddy",
    email: "neha.reddy@citymedicalcenter.com",
    phone: "+91 9876543217",
    role: "Front Desk Staff",
    hospital: "City Medical Center",
    department: "Reception",
    status: "Active",
    lastLogin: "06/04/2025 09:20 AM"
  }
];

// In-memory storage for development
let staffData = [...mockStaffData];

// Get all staff members
export const getAllStaff = async (): Promise<StaffMember[]> => {
  try {
    const response = await apiRequest('/staff');
    return response;
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    return staffData;
  }
};

// Add a new staff member
export const addStaff = async (staffData: NewStaffMember): Promise<StaffMember> => {
  try {
    const response = await apiRequest('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData)
    });
    return response;
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    // Generate a new ID for mock data
    const newId = `HS-${String(staffData.length + 1).padStart(3, '0')}`;
    const newStaff: StaffMember = {
      ...staffData,
      id: newId,
      status: "Active",
      lastLogin: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    staffData.push(newStaff);
    return newStaff;
  }
};

// Update a staff member
export const updateStaff = async (id: string, staffData: Partial<NewStaffMember>): Promise<StaffMember> => {
  try {
    const response = await apiRequest(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData)
    });
    return response;
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    const index = staffData.findIndex(staff => staff.id === id);
    if (index === -1) throw new Error('Staff member not found');
    staffData[index] = { ...staffData[index], ...staffData };
    return staffData[index];
  }
};

// Delete a staff member
export const deleteStaff = async (id: string): Promise<void> => {
  try {
    await apiRequest(`/staff/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    const index = staffData.findIndex(staff => staff.id === id);
    if (index === -1) throw new Error('Staff member not found');
    staffData.splice(index, 1);
  }
};

// Get staff member by ID
export const getStaffById = async (id: string): Promise<StaffMember> => {
  try {
    const response = await apiRequest(`/staff/${id}`);
    return response;
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    const staff = staffData.find(staff => staff.id === id);
    if (!staff) throw new Error('Staff member not found');
    return staff;
  }
};

// Update staff status (activate/suspend)
export const updateStaffStatus = async (id: string, status: 'Active' | 'Inactive'): Promise<StaffMember> => {
  try {
    const response = await apiRequest(`/staff/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return response;
  } catch (error) {
    console.warn('Using mock data due to API error:', error);
    const index = staffData.findIndex(staff => staff.id === id);
    if (index === -1) throw new Error('Staff member not found');
    staffData[index] = { ...staffData[index], status };
    return staffData[index];
  }
}; 