
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Check, X, Edit } from "lucide-react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LoanApproval = () => {
  // Mock data
  const [pendingLoans, setPendingLoans] = useState([
    {
      id: "LOAN-P12345",
      patientName: "Rahul Sharma",
      patientId: "PAT-23456",
      amount: 50000,
      purpose: "Heart Surgery",
      hospital: "City General Hospital",
      requestDate: "22/11/2023",
      status: "Pending"
    },
    {
      id: "LOAN-P12346",
      patientName: "Priya Patel",
      patientId: "PAT-23457",
      amount: 30000,
      purpose: "Dental Treatment",
      hospital: "Smile Dental Clinic",
      requestDate: "21/11/2023",
      status: "Pending"
    },
    {
      id: "LOAN-P12347",
      patientName: "Sameer Khan",
      patientId: "PAT-23458",
      amount: 75000,
      purpose: "Knee Replacement",
      hospital: "Orthopedic Specialty Hospital",
      requestDate: "20/11/2023",
      status: "Pending"
    },
  ]);

  const [recentLoans, setRecentLoans] = useState([
    {
      id: "LOAN-P12340",
      patientName: "Anita Desai",
      patientId: "PAT-23450",
      amount: 45000,
      purpose: "Maternity Care",
      hospital: "Mother & Child Hospital",
      requestDate: "18/11/2023",
      status: "Approved",
      approvedDate: "19/11/2023",
      approvedBy: "Admin User"
    },
    {
      id: "LOAN-P12341",
      patientName: "Vikram Singh",
      patientId: "PAT-23451",
      amount: 20000,
      purpose: "Orthopedic Treatment",
      hospital: "City General Hospital",
      requestDate: "17/11/2023",
      status: "Rejected",
      rejectedDate: "18/11/2023",
      rejectionReason: "Incomplete documentation"
    },
  ]);

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loanTerms, setLoanTerms] = useState({
    amount: 0,
    interestRate: "12",
    tenure: "24",
  });

  const handleViewLoan = (loan) => {
    setSelectedLoan(loan);
    setLoanTerms({
      amount: loan.amount,
      interestRate: "12",
      tenure: "24",
    });
  };

  const handleApproveLoan = () => {
    toast({
      title: "Loan Approved",
      description: `Loan ${selectedLoan.id} has been approved successfully.`,
    });
    
    // Update the pending loans list
    setPendingLoans(pendingLoans.filter(loan => loan.id !== selectedLoan.id));
    
    // Add to recent loans
    setRecentLoans([
      {
        ...selectedLoan,
        status: "Approved",
        approvedDate: new Date().toLocaleDateString('en-GB'),
        approvedBy: "Admin User"
      },
      ...recentLoans
    ]);
    
    setSelectedLoan(null);
  };

  const handleRejectLoan = () => {
    toast({
      title: "Loan Rejected",
      description: `Loan ${selectedLoan.id} has been rejected.`,
    });
    
    // Update the pending loans list
    setPendingLoans(pendingLoans.filter(loan => loan.id !== selectedLoan.id));
    
    // Add to recent loans
    setRecentLoans([
      {
        ...selectedLoan,
        status: "Rejected",
        rejectedDate: new Date().toLocaleDateString('en-GB'),
        rejectionReason: "Not eligible"
      },
      ...recentLoans
    ]);
    
    setSelectedLoan(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Loan Applications</CardTitle>
              <CardDescription>Review and process loan requests</CardDescription>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {pendingLoans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.id}</TableCell>
                    <TableCell>{loan.patientName}</TableCell>
                    <TableCell>{loan.patientId}</TableCell>
                    <TableCell>₹{loan.amount.toLocaleString()}</TableCell>
                    <TableCell>{loan.purpose}</TableCell>
                    <TableCell>{loan.hospital}</TableCell>
                    <TableCell>{loan.requestDate}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewLoan(loan)}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        
                        {selectedLoan && (
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Loan Application Review</DialogTitle>
                              <DialogDescription>
                                Review loan application details and approve or reject
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="patientName">Patient Name</Label>
                                  <Input 
                                    id="patientName" 
                                    value={selectedLoan.patientName} 
                                    readOnly 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="patientId">Patient ID</Label>
                                  <Input 
                                    id="patientId" 
                                    value={selectedLoan.patientId} 
                                    readOnly 
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="purpose">Purpose</Label>
                                <Input 
                                  id="purpose" 
                                  value={selectedLoan.purpose} 
                                  readOnly 
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="hospital">Hospital</Label>
                                <Input 
                                  id="hospital" 
                                  value={selectedLoan.hospital} 
                                  readOnly 
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="amount">Loan Amount</Label>
                                <Input 
                                  id="amount" 
                                  value={loanTerms.amount} 
                                  onChange={(e) => setLoanTerms({...loanTerms, amount: Number(e.target.value)})}
                                  type="number"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                                  <Select
                                    value={loanTerms.interestRate}
                                    onValueChange={(value) => setLoanTerms({...loanTerms, interestRate: value})}
                                  >
                                    <SelectTrigger id="interestRate">
                                      <SelectValue placeholder="Select rate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="9">9%</SelectItem>
                                      <SelectItem value="10">10%</SelectItem>
                                      <SelectItem value="11">11%</SelectItem>
                                      <SelectItem value="12">12%</SelectItem>
                                      <SelectItem value="13">13%</SelectItem>
                                      <SelectItem value="14">14%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="tenure">Tenure (Months)</Label>
                                  <Select
                                    value={loanTerms.tenure}
                                    onValueChange={(value) => setLoanTerms({...loanTerms, tenure: value})}
                                  >
                                    <SelectTrigger id="tenure">
                                      <SelectValue placeholder="Select tenure" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="12">12 Months</SelectItem>
                                      <SelectItem value="18">18 Months</SelectItem>
                                      <SelectItem value="24">24 Months</SelectItem>
                                      <SelectItem value="36">36 Months</SelectItem>
                                      <SelectItem value="48">48 Months</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Monthly EMI</Label>
                                <div className="text-xl font-bold p-2 border rounded-md mt-1 bg-gray-50">
                                  ₹{Math.round((loanTerms.amount * (1 + (Number(loanTerms.interestRate) / 100) * Number(loanTerms.tenure) / 12)) / Number(loanTerms.tenure)).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <div className="flex gap-2 w-full">
                                <Button variant="outline" className="flex-1" onClick={handleRejectLoan}>
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                                <Button className="flex-1" onClick={handleApproveLoan}>
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
              <p className="text-muted-foreground">No pending loan applications</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Applications</CardTitle>
          <CardDescription>Recently processed loan requests</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLoans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.id}</TableCell>
                    <TableCell>{loan.patientName}</TableCell>
                    <TableCell>₹{loan.amount.toLocaleString()}</TableCell>
                    <TableCell>{loan.hospital}</TableCell>
                    <TableCell>{loan.requestDate}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        loan.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {loan.status}
                      </span>
                    </TableCell>
                    <TableCell>{loan.status === 'Approved' ? loan.approvedDate : loan.rejectedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No recent loan applications</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">View All Loan Applications</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoanApproval;
