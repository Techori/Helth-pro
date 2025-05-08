import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, CreditCard, FileText, Clock } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label as FormLabel } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  cardNumber: string;
  cardStatus: "Active" | "Inactive" | "Not Issued";
  cardBalance: number;
  lastVisit: string;
}

const PatientManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatientInfo, setNewPatientInfo] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    cardNumber: "",
  });

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P12345",
      name: "Rahul Sharma",
      age: 34,
      gender: "Male",
      phone: "9876543210",
      email: "rahul.sharma@example.com",
      cardNumber: "HC-1234-5678-9012",
      cardStatus: "Active",
      cardBalance: 15000,
      lastVisit: "15 Nov 2023"
    },
    {
      id: "P67890",
      name: "Priya Patel",
      age: 28,
      gender: "Female",
      phone: "8765432109",
      email: "priya.patel@example.com",
      cardNumber: "HC-5678-9012-3456",
      cardStatus: "Active",
      cardBalance: 8500,
      lastVisit: "12 Nov 2023"
    },
    {
      id: "P24680",
      name: "Amit Kumar",
      age: 45,
      gender: "Male",
      phone: "7654321098",
      email: "amit.kumar@example.com",
      cardNumber: "HC-9012-3456-7890",
      cardStatus: "Inactive",
      cardBalance: 0,
      lastVisit: "5 Nov 2023"
    },
    {
      id: "P13579",
      name: "Sneha Reddy",
      age: 31,
      gender: "Female",
      phone: "6543210987",
      email: "sneha.reddy@example.com",
      cardNumber: "Not Issued",
      cardStatus: "Not Issued",
      cardBalance: 0,
      lastVisit: "Never"
    },
  ]);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleAddPatient = () => {
    if (!newPatientInfo.name || !newPatientInfo.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields.",
      });
      return;
    }

    const newPatient: Patient = {
      id: `P${Math.floor(10000 + Math.random() * 90000)}`,
      name: newPatientInfo.name,
      age: parseInt(newPatientInfo.age) || 0,
      gender: newPatientInfo.gender,
      phone: newPatientInfo.phone,
      email: newPatientInfo.email,
      cardNumber: newPatientInfo.cardNumber || "Not Issued",
      cardStatus: newPatientInfo.cardNumber ? "Active" : "Not Issued",
      cardBalance: 0,
      lastVisit: "Today"
    };

    setPatients([newPatient, ...patients]);
    setIsAddingPatient(false);
    setNewPatientInfo({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      email: "",
      cardNumber: "",
    });

    toast({
      title: "Patient Added",
      description: `${newPatient.name} has been successfully added to the system.`,
    });
  };

  const handleVerifyCard = (patient: Patient) => {
    toast({
      title: "Card Verified",
      description: `${patient.name}'s health card is ${patient.cardStatus} with a balance of ₹${patient.cardBalance.toLocaleString()}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>
              Manage patients, verify health cards, and track visit history
            </CardDescription>
          </div>
          <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <span>Add Patient</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter patient details to add them to the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="name">Patient Name*</FormLabel>
                    <Input
                      id="name"
                      value={newPatientInfo.name}
                      onChange={(e) => setNewPatientInfo({...newPatientInfo, name: e.target.value})}
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel htmlFor="age">Age</FormLabel>
                    <Input
                      id="age"
                      value={newPatientInfo.age}
                      onChange={(e) => setNewPatientInfo({...newPatientInfo, age: e.target.value})}
                      placeholder="Age"
                      type="number"
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <Select 
                      value={newPatientInfo.gender}
                      onValueChange={(value) => setNewPatientInfo({...newPatientInfo, gender: value})}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="phone">Phone Number*</FormLabel>
                    <Input
                      id="phone"
                      value={newPatientInfo.phone}
                      onChange={(e) => setNewPatientInfo({...newPatientInfo, phone: e.target.value})}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <Input
                      id="email"
                      value={newPatientInfo.email}
                      onChange={(e) => setNewPatientInfo({...newPatientInfo, email: e.target.value})}
                      placeholder="Email Address"
                      type="email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="card">Health Card Number (if available)</FormLabel>
                    <Input
                      id="card"
                      value={newPatientInfo.cardNumber}
                      onChange={(e) => setNewPatientInfo({...newPatientInfo, cardNumber: e.target.value})}
                      placeholder="HC-XXXX-XXXX-XXXX"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPatient(false)}>Cancel</Button>
                <Button onClick={handleAddPatient}>Add Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search patients by name, ID, card number or phone..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredPatients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age/Gender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Health Card</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age} / {patient.gender}</TableCell>
                      <TableCell className="text-xs">{patient.phone}<br/>{patient.email}</TableCell>
                      <TableCell className="font-mono text-xs">{patient.cardNumber}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.cardStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                          patient.cardStatus === 'Inactive' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.cardStatus}
                        </span>
                      </TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleVerifyCard(patient)}
                            disabled={patient.cardStatus === "Not Issued"}
                            title="Verify Card"
                          >
                            <CreditCard className="h-4 w-4" />
                            <span className="sr-only">Verify Card</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Treatment History"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Treatment History</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Schedule Appointment"
                          >
                            <Clock className="h-4 w-4" />
                            <span className="sr-only">Schedule Appointment</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-4 border rounded-md">
              <p className="text-muted-foreground">
                No patients found. Try a different search term or add a new patient.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientManagement;
