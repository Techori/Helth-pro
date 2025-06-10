<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> 47dcb0b11a36dd18e16fb5c901d8d6ee3e9586e1
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Eye, UserCog, Lock, MoreHorizontal, Phone, Building, Mail } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
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
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HospitalUserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    hospital: "",
    role: "",
    department: "",
    status: "Active"
  });

  // Convert to state variable
  const [hospitalStaff, setHospitalStaff] = useState([
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
  ]);

  // Filter hospital staff based on search term and active tab
  const filteredStaff = hospitalStaff.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "managers") return matchesSearch && staff.role.includes("Manager");
    if (activeTab === "finance") return matchesSearch && (staff.role.includes("Finance") || staff.role.includes("Billing"));
    if (activeTab === "front-desk") return matchesSearch && staff.role.includes("Front Desk");
    if (activeTab === "relationship") return matchesSearch && staff.role.includes("Relationship");
    
    return matchesSearch;
  });

  const handleAddStaff = () => {
    // Validate form data
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.hospital || !newStaff.role || !newStaff.department) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Generate a new staff ID
    const newStaffId = `HS-${String(hospitalStaff.length + 1).padStart(3, '0')}`;

    // Create new staff object
    const staffToAdd = {
      id: newStaffId,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      hospital: newStaff.hospital,
      role: newStaff.role,
      department: newStaff.department,
      status: newStaff.status,
      lastLogin: "Never",
      registeredOn: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/')
    };

    // Add staff to the list using setState
    setHospitalStaff(prevStaff => [...prevStaff, staffToAdd]);

    // Reset form and close dialog
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      hospital: "",
      role: "",
      department: "",
      status: "Active"
    });
    setIsAddingStaff(false);

    // Show success toast
    toast({
      title: "Staff Added",
      description: `Staff member ${staffToAdd.name} has been added successfully.`,
    });
  };

  const handleUserAction = (action: string, userId: string, userName: string) => {
    switch (action) {
      case "view":
        toast({
          title: "View Staff Profile",
          description: `Viewing profile for ${userName} (${userId})`,
        });
        break;
      case "edit":
        toast({
          title: "Edit Staff",
          description: `Editing staff ${userName} (${userId})`,
        });
        break;
      case "reset":
        toast({
          title: "Reset Password",
          description: `Password reset link sent to ${userName}`,
        });
        break;
      case "suspend":
        toast({
          title: "Staff Suspended",
          description: `${userName} has been suspended`,
        });
        break;
      case "activate":
        toast({
          title: "Staff Activated",
          description: `${userName} has been activated`,
        });
        break;
      default:
        break;
    }
  };

  // Count different staff roles
  const managerCount = hospitalStaff.filter(staff => staff.role.includes("Manager")).length;
  const financeCount = hospitalStaff.filter(staff => staff.role.includes("Finance") || staff.role.includes("Billing")).length;
  const frontDeskCount = hospitalStaff.filter(staff => staff.role.includes("Front Desk")).length;
  const relationshipCount = hospitalStaff.filter(staff => staff.role.includes("Relationship")).length;
>>>>>>> 47dcb0b11a36dd18e16fb5c901d8d6ee3e9586e1

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
<<<<<<< HEAD
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
=======
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="p-4" onClick={() => setActiveTab("all")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-primary">{hospitalStaff.length}</div>
                <div className="text-sm font-medium">Total Staff</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("managers")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-indigo-500">{managerCount}</div>
                <div className="text-sm font-medium">Managers</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("finance")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-emerald-500">{financeCount}</div>
                <div className="text-sm font-medium">Finance Staff</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("front-desk")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-amber-500">{frontDeskCount}</div>
                <div className="text-sm font-medium">Front Desk</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("relationship")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-purple-500">{relationshipCount}</div>
                <div className="text-sm font-medium">Relationship Managers</div>
              </div>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="managers">Managers</TabsTrigger>
              <TabsTrigger value="finance">Finance Staff</TabsTrigger>
              <TabsTrigger value="front-desk">Front Desk</TabsTrigger>
              <TabsTrigger value="relationship">Relationship Managers</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredStaff.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.id}</TableCell>
                          <TableCell>{staff.name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                staff.role.includes("Manager") ? "border-indigo-500 text-indigo-600" : 
                                staff.role.includes("Finance") || staff.role.includes("Billing") ? "border-emerald-500 text-emerald-600" : 
                                staff.role.includes("Front Desk") ? "border-amber-500 text-amber-600" : 
                                staff.role.includes("Relationship") ? "border-purple-500 text-purple-600" : 
                                "border-gray-500"
                              }
                            >
                              {staff.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-muted-foreground" />
                              <span>{staff.hospital}</span>
                            </div>
                          </TableCell>
                          <TableCell>{staff.department}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{staff.phone}</span>
>>>>>>> 47dcb0b11a36dd18e16fb5c901d8d6ee3e9586e1
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{staff.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={staff.status === "Active" ? "default" : "outline"}
                              className={staff.status === "Active" ? "bg-green-500" : ""}
                            >
                              {staff.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{staff.lastLogin}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
<<<<<<< HEAD
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
=======
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUserAction("view", staff.id, staff.name)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction("edit", staff.id, staff.name)}>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Edit Staff
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction("reset", staff.id, staff.name)}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {staff.status === "Active" ? (
                                  <DropdownMenuItem onClick={() => handleUserAction("suspend", staff.id, staff.name)}>
                                    Suspend Staff
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUserAction("activate", staff.id, staff.name)}>
                                    Activate Staff
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <p className="text-muted-foreground">No staff found matching your search criteria</p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
>>>>>>> 47dcb0b11a36dd18e16fb5c901d8d6ee3e9586e1
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredStaff.length} of {hospitalStaff.length} staff members
            </p>
            <Button variant="outline">Export Staff List</Button>
          </div>
        </CardFooter>
      </Card>

<<<<<<< HEAD
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
=======
      {/* Add Staff Dialog */}
      <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Create a new staff account and set their role and department.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Select value={newStaff.hospital} onValueChange={(value) => setNewStaff({ ...newStaff, hospital: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="City General Hospital">City General Hospital</SelectItem>
                  <SelectItem value="Carewell Hospital">Carewell Hospital</SelectItem>
                  <SelectItem value="LifeCare Hospital">LifeCare Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newStaff.department} onValueChange={(value) => setNewStaff({ ...newStaff, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Front Desk">Front Desk</SelectItem>
                    <SelectItem value="Relationship">Relationship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>Add Staff</Button>
>>>>>>> 47dcb0b11a36dd18e16fb5c901d8d6ee3e9586e1
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalUserManagement;