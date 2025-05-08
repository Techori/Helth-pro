
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hospital, Check, X, Edit, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const HospitalManagement = () => {
  // Mock data
  const [pendingHospitals, setPendingHospitals] = useState([
    {
      id: "HSP12345",
      name: "City General Hospital",
      location: "Mumbai, Maharashtra",
      contactPerson: "Dr. Rajesh Kumar",
      phone: "9876543210",
      email: "info@citygeneralhospital.com",
      services: ["General", "Cardiology", "Orthopedics", "Neurology"],
      registrationDate: "22/11/2023",
      status: "Pending"
    },
    {
      id: "HSP12346",
      name: "Wellness Multispecialty Hospital",
      location: "Delhi, Delhi",
      contactPerson: "Dr. Priya Sharma",
      phone: "9876543211",
      email: "contact@wellnesshospital.com",
      services: ["General", "Gynecology", "Pediatrics", "ENT"],
      registrationDate: "21/11/2023",
      status: "Pending"
    },
    {
      id: "HSP12347",
      name: "LifeCare Medical Center",
      location: "Bangalore, Karnataka",
      contactPerson: "Dr. Anand Reddy",
      phone: "9876543212",
      email: "info@lifecaremedical.com",
      services: ["General", "Oncology", "Cardiology", "Dermatology"],
      registrationDate: "20/11/2023",
      status: "Pending"
    },
  ]);

  const [activeHospitals, setActiveHospitals] = useState([
    {
      id: "HSP12340",
      name: "Apollo Hospitals",
      location: "Chennai, Tamil Nadu",
      contactPerson: "Dr. Sudha Rao",
      phone: "9876543200",
      email: "contact@apollohospitals.com",
      services: ["General", "Cardiology", "Neurology", "Gastroenterology"],
      registrationDate: "15/10/2023",
      status: "Active",
      totalPatients: 2450,
      totalTransactions: "₹32,50,000",
      currentBalance: "₹1,75,000",
    },
    {
      id: "HSP12341",
      name: "Fortis Healthcare",
      location: "Gurgaon, Haryana",
      contactPerson: "Dr. Vikram Mehta",
      phone: "9876543201",
      email: "info@fortishealthcare.com",
      services: ["General", "Orthopedics", "Cardiology", "Oncology"],
      registrationDate: "10/10/2023",
      status: "Active",
      totalPatients: 1850,
      totalTransactions: "₹28,75,000",
      currentBalance: "₹1,25,000",
    },
  ]);

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewHospital = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleApproveHospital = () => {
    toast({
      title: "Hospital Approved",
      description: `${selectedHospital.name} has been approved successfully.`,
    });
    
    // Update the pending hospitals list
    setPendingHospitals(pendingHospitals.filter(hospital => hospital.id !== selectedHospital.id));
    
    // Add to active hospitals
    setActiveHospitals([
      {
        ...selectedHospital,
        status: "Active",
        totalPatients: 0,
        totalTransactions: "₹0",
        currentBalance: "₹0",
      },
      ...activeHospitals
    ]);
    
    setSelectedHospital(null);
  };

  const handleRejectHospital = () => {
    toast({
      title: "Hospital Rejected",
      description: `${selectedHospital.name}'s registration has been rejected.`,
    });
    
    // Update the pending hospitals list
    setPendingHospitals(pendingHospitals.filter(hospital => hospital.id !== selectedHospital.id));
    setSelectedHospital(null);
  };

  const filteredActiveHospitals = activeHospitals.filter(
    hospital => 
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Hospital Registrations</CardTitle>
              <CardDescription>Review and process hospital registration requests</CardDescription>
            </div>
            <Hospital className="h-8 w-8 text-primary" />
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
                  <TableRow key={hospital.id}>
                    <TableCell className="font-medium">{hospital.id}</TableCell>
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
                        
                        {selectedHospital && selectedHospital.id === hospital.id && (
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
                                    value={selectedHospital.id} 
                                    readOnly 
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="location">Location</Label>
                                <Input 
                                  id="location" 
                                  value={selectedHospital.location} 
                                  readOnly 
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="contactPerson">Contact Person</Label>
                                  <Input 
                                    id="contactPerson" 
                                    value={selectedHospital.contactPerson} 
                                    readOnly 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="phone">Phone Number</Label>
                                  <Input 
                                    id="phone" 
                                    value={selectedHospital.phone} 
                                    readOnly 
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input 
                                  id="email" 
                                  value={selectedHospital.email} 
                                  readOnly 
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="services">Services Offered</Label>
                                <div id="services" className="flex flex-wrap gap-2 mt-2">
                                  {selectedHospital.services.map((service, index) => (
                                    <span 
                                      key={index} 
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <div className="flex gap-2 w-full">
                                <Button variant="outline" className="flex-1" onClick={handleRejectHospital}>
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
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
                  <TableRow key={hospital.id}>
                    <TableCell className="font-medium">{hospital.id}</TableCell>
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
                      <Button variant="outline" size="sm">
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
          <Button variant="outline" className="ml-auto">View All Hospitals</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HospitalManagement;
