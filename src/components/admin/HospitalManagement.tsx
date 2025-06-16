import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Eye, UserCog, Lock, MoreHorizontal, Phone, Building, Mail, Check, Edit, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Hospital {
  _id: string;
  name: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  services: string[];
  registrationDate: string;
  status: 'Pending' | 'Active' | 'Rejected';
  totalPatients: number;
  totalTransactions: number;
  currentBalance: number;
}

const HospitalManagement = () => {
  const [pendingHospitals, setPendingHospitals] = useState<Hospital[]>([]);
  const [activeHospitals, setActiveHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactPerson: '',
    phone: '',
    email: '',
    services: [] as string[],
  });
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    hospital: '',
    role: '',
    department: '',
  });
  const STAFF_ROLES = [
  'Hospital Manager',
  'Finance Staff',
  'Front Desk Staff',
  'Relationship Manager',
  'Billing Staff'
];

const STAFF_DEPARTMENTS = [
  'Administration',
  'Finance',
  'Reception',
  'Marketing'
];

  useEffect(() => {
    const savedPendingHospitals = localStorage.getItem('pendingHospitals');
    const savedActiveHospitals = localStorage.getItem('activeHospitals');

    if (savedPendingHospitals) {
      setPendingHospitals(JSON.parse(savedPendingHospitals));
    }
    if (savedActiveHospitals) {
      setActiveHospitals(JSON.parse(savedActiveHospitals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pendingHospitals', JSON.stringify(pendingHospitals));
    localStorage.setItem('activeHospitals', JSON.stringify(activeHospitals));
  }, [pendingHospitals, activeHospitals]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hospitals');
      const apiHospitals = response.data;
      
      const apiPendingHospitals = apiHospitals.filter((h: Hospital) => h.status === 'Pending');
      const apiActiveHospitals = apiHospitals.filter((h: Hospital) => h.status === 'Active');

      const combinedPendingHospitals = [...pendingHospitals];
      const combinedActiveHospitals = [...activeHospitals];

      apiPendingHospitals.forEach((apiHospital: Hospital) => {
        if (!combinedPendingHospitals.some((mock) => mock._id === apiHospital._id)) {
          combinedPendingHospitals.push(apiHospital);
        }
      });

      apiActiveHospitals.forEach((apiHospital: Hospital) => {
        if (!combinedActiveHospitals.some((mock) => mock._id === apiHospital._id)) {
          combinedActiveHospitals.push(apiHospital);
        }
      });

      setPendingHospitals(combinedPendingHospitals);
      setActiveHospitals(combinedActiveHospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hospitals. Using mock data only.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleAddStaff = async () => {
  try {
    // Validate required fields
    if (!newStaff.name || !newStaff.email || !newStaff.role || !newStaff.hospital) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Email, Role, Hospital)",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStaff.email)) {
      toast({
        title: "Validation Error",
        description: "Invalid email address format",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const response = await axios.post('api/admin/add-staff', {
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      phone: newStaff.phone.trim(),
      hospitalId: newStaff.hospital.trim(),
      role: newStaff.role.trim(),
      department: newStaff.department.trim(),
    });

    toast({
      title: "Success",
      description: "Staff member added successfully",
    });

    // Reset form
    setNewStaff({
      name: '',
      email: '',
      phone: '',
      hospital: '',
      role: '',
      department: '',
    });
    setIsAddingStaff(false);

  } catch (error: any) {
    console.error("Error adding staff:", error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to add staff member",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const handleViewHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleApproveHospital = async () => {
    try {
      if (!selectedHospital) return;

      const newActiveHospital: Hospital = {
        ...selectedHospital,
        status: "Active",
        totalPatients: 0,
        totalTransactions: 0,
        currentBalance: 0,
      };

      setPendingHospitals((prev) => prev.filter((h) => h._id !== selectedHospital._id));
      setActiveHospitals((prev) => [newActiveHospital, ...prev]);

      try {
        await axios.patch(`/api/hospitals/${selectedHospital._id}/approve`);
      } catch (error) {
        console.error('Error updating API:', error);
      }

      toast({
        title: "Hospital Approved",
        description: `${selectedHospital.name} has been approved successfully.`,
      });

      setSelectedHospital(null);
    } catch (error) {
      console.error('Error approving hospital:', error);
      toast({
        title: "Error",
        description: "Failed to approve hospital. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectHospital = async () => {
    try {
      if (!selectedHospital) return;

      setPendingHospitals((prev) => prev.filter((h) => h._id !== selectedHospital._id));

      try {
        await axios.patch(`/api/hospitals/${selectedHospital._id}/reject`);
      } catch (error) {
        console.error('Error updating API:', error);
      }

      toast({
        title: "Hospital Rejected",
        description: `${selectedHospital.name}'s registration has been rejected.`,
      });

      setSelectedHospital(null);
    } catch (error) {
      console.error('Error rejecting hospital:', error);
      toast({
        title: "Error",
        description: "Failed to reject hospital. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManageHospital = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name,
      location: hospital.location,
      contactPerson: hospital.contactPerson,
      phone: hospital.phone,
      email: hospital.email,
      services: [...hospital.services],
    });
    setIsManageDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const services = e.target.value
      .split(',')
      .map((service) => service.trim())
      .filter((service) => service.length > 0);
    setFormData((prev) => ({
      ...prev,
      services,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Hospital name is required.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Location is required.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.contactPerson.trim()) {
      toast({
        title: "Validation Error",
        description: "Contact person is required.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
      toast({
        title: "Validation Error",
        description: "Invalid phone number.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      toast({
        title: "Validation Error",
        description: "Invalid email address.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleUpdateHospital = async () => {
    if (!editingHospital || isUpdating) return;

    if (!validateForm()) return;

    setIsUpdating(true);

    try {
      const updateData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        services: formData.services,
      };

      const previousActiveHospitals = [...activeHospitals];
      setActiveHospitals((prev) =>
        prev.map((hospital) =>
          hospital._id === editingHospital._id
            ? { ...hospital, ...updateData }
            : hospital
        )
      );

      try {
        const response = await axios.put(
          `/api/hospitals/${editingHospital._id}`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(response.data.message || 'Failed to update hospital');
        }
      } catch (apiError) {
        console.error('Error updating API:', apiError);
        setActiveHospitals(previousActiveHospitals);
        throw apiError;
      }

      toast({
        title: "Success",
        description: "Hospital details updated successfully.",
      });

      setIsManageDialogOpen(false);
      setEditingHospital(null);
      setFormData({
        name: '',
        location: '',
        contactPerson: '',
        phone: '',
        email: '',
        services: [],
      });
    } catch (error: any) {
      console.error('Error updating hospital:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update hospital details.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredActiveHospitals = activeHospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Hospital List", 20, 10);
    autoTable(doc, {
      head: [['ID', 'Name', 'Location', 'Contact Person', 'Phone', 'Email', 'Status']],
      body: activeHospitals.map(hospital => [
        hospital._id,
        hospital.name,
        hospital.location,
        hospital.contactPerson,
        hospital.phone,
        hospital.email,
        hospital.status,
      ]),
    });
    doc.save("hospital_list.pdf");
  };

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Hospital Staff Management</CardTitle>
              <CardDescription>Manage hospital staff and their roles across partner hospitals</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search staff..."
                  className="pl-8 max-w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsAddingStaff(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pendingHospitals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital ID</TableHead>
                  <TableHead>Hospital Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingHospitals.map((hospital) => (
                  <TableRow key={hospital._id}>
                    <TableCell className="font-medium">{hospital._id}</TableCell>
                    <TableCell>{hospital.name}</TableCell>
                    <TableCell>{hospital.location}</TableCell>
                    <TableCell>{hospital.contactPerson}</TableCell>
                    <TableCell>{hospital.registrationDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {hospital.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewHospital(hospital)}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        
                        {selectedHospital && selectedHospital._id === hospital._id && (
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Hospital Registration Review</DialogTitle>
                              <DialogDescription>
                                Review hospital details and approve or reject registration
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="hospitalName">Hospital Name</Label>
                                  <Input 
                                    id="hospitalName" 
                                    value={selectedHospital.name} 
                                    readOnly 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="hospitalId">Hospital ID</Label>
                                  <Input 
                                    id="hospitalId" 
                                    value={selectedHospital._id} 
                                    readOnly 
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{selectedHospital.email}</span>
                              </div>
                            </div>
                            <DialogFooter>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedHospital(null)}
                                >
                                  Cancel
                                </Button>
                                <Button className="flex-1" onClick={handleApproveHospital}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  className="flex-1" 
                                  onClick={handleRejectHospital}
                                >
                                  Reject
                                </Button>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No pending hospital registrations</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Hospitals</CardTitle>
              <CardDescription>Manage registered hospitals on the platform</CardDescription>
            </div>
            <div className="flex items-center w-[240px]">
              <Search className="w-4 h-4 mr-2 text-muted-foreground" />
              <Input 
                placeholder="Search hospitals..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActiveHospitals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital ID</TableHead>
                  <TableHead>Hospital Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Total Patients</TableHead>
                  <TableHead>Total Transactions</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActiveHospitals.map((hospital) => (
                  <TableRow key={hospital._id}>
                    <TableCell className="font-medium">{hospital._id}</TableCell>
                    <TableCell>{hospital.name}</TableCell>
                    <TableCell>{hospital.location}</TableCell>
                    <TableCell>{hospital.totalPatients}</TableCell>
                    <TableCell>{hospital.totalTransactions}</TableCell>
                    <TableCell>₹{hospital.currentBalance.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {hospital.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManageHospital(hospital)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No hospitals found matching your search criteria</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredActiveHospitals.length} of {activeHospitals.length} hospitals
            </p>
            <Button variant="outline" onClick={handleExportPDF}>Export Hospital List</Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Hospital</DialogTitle>
            <DialogDescription>
              Update hospital details and information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hospital Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter hospital name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input 
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="services">Services Offered (comma-separated)</Label>
              <Input 
                id="services"
                name="services"
                value={formData.services.join(', ')}
                onChange={handleServicesChange}
                placeholder="e.g., General, Cardiology, Orthopedics"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Total Patients</Label>
                <Input 
                  value={editingHospital?.totalPatients || 0}
                  readOnly
                />
              </div>
              <div>
                <Label>Current Balance</Label>
                <Input 
                  value={`₹${(editingHospital?.currentBalance || 0).toLocaleString()}`}
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setIsManageDialogOpen(false);
                  setEditingHospital(null);
                  setFormData({
                    name: '',
                    location: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    services: [],
                  });
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleUpdateHospital}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Staff Member Dialog */}
      <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Add New Staff Member</DialogTitle>
      <DialogDescription>
        Fill in the details to add a new staff member to the hospital.
      </DialogDescription>
    </DialogHeader>
    
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="staffName">Full Name*</Label>
          <Input
            id="staffName"
            value={newStaff.name}
            onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
            placeholder="Enter staff name"
          />
        </div>
        <div>
          <Label htmlFor="staffEmail">Email*</Label>
          <Input
            id="staffEmail"
            type="email"
            value={newStaff.email}
            onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
            placeholder="Enter email address"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="staffPhone">Phone</Label>
          <Input
            id="staffPhone"
            value={newStaff.phone}
            onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <Label htmlFor="staffHospital">Hospital*</Label>
          <select
            id="staffHospital"
            value={newStaff.hospital}
            onChange={(e) => setNewStaff({...newStaff, hospital: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Hospital</option>
            {activeHospitals.map((hospital) => (
              <option key={hospital._id} value={hospital._id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="staffRole">Role*</Label>
          <select
            id="staffRole"
            value={newStaff.role}
            onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Role</option>
            {STAFF_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="staffDepartment">Department*</Label>
          <select
            id="staffDepartment"
            value={newStaff.department}
            onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Department</option>
            {STAFF_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
    
    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setIsAddingStaff(false)}
      >
        Cancel
      </Button>
      <Button onClick={handleAddStaff} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Staff'
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default HospitalManagement;