
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Check, X, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAllLoans, updateLoanStatus, LoanData } from "@/services/loanService";

const LoanApproval = () => {
  const { toast } = useToast();
  const [allLoans, setAllLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanData | null>(null);
  const [loanTerms, setLoanTerms] = useState({
    amount: 0,
    interestRate: "12",
    tenure: "24",
  });
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const loans = await fetchAllLoans();
      setAllLoans(loans);
    } catch (error) {
      console.error('Failed to load loans:', error);
      toast({
        title: "Error",
        description: "Failed to load loans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingLoans = allLoans.filter(loan => 
    loan.status === 'submitted' || loan.status === 'under_review'
  );

  const recentLoans = allLoans.filter(loan => 
    loan.status === 'approved' || loan.status === 'rejected'
  ).slice(0, 10);

  const handleViewLoan = (loan: LoanData) => {
    setSelectedLoan(loan);
    setLoanTerms({
      amount: loan.loanDetails.requestedAmount,
      interestRate: loan.loanDetails.interestRate?.toString() || "12",
      tenure: loan.loanDetails.preferredTerm?.toString() || "24",
    });
  };

  const handleApproveLoan = async () => {
    if (!selectedLoan) return;

    try {
      await updateLoanStatus(selectedLoan._id, 'approved', {
        approvedAmount: loanTerms.amount,
        interestRate: Number(loanTerms.interestRate),
        term: Number(loanTerms.tenure)
      });

      toast({
        title: "Loan Approved",
        description: `Loan ${selectedLoan.applicationNumber} has been approved successfully.`,
      });

      await loadLoans();
      setSelectedLoan(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve loan. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectLoan = async () => {
    if (!selectedLoan) return;

    try {
      await updateLoanStatus(selectedLoan._id, 'rejected', {
        rejectionReason
      });

      toast({
        title: "Loan Rejected",
        description: `Loan ${selectedLoan.applicationNumber} has been rejected.`,
      });

      await loadLoans();
      setSelectedLoan(null);
      setRejectionReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject loan. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                  <TableHead>Application #</TableHead>
                  <TableHead>UHID</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingLoans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell className="font-medium">{loan.applicationNumber}</TableCell>
                    <TableCell>{loan.uhid}</TableCell>
                    <TableCell>{loan.medicalInfo?.treatmentRequired || 'N/A'}</TableCell>
                    <TableCell>₹{loan.loanDetails?.requestedAmount?.toLocaleString() || 0}</TableCell>
                    <TableCell>{new Date(loan.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {loan.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </TableCell>
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
                        
                        {selectedLoan && selectedLoan._id === loan._id && (
                          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Loan Application Review</DialogTitle>
                              <DialogDescription>
                                Review loan application details and approve or reject
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Application Number</Label>
                                  <Input value={selectedLoan.applicationNumber} readOnly />
                                </div>
                                <div>
                                  <Label>UHID</Label>
                                  <Input value={selectedLoan.uhid} readOnly />
                                </div>
                              </div>
                              
                              <div>
                                <Label>Treatment Required</Label>
                                <Input value={selectedLoan.medicalInfo?.treatmentRequired || 'N/A'} readOnly />
                              </div>
                              
                              <div>
                                <Label>Requested Amount</Label>
                                <Input value={`₹${selectedLoan.loanDetails?.requestedAmount?.toLocaleString() || 0}`} readOnly />
                              </div>
                              
                              <div>
                                <Label htmlFor="amount">Approved Amount</Label>
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

                              <div>
                                <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                                <Textarea
                                  id="rejectionReason"
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="Enter reason for rejection (optional)"
                                />
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
                  <TableHead>Application #</TableHead>
                  <TableHead>UHID</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLoans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell className="font-medium">{loan.applicationNumber}</TableCell>
                    <TableCell>{loan.uhid}</TableCell>
                    <TableCell>{loan.medicalInfo?.treatmentRequired || 'N/A'}</TableCell>
                    <TableCell>₹{loan.loanDetails?.requestedAmount?.toLocaleString() || 0}</TableCell>
                    <TableCell>{new Date(loan.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        loan.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {loan.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{loan.approvalDate ? new Date(loan.approvalDate).toLocaleDateString() : 'N/A'}</TableCell>
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
          <Button variant="outline" className="ml-auto" onClick={loadLoans}>
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoanApproval;
