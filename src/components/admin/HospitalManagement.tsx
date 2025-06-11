import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Eye, UserCog, Lock, MoreHorizontal, Phone, Building, Mail, Check, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  // Mock data
  const mockPendingHospitals: Hospital[] = [
    {
      _id: "HSP12345",
      name: "City General Hospital",
      location: "Mumbai, Maharashtra",
      contactPerson: "Dr. Rajesh Kumar",
      phone: "9876543210",
      email: "info@citygeneralhospital.com",
      services: ["General", "Cardiology", "Orthopedics", "Neurology"],
      registrationDate: "22/11/2023",
      status: "Pending",
      totalPatients: 0,
      totalTransactions: 0,
      currentBalance: 0
    },
    {
      _id: "HSP12346",
      name: "Wellness Multispecialty Hospital",
      location: "Delhi, Delhi",
      contactPerson: "Dr. Priya Sharma",
      phone: "9876543211",
      email: "contact@wellnesshospital.com",
      services: ["General", "Gynecology", "Pediatrics", "ENT"],
      registrationDate: "21/11/2023",
      status: "Pending",
      totalPatients: 0,
      totalTransactions: 0,
      currentBalance: 0
    },
    {
      _id: "HSP12347",
      name: "LifeCare Medical Center",
      location: "Bangalore, Karnataka",
      contactPerson: "Dr. Anand Reddy",
      phone: "9876543212",
      email: "info@lifecaremedical.com",
      services: ["General", "Oncology", "Cardiology", "Dermatology"],
      registrationDate: "20/11/2023",
      status: "Pending",
      totalPatients: 0,
      totalTransactions: 0,
      currentBalance: 0
    },
  ];

  const mockActiveHospitals: Hospital[] = [
    {
      _id: "HSP12340",
      name: "Apollo Hospitals",
      location: "Chennai, Tamil Nadu",
      contactPerson: "Dr. Sudha Rao",
      phone: "9876543200",
      email: "contact@apollohospitals.com",
      services: ["General", "Cardiology", "Neurology", "Gastroenterology"],
      registrationDate: "15/10/2023",
      status: "Active",
      totalPatients: 2450,
      totalTransactions: 3250000,
      currentBalance: 175000,
    },
    {
      _id: "HSP12341",
      name: "Fortis Healthcare",
      location: "Gurgaon, Haryana",
      contactPerson: "Dr. Vikram Mehta",
      phone: "9876543201",
      email: "info@fortishealthcare.com",
      services: ["General", "Orthopedics", "Cardiology", "Oncology"],
      registrationDate: "10/10/2023",
      status: "Active",
      totalPatients: 1850,
      totalTransactions: 2875000,
      currentBalance: 125000,
    },
  ];

  const [pendingHospitals, setPendingHospitals] = useState<Hospital[]>(mockPendingHospitals);
  const [activeHospitals, setActiveHospitals] = useState<Hospital[]>(mockActiveHospitals);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactPerson: '',
    phone: '',
    email: '',
    services: [] as string[]
  });

  // Load data from localStorage on component mount
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

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pendingHospitals', JSON.stringify(pendingHospitals));
    localStorage.setItem('activeHospitals', JSON.stringify(activeHospitals));
  }, [pendingHospitals, activeHospitals]);

  // Fetch hospitals from API and merge with mock data
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/hospitals');
      const apiHospitals = response.data;
      
      // Merge API data with mock data
      const apiPendingHospitals = apiHospitals.filter(h => h.status === 'Pending');
      const apiActiveHospitals = apiHospitals.filter(h => h.status === 'Active');

      // Combine mock and API data, removing duplicates based on _id
      const combinedPendingHospitals = [...mockPendingHospitals];
      const combinedActiveHospitals = [...mockActiveHospitals];

      apiPendingHospitals.forEach(apiHospital => {
        if (!combinedPendingHospitals.some(mock => mock._id === apiHospital._id)) {
          combinedPendingHospitals.push(apiHospital);
        }
      });

      apiActiveHospitals.forEach(apiHospital => {
        if (!combinedActiveHospitals.some(mock => mock._id === apiHospital._id)) {
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

  const handleViewHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleApproveHospital = async () => {
    try {
      if (!selectedHospital) return;

      // Create new active hospital entry
      const newActiveHospital: Hospital = {
        ...selectedHospital,
        status: "Active" as const,
        totalPatients: 0,
        totalTransactions: 0,
        currentBalance: 0,
      };

      // Update both lists
      setPendingHospitals(prev => prev.filter(h => h._id !== selectedHospital._id));
      setActiveHospitals(prev => [newActiveHospital, ...prev]);

      // Try to update in API
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

      // Remove from pending list
      setPendingHospitals(prev => prev.filter(h => h._id !== selectedHospital._id));

      // Try to update in API
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
      services: hospital.services
    });
    setIsManageDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const services = e.target.value.split(',').map(service => service.trim());
    setFormData(prev => ({
      ...prev,
      services
    }));
  };

  const handleUpdateHospital = async () => {
    try {
      if (!editingHospital) return;

      const updateData = {
        name: formData.name,
        location: formData.location,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        services: formData.services
      };

      // Update active hospitals list
      setActiveHospitals(prev => 
        prev.map(hospital => 
          hospital._id === editingHospital._id 
            ? { ...hospital, ...updateData }
            : hospital
        )
      );

      // Try to update in API
      try {
        await axios.put(
          `/api/hospitals/${editingHospital._id}`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        console.error('Error updating API:', error);
      }

      toast({
        title: "Success",
        description: "Hospital details updated successfully.",
      });

      setIsManageDialogOpen(false);
      setEditingHospital(null);
    } catch (error) {
      console.error('Error updating hospital:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update hospital details.",
        variant: "destructive",
      });
    }
  };

  const filteredActiveHospitals = activeHospitals.filter(
    hospital => 
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  const [isAddingStaff, setIsAddingStaff] = useState(false);

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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {hospital.status}
                      </span>
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
                    <TableCell>{hospital.currentBalance}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {hospital.status}
                      </span>
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
            <Button variant="outline">Export Hospital List</Button>
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
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
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
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                onClick={() => setIsManageDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleUpdateHospital}
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalManagement;
