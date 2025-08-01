import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus, FileText, AlertCircle, Check, PlayCircle, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { fetchPatientLoans, LoanData } from '@/services/loanService';
import { fetchUserHealthCards } from '@/services/healthCardService';
import KycCompletion from './KycCompletion';
import LoanApplicationDialog from './LoanApplicationDialog';
import EmiPayment from './EmiPayment';
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
  const [showEmiPayment, setShowEmiPayment] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanData | null>(null);
  const [resumingLoan, setResumingLoan] = useState<LoanData | null>(null);
  const [hasActiveHealthCard, setHasActiveHealthCard] = useState(false);

  useEffect(() => {
    if (authState.user) {
      const userData = authState.user as any;
      setKycStatus(userData.kycStatus || '');
      setUhid(userData.uhid || '');
      setKycData(userData.kycData || null);
      
      if (userData.kycStatus === 'completed' && userData.uhid) {
        checkHealthCards();
        fetchLoans(userData.uhid);
      } else {
        setLoading(false);
      }
    }
  }, [authState.user]);

  const checkHealthCards = async () => {
    try {
      const cards = await fetchUserHealthCards(authState.token || '');
      setHasActiveHealthCard(cards.some(card => card.status === 'active'));
    } catch (error) {
      console.error('Failed to fetch health cards:', error);
      setHasActiveHealthCard(false);
    }
  };

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

  const handlePayEmi = (loan: LoanData) => {
    setSelectedLoan(loan);
    setShowEmiPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (uhid) {
      fetchLoans(uhid);
    }
    setShowEmiPayment(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
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
  // Separate loans into different categories
  const draftLoans = loans.filter(isDraftLoan);
  const submittedLoans = loans.filter(loan => !isDraftLoan(loan) && loan.status !== 'approved' && loan.status !== 'completed');
  const activeLoans = loans.filter(loan => loan.status === 'approved');
  const completedLoans = loans.filter(loan => loan.status === 'completed');

  return (
    <div className="space-y-6">
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
          {hasActiveHealthCard ? (
            <Button onClick={() => setShowLoanApplication(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Apply for New Loan
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-yellow-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                You need an active health card to apply for a loan
              </p>
              <Button variant="outline" onClick={() => window.location.href = 'patient-dashboard?tab=health-card'}>
                <CreditCard className="h-4 w-4 mr-2" />
                Apply for Health Card
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Health Card Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasActiveHealthCard ? (
            <p className="text-green-800">
              Your health card is active. You are eligible for cashless treatment.
            </p>
          ) : (
            <p className="text-red-800">
              No active health card found. Please contact support.
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Loans</TabsTrigger>
          <TabsTrigger value="active">Active EMIs</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                All Loan Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application No.</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map((loan) => (
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
                          {loan.submissionDate ? new Date(loan.submissionDate).toLocaleDateString() : new Date(loan.applicationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {isDraftLoan(loan) && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleResumeLoan(loan)}
                              >
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Continue
                              </Button>
                            )}
                            {loan.status === 'approved' && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handlePayEmi(loan)}
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay EMI
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(loan)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No loan applications found</p>
                  {hasActiveHealthCard && (
                    <Button onClick={() => setShowLoanApplication(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Apply for Your First Loan
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Active Loans - EMI Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeLoans.length > 0 ? (
                <div className="space-y-4">
                  {activeLoans.map((loan) => (
                    <Card key={loan._id} className="border">
                      <CardHeader>
                        <CardTitle className="text-lg">{loan.applicationNumber}</CardTitle>
                        <CardDescription>
                          {loan.medicalInfo?.treatmentRequired} - ₹{loan.loanDetails?.approvedAmount?.toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">₹{loan.monthlyPayment?.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Monthly EMI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">₹{loan.remainingBalance?.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Remaining</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {loan.nextEmiDate ? new Date(loan.nextEmiDate).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">Next EMI</div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handlePayEmi(loan)}
                          className="w-full"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay EMI / View Schedule
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active loans with EMI payments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                Completed Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedLoans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application No.</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Loan Amount</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedLoans.map((loan) => (
                      <TableRow key={loan._id}>
                        <TableCell className="font-mono text-sm">
                          {loan.applicationNumber}
                        </TableCell>
                        <TableCell>{loan.medicalInfo?.treatmentRequired || 'N/A'}</TableCell>
                        <TableCell>₹{loan.loanDetails?.approvedAmount?.toLocaleString()}</TableCell>
                        <TableCell>
                          {loan.completionDate ? new Date(loan.completionDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(loan)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePayEmi(loan)}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Payment History
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed loans</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LoanApplicationDialog
        open={showLoanApplication}
        onOpenChange={setShowLoanApplication}
        onSuccess={handleLoanApplicationSuccess}
        uhid={uhid}
        kycData={kycData}
        existingLoan={resumingLoan}
      />

      {selectedLoan && (
        <Dialog open={showEmiPayment} onOpenChange={setShowEmiPayment}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>EMI Payment - {selectedLoan.applicationNumber}</DialogTitle>
            </DialogHeader>
            <EmiPayment 
              loan={selectedLoan} 
              onPaymentSuccess={handlePaymentSuccess}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedLoan && (
        <Dialog open={showLoanDetails} onOpenChange={setShowLoanDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Loan Application Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
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