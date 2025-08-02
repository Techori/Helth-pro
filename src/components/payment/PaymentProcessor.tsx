
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  User,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import FaceAuthVerification from "./FaceAuthVerification";

interface PaymentProcessorProps {
  patientId: string;
  amount: number;
  onPaymentComplete: (success: boolean, transactionId?: string) => void;
}

const PaymentProcessor = ({ patientId, amount, onPaymentComplete }: PaymentProcessorProps) => {
  const [step, setStep] = useState<'amount' | 'verification' | 'processing' | 'complete'>('amount');
  const [paymentAmount, setPaymentAmount] = useState(amount || 0);
  const [processing, setProcessing] = useState(false);
  const [patientData, setPatientData] = useState({
    name: "John Doe",
    healthCardNumber: "****-****-****-1234",
    balance: 45000,
    email: "john@example.com"
  });
  const [paymentMethod, setPaymentMethod] = useState<'health-card' | 'wallet'>('health-card');

  useEffect(() => {
    // Fetch patient data based on patientId
    // This would typically be an API call
    console.log(`Loading patient data for ID: ${patientId}`);
  }, [patientId]);

  const handleAmountConfirm = () => {
    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }

    if (paymentAmount > patientData.balance) {
      toast({
        title: "Insufficient Balance",
        description: "Payment amount exceeds available balance.",
        variant: "destructive",
      });
      return;
    }

    setStep('verification');
  };

  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      setStep('processing');
      processPayment();
    } else {
      toast({
        title: "Verification Failed",
        description: "Face authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful payment
      const transactionId = `TXN${Date.now()}`;
      
      toast({
        title: "Payment Successful",
        description: `Payment of ₹${paymentAmount} processed successfully.`,
      });

      setStep('complete');
      onPaymentComplete(true, transactionId);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive",
      });
      onPaymentComplete(false);
    } finally {
      setProcessing(false);
    }
  };

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
        <p className="text-muted-foreground">Enter the payment amount</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium">{patientData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Card Number:</span>
              <span className="text-sm font-mono">{patientData.healthCardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Available Balance:</span>
              <span className="text-sm font-semibold text-green-600">₹{patientData.balance.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="flex gap-2">
            <Button
              variant={paymentMethod === 'health-card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('health-card')}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Health Card
            </Button>
            <Button
              variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('wallet')}
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Wallet
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount (₹)</label>
          <Input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            placeholder="Enter payment amount"
            min="1"
            max={patientData.balance}
          />
        </div>
      </div>

      <Button onClick={handleAmountConfirm} className="w-full" size="lg">
        Proceed to Verification
      </Button>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Face Authentication</h2>
        <p className="text-muted-foreground">Please complete face verification to proceed</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Shield className="h-12 w-12 mx-auto text-primary" />
            <p className="font-semibold">Payment Amount: ₹{paymentAmount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Payment Method: {paymentMethod === 'health-card' ? 'Health Card' : 'Wallet'}</p>
          </div>
        </CardContent>
      </Card>

      <FaceAuthVerification
        emailId={patientData.email}
        onVerificationComplete={handleVerificationComplete}
      />

      <Button 
        variant="outline" 
        onClick={() => setStep('amount')} 
        className="w-full"
      >
        Back to Amount
      </Button>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
        <p className="text-muted-foreground">Please wait while we process your payment</p>
      </div>

      <div className="py-12">
        <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold">Processing ₹{paymentAmount.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-2">This may take a few seconds...</p>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div>
        <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
        <p className="text-muted-foreground">Your payment has been processed successfully</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount Paid:</span>
              <span className="text-lg font-bold text-green-600">₹{paymentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment Method:</span>
              <span className="text-sm font-medium">{paymentMethod === 'health-card' ? 'Health Card' : 'Wallet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID:</span>
              <span className="text-sm font-mono">TXN{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full">
        Print Receipt
      </Button>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Processor</CardTitle>
          <Badge variant="outline">
            Step {['amount', 'verification', 'processing', 'complete'].indexOf(step) + 1} of 4
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {step === 'amount' && renderAmountStep()}
        {step === 'verification' && renderVerificationStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'complete' && renderCompleteStep()}
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
