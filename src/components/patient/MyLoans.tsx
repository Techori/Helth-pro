
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Plus, FileText, AlertCircle, Check, PlayCircle, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { fetchPatientLoans, LoanData } from '@/services/loanService';
import KycCompletion from './KycCompletion';
import LoanApplicationDialog from './LoanApplicationDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const MyLoans = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [loans, setLoans] = useState<LoanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<string>('');
  const [uhid, setUhid] = useState<string>('');
  const [kycData, setKycData] = useState<any>(null);
  const [showKycCompletion, setShowKycCompletion] = useState(false);
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanData | null>(null);
  const [resumingLoan, setResumingLoan] = useState<LoanData | null>(null);

  useEffect(() => {
    if (authState.user) {
      // Get KYC status and UHID from user data
      const userData = authState.user as any;
      setKycStatus(userData.kycStatus || '');
      setUhid(userData.uhid || '');
      setKycData(userData.kycData || null);
      
      // Fetch loans if KYC is completed
      if (userData.kycStatus === 'completed' && userData.uhid) {
        fetchLoans(userData.uhid);
      } else {
        setLoading(false);
      }
    }
  }, [authState.user]);

  const fetchLoans = async (userUhid: string) => {
    try {
      setLoading(true);
      const loansData = await fetchPatientLoans(userUhid);
      setLoans(loansData);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch loans. Please try again.",
        variant: "destructive",
      });
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKycComplete = (newUhid: string) => {
    setUhid(newUhid);
    setKycStatus('completed');
    setShowKycCompletion(false);
    toast({
      title: "KYC Completed",
      description: "You can now apply for loans",
    });
  };

  const handleLoanApplicationSuccess = () => {
    if (uhid) {
      fetchLoans(uhid);
    }
    setShowLoanApplication(false);
    setResumingLoan(null);
    toast({
      title: "Application Submitted",
      description: "Your loan application has been submitted successfully",
    });
  };

  const handleViewDetails = (loan: LoanData) => {
    setSelectedLoan(loan);
    setShowLoanDetails(true);
  };

  const handleResumeLoan = (loan: LoanData) => {
    setResumingLoan(loan);
    setShowLoanApplication(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (loan: LoanData) => {
    if (loan.status === 'draft') {
      return `DRAFT (Step ${loan.currentStep || 1})`;
    }
    return loan.status.replace('_', ' ').toUpperCase();
  };

  const isDraftLoan = (loan: LoanData) => {
    return loan.status === 'draft' || (!loan.submissionDate && !loan.transactionId);
  };

  if (loading) {
    return <div className="text-center py-8">Loading loans...</div>;
  }

  if (kycStatus !== 'completed') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              KYC Verification Required
            </CardTitle>
            <CardDescription>
              Complete your KYC verification to apply for loans and get your unique UHID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowKycCompletion(true)}>
              Complete KYC Verification
            </Button>
          </CardContent>
        </Card>

        {showKycCompletion && (
          <KycCompletion onComplete={handleKycComplete} />
        )}
      </div>
    );
  }

  // Separate loans into drafts and submitted
  const draftLoans = loans.filter(isDraftLoan);
  const submittedLoans = loans.filter(loan => !isDraftLoan(loan));

  return (
    <div className="space-y-6">
      {/* KYC Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            KYC Verified
          </CardTitle>
          <CardDescription>
            Your UHID: <span className="font-mono font-semibold">{uhid}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowLoanApplication(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Apply for New Loan
          </Button>
        </CardContent>
      </Card>

      {/* Draft Loans */}
      {draftLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Draft Applications
            </CardTitle>
            <CardDescription>
              Complete your pending loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application No.</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftLoans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell className="font-mono text-sm">
                      {loan.applicationNumber}
                    </TableCell>
                    <TableCell>{loan.medicalInfo?.treatmentRequired || 'N/A'}</TableCell>
                    <TableCell>
                      ₹{loan.loanDetails?.requestedAmount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {getStatusText(loan)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(loan.applicationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleResumeLoan(loan)}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(loan)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Submitted Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            My Loan Applications
          </CardTitle>
          <CardDescription>
            Track your submitted loan applications and manage existing loans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submittedLoans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application No.</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedLoans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell className="font-mono text-sm">
                      {loan.applicationNumber}
                    </TableCell>
                    <TableCell>{loan.medicalInfo?.treatmentRequired || 'N/A'}</TableCell>
                    <TableCell>
                      ₹{loan.loanDetails?.requestedAmount?.toLocaleString() || 0}
                      {loan.loanDetails?.approvedAmount && loan.status === 'approved' && (
                        <div className="text-sm text-green-600">
                          Approved: ₹{loan.loanDetails.approvedAmount.toLocaleString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(loan.status)}>
                        {getStatusText(loan)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {loan.submissionDate ? new Date(loan.submissionDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(loan)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No submitted loan applications found</p>
              <Button onClick={() => setShowLoanApplication(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Apply for Your First Loan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loan Application Dialog */}
      <LoanApplicationDialog
        open={showLoanApplication}
        onOpenChange={setShowLoanApplication}
        onSuccess={handleLoanApplicationSuccess}
        uhid={uhid}
        kycData={kycData}
        existingLoan={resumingLoan}
      />

      {/* Loan Details Dialog */}
      {selectedLoan && (
        <Dialog open={showLoanDetails} onOpenChange={setShowLoanDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Loan Application Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Application Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Application Number</Label>
                    <p className="font-mono">{selectedLoan.applicationNumber}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedLoan.status)}>
                      {getStatusText(selectedLoan)}
                    </Badge>
                  </div>
                  <div>
                    <Label>Created Date</Label>
                    <p>{new Date(selectedLoan.applicationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Requested Amount</Label>
                    <p>₹{selectedLoan.loanDetails?.requestedAmount?.toLocaleString()}</p>
                  </div>
                  {selectedLoan.submissionDate && (
                    <div>
                      <Label>Submitted Date</Label>
                      <p>{new Date(selectedLoan.submissionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedLoan.transactionId && (
                    <div>
                      <Label>Transaction ID</Label>
                      <p className="font-mono">{selectedLoan.transactionId}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Treatment Required</Label>
                    <p>{selectedLoan.medicalInfo?.treatmentRequired || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Medical Provider</Label>
                    <p>{selectedLoan.medicalInfo?.medicalProvider || selectedLoan.loanDetails?.hospitalName || 'N/A'}</p>
                  </div>
                  <div>
                    <Label>Estimated Cost</Label>
                    <p>₹{selectedLoan.medicalInfo?.estimatedCost?.toLocaleString() || 0}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Loan Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Term Length</Label>
                    <p>{selectedLoan.loanDetails?.preferredTerm || 'N/A'} months</p>
                  </div>
                  <div>
                    <Label>Repayment Method</Label>
                    <p className="capitalize">
                      {selectedLoan.loanDetails?.repaymentMethod?.replace('_', ' ') || 'N/A'}
                    </p>
                  </div>
                  {selectedLoan.status === 'approved' && (
                    <>
                      <div>
                        <Label>Approved Amount</Label>
                        <p className="text-green-600">
                          ₹{selectedLoan.loanDetails?.approvedAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label>Interest Rate</Label>
                        <p>{selectedLoan.loanDetails?.interestRate || 'N/A'}% p.a.</p>
                      </div>
                    </>
                  )}
                  {selectedLoan.rejectionReason && (
                    <div className="col-span-2">
                      <Label>Rejection Reason</Label>
                      <p className="text-red-600">{selectedLoan.rejectionReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyLoans;
