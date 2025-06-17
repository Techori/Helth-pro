import { useState, useEffect } from "react";
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
import { apiRequest } from "../../services/api"

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
  const [isLoading, setIsLoading] = useState(true);
  const [newPatientInfo, setNewPatientInfo] = useState({
    name: "",
    age: "",
    gender: "male",
    phone: "",
    email: "",
    cardNumber: "",
  });

  const [patients, setPatients] = useState<Patient[]>([]);

  // Fetch patients when component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please log in to view patients.",
          });
          return;
        }

        console.log("Fetching patients...");
        const response = await fetch("/api/hospitals/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          throw new Error(data.msg || `Failed to fetch patients: ${response.status} ${response.statusText}`);
        }

        if (data.success && Array.isArray(data.patients)) {
          setPatients(data.patients);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch patients. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  const filteredPatients = patients.filter(patient => {
  // Return false if patient is null/undefined
  if (!patient) return false;

  const searchLower = searchTerm.toLowerCase();
  
  // Safely get values with fallbacks
  const name = patient.name?.toLowerCase() || '';
  const id = patient.id?.toLowerCase() || '';
  const cardNumber = patient.cardNumber === "Not Issued" 
    ? "not issued" 
    : patient.cardNumber?.toLowerCase() || '';
  const phone = patient.phone || '';

  // Check each field
  return (
    name.includes(searchLower) ||
    id.includes(searchLower) ||
    cardNumber.includes(searchLower) ||
    phone.includes(searchTerm)
  );
});

  const handleAddPatient = async () => {
    if (!newPatientInfo.name || !newPatientInfo.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields.",
      });
      return;
    }

    // Convert age to an integer
    const age = parseInt(newPatientInfo.age, 10);

    if (isNaN(age)) {
      toast({
        variant: "destructive",
        title: "Invalid Age",
        description: "Please enter a valid age.",
      });
      return;
    }

    const patientData = {
      ...newPatientInfo,
      age,
      gender: newPatientInfo.gender.toLowerCase(),
    };

    console.log("Adding patient with info:", patientData);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to add a patient.",
        });
        return;
      }

      const response = await fetch("/api/hospitals/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || "Failed to add patient");
      }

      if (data.success && data.patient) {
        // Update the patients list with the new patient
        setPatients(prevPatients => [data.patient, ...prevPatients]);
        
        // Reset form and close dialog
        setIsAddingPatient(false);
        setNewPatientInfo({
          name: "",
          age: "",
          gender: "male",
          phone: "",
          email: "",
          cardNumber: "",
        });

        toast({
          title: "Patient Added",
          description: `${data.patient.name} has been successfully added to the system.`,
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Something went wrong",
      });
    }
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
                      onChange={(e) => setNewPatientInfo({ ...newPatientInfo, name: e.target.value })}
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
                      onChange={(e) => setNewPatientInfo({ ...newPatientInfo, age: e.target.value })}
                      placeholder="Age"
                      type="number"
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor="gender">Gender</FormLabel>
                    <Select
                      value={newPatientInfo.gender}
                      onValueChange={(value) => setNewPatientInfo({ ...newPatientInfo, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                      onChange={(e) => setNewPatientInfo({ ...newPatientInfo, phone: e.target.value })}
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
                      onChange={(e) => setNewPatientInfo({ ...newPatientInfo, email: e.target.value })}
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
                      onChange={(e) => setNewPatientInfo({ ...newPatientInfo, cardNumber: e.target.value })}
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

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading patients...</span>
            </div>
          ) : filteredPatients.length > 0 ? (
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
                      <TableCell className="text-xs">{patient.phone}<br />{patient.email}</TableCell>
                      <TableCell className="font-mono text-xs">{patient.cardNumber}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.cardStatus === 'Active' ? 'bg-green-100 text-green-800' :
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
