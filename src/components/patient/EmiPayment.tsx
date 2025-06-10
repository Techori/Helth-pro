
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { LoanData, payEmi, getEmiSchedule, EmiScheduleItem } from '@/services/loanService';

interface EmiPaymentProps {
  loan: LoanData;
  onPaymentSuccess: () => void;
}

const EmiPayment = ({ loan, onPaymentSuccess }: EmiPaymentProps) => {
  const { toast } = useToast();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [emiSchedule, setEmiSchedule] = useState<EmiScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(loan.monthlyPayment || 0);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (loan.status === 'approved' || loan.status === 'completed') {
      fetchEmiSchedule();
    }
  }, [loan._id]);

  const fetchEmiSchedule = async () => {
    try {
      setLoading(true);
      const response = await getEmiSchedule(loan._id);
      setEmiSchedule(response.schedule || []);
    } catch (error) {
      console.error('Failed to fetch EMI schedule:', error);
      toast({
        title: "Error",
        description: "Failed to fetch EMI schedule",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      
      const response = await payEmi(loan._id, paymentAmount, paymentMethod);
      
      toast({
        title: "Payment Successful",
        description: `EMI payment of ₹${paymentAmount.toLocaleString()} processed successfully. Transaction ID: ${response.transactionId}`,
      });

      setShowPaymentDialog(false);
      onPaymentSuccess();
      fetchEmiSchedule();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loan.status !== 'approved' && loan.status !== 'completed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            EMI Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">EMI payments are available only for approved loans.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            EMI Payment Summary
          </CardTitle>
          <CardDescription>
            Application Number: {loan.applicationNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ₹{loan.monthlyPayment?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600">Monthly EMI</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                ₹{loan.remainingBalance?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-gray-600">Remaining Balance</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {loan.nextEmiDate ? new Date(loan.nextEmiDate).toLocaleDateString() : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">Next EMI Date</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {loan.loanDetails?.interestRate || 0}%
              </div>
              <p className="text-sm text-gray-600">Interest Rate</p>
            </div>
          </div>

          {loan.status === 'approved' && loan.remainingBalance && loan.remainingBalance > 0 && (
            <div className="mt-6">
              <Button onClick={() => setShowPaymentDialog(true)} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay EMI
              </Button>
            </div>
          )}

          {loan.status === 'completed' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Loan Completed</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                All EMI payments have been completed successfully.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* EMI Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            EMI Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading EMI schedule...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EMI #</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>EMI Amount</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emiSchedule.map((emi) => (
                    <TableRow key={emi.emiNumber}>
                      <TableCell>{emi.emiNumber}</TableCell>
                      <TableCell>{new Date(emi.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>₹{emi.emiAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{emi.principalAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{emi.interestAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{emi.balanceAfterPayment.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(emi.status)} flex items-center gap-1`}>
                          {getStatusIcon(emi.status)}
                          {emi.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {emi.paidDate ? new Date(emi.paidDate).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pay EMI</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Payment Amount</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                min={0}
                max={loan.remainingBalance}
              />
              <p className="text-xs text-gray-500 mt-1">
                Suggested: ₹{loan.monthlyPayment?.toLocaleString()} (Monthly EMI)
              </p>
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Payment Simulation</h4>
              <p className="text-sm text-gray-600">
                This is a simulated payment. In production, this will integrate with your payment gateway.
              </p>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={processingPayment || paymentAmount <= 0}
              className="w-full"
            >
              {processingPayment ? 'Processing...' : `Pay ₹${paymentAmount.toLocaleString()}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmiPayment;
