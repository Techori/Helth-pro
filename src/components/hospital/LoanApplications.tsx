
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CalendarDays, 
  Banknote 
} from "lucide-react";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface LoanApplication {
  id: string;
  patientName: string;
  patientId: string;
  treatmentType: string;
  amount: number;
  tenure: string;
  status: "Pending" | "Approved" | "Rejected" | "Disbursed";
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  dueDate?: string;
  emi?: number;
}

const LoanApplications = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingLoan, setIsAddingLoan] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const [newLoanInfo, setNewLoanInfo] = useState({
    patientName: "",
    patientId: "",
    treatmentType: "",
    amount: "",
    tenure: "12",
    interestRate: "12",
  });

  // Mock loan data
  const [loans, setLoans] = useState<LoanApplication[]>([
    {
      id: "LN-1001",
      patientName: "Rahul Sharma",
      patientId: "P12345",
      treatmentType: "Cardiac Surgery",
      amount: 250000,
      tenure: "24 months",
      status: "Approved",
      applicationDate: "15 Nov 2023",
      approvalDate: "17 Nov 2023",
      disbursementDate: "18 Nov 2023",
      dueDate: "18 Dec 2023",
      emi: 12500
    },
    {
      id: "LN-1002",
      patientName: "Priya Patel",
      patientId: "P67890",
      treatmentType: "Maternity Care",
      amount: 80000,
      tenure: "12 months",
      status: "Pending",
      applicationDate: "18 Nov 2023"
    },
    {
      id: "LN-1003",
      patientName: "Amit Kumar",
      patientId: "P24680",
      treatmentType: "Knee Replacement",
      amount: 150000,
      tenure: "18 months",
      status: "Disbursed",
      applicationDate: "10 Nov 2023",
      approvalDate: "12 Nov 2023",
      disbursementDate: "14 Nov 2023",
      dueDate: "14 Dec 2023",
      emi: 10000
    },
    {
      id: "LN-1004",
      patientName: "Sunita Reddy",
      patientId: "P13579",
      treatmentType: "Dental Treatment",
      amount: 45000,
      tenure: "6 months",
      status: "Rejected",
      applicationDate: "16 Nov 2023",
      approvalDate: "18 Nov 2023"
    }
  ]);

  const filteredLoans = loans.filter(loan => 
    (loan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === "all" || loan.status.toLowerCase() === activeTab.toLowerCase())
  );

  const handleAddLoan = () => {
    // Basic validation
    if (!newLoanInfo.patientName || !newLoanInfo.patientId || !newLoanInfo.amount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields.",
      });
      return;
    }

    const newLoan: LoanApplication = {
      id: `LN-${1000 + loans.length + 1}`,
      patientName: newLoanInfo.patientName,
      patientId: newLoanInfo.patientId,
      treatmentType: newLoanInfo.treatmentType,
      amount: parseInt(newLoanInfo.amount) || 0,
      tenure: `${newLoanInfo.tenure} months`,
      status: "Pending",
      applicationDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setLoans([newLoan, ...loans]);
    setIsAddingLoan(false);
    setNewLoanInfo({
      patientName: "",
      patientId: "",
      treatmentType: "",
      amount: "",
      tenure: "12",
      interestRate: "12",
    });

    toast({
      title: "Loan Application Submitted",
      description: `Loan application for ${newLoan.patientName} has been successfully submitted.`,
    });
  };

  const calculateEMI = () => {
    const principal = parseInt(newLoanInfo.amount) || 0;
    const interestRate = parseInt(newLoanInfo.interestRate) || 0;
    const tenureMonths = parseInt(newLoanInfo.tenure) || 0;
    
    if (principal <= 0 || tenureMonths <= 0) return 0;
    
    // Simple interest calculation for EMI
    const totalInterest = (principal * interestRate * (tenureMonths / 12)) / 100;
    const totalAmount = principal + totalInterest;
    return Math.round(totalAmount / tenureMonths);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Loan Applications</CardTitle>
            <CardDescription>
              Apply for patient loans and track application status
            </CardDescription>
          </div>
          <Dialog open={isAddingLoan} onOpenChange={setIsAddingLoan}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Loan Application</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Patient Loan Application</DialogTitle>
                <DialogDescription>
                  Fill in the details to submit a new loan application for the patient.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="patientId">Patient ID*</FormLabel>
                    <Input
                      id="patientId"
                      value={newLoanInfo.patientId}
                      onChange={(e) => setNewLoanInfo({...newLoanInfo, patientId: e.target.value})}
                      placeholder="Patient ID"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="patientName">Patient Name*</FormLabel>
                    <Input
                      id="patientName"
                      value={newLoanInfo.patientName}
                      onChange={(e) => setNewLoanInfo({...newLoanInfo, patientName: e.target.value})}
                      placeholder="Patient Name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="treatmentType">Treatment Type*</FormLabel>
                    <Input
                      id="treatmentType"
                      value={newLoanInfo.treatmentType}
                      onChange={(e) => setNewLoanInfo({...newLoanInfo, treatmentType: e.target.value})}
                      placeholder="Treatment Description"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <FormLabel htmlFor="amount">Loan Amount (₹)*</FormLabel>
                    <Input
                      id="amount"
                      value={newLoanInfo.amount}
                      onChange={(e) => setNewLoanInfo({...newLoanInfo, amount: e.target.value})}
                      placeholder="Amount"
                      type="number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel htmlFor="tenure">Loan Tenure</FormLabel>
                    <Select 
                      value={newLoanInfo.tenure}
                      onValueChange={(value) => setNewLoanInfo({...newLoanInfo, tenure: value})}
                    >
                      <SelectTrigger id="tenure">
                        <SelectValue placeholder="Select tenure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Months</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                        <SelectItem value="18">18 Months</SelectItem>
                        <SelectItem value="24">24 Months</SelectItem>
                        <SelectItem value="36">36 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FormLabel htmlFor="interestRate">Interest Rate (%)</FormLabel>
                    <Select 
                      value={newLoanInfo.interestRate}
                      onValueChange={(value) => setNewLoanInfo({...newLoanInfo, interestRate: value})}
                    >
                      <SelectTrigger id="interestRate">
                        <SelectValue placeholder="Select rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="14">14%</SelectItem>
                        <SelectItem value="16">16%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm font-medium mb-2">Loan Summary</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Principal Amount:</div>
                    <div className="font-medium">₹{parseFloat(newLoanInfo.amount || "0").toLocaleString()}</div>
                    
                    <div>Tenure:</div>
                    <div className="font-medium">{newLoanInfo.tenure} months</div>
                    
                    <div>Interest Rate:</div>
                    <div className="font-medium">{newLoanInfo.interestRate}% per annum</div>
                    
                    <div className="font-semibold">Monthly EMI:</div>
                    <div className="font-semibold">₹{calculateEMI().toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingLoan(false)}>Cancel</Button>
                <Button onClick={handleAddLoan}>Submit Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tabs and search */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Loans</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="disbursed">Disbursed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search loans..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Loans table */}
          {filteredLoans.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tenure</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>
                        {loan.patientName}<br/>
                        <span className="text-xs text-gray-500">{loan.patientId}</span>
                      </TableCell>
                      <TableCell>{loan.treatmentType}</TableCell>
                      <TableCell>₹{loan.amount.toLocaleString()}</TableCell>
                      <TableCell>{loan.tenure}</TableCell>
                      <TableCell>{loan.applicationDate}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          loan.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          loan.status === 'Disbursed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {loan.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View Details"
                          >
                            <Search className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                          {loan.status === "Disbursed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="EMI Schedule"
                            >
                              <CalendarDays className="h-4 w-4" />
                              <span className="sr-only">EMI Schedule</span>
                            </Button>
                          )}
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
                No loan applications found. Try a different search term or create a new application.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <div className="flex items-center space-x-1">
              <Banknote className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Disbursed</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Rejected</span>
            </div>
          </div>
          <Button variant="outline">View All Applications</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoanApplications;
