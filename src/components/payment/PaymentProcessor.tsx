import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import FaceAuthVerification from "./FaceAuthVerification";
import { toast } from "@/hooks/use-toast";

interface PaymentProcessorProps {
  patientId: string;
  amount: number;
  serviceName: string;
  onPaymentComplete: (success: boolean) => void;
}

const PaymentProcessor = ({
  patientId,
  amount,
  serviceName,
  onPaymentComplete,
}: PaymentProcessorProps) => {
  const [paymentStep, setPaymentStep] = useState<
    "face-auth" | "processing" | "complete" | "failed"
  >("face-auth");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFaceVerification = (success: boolean) => {
    if (success) {
      // If face verification is successful, proceed to payment processing
      processPayment();
    } else {
      // If face verification failed, show error
      setPaymentStep("failed");
      toast({
        title: "Authentication Failed",
        description:
          "We couldn't verify your identity. Payment processing has been cancelled.",
        variant: "destructive",
      });
    }
  };

  const processPayment = async () => {
    setPaymentStep("processing");
    setIsProcessing(true);

    try {
      // Simulate API call for payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, we'll always succeed
      setPaymentStep("complete");
      onPaymentComplete(true);
      toast({
        title: "Payment Successful",
        description: `Your payment of ₹${amount.toLocaleString()} for ${serviceName} has been processed.`,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStep("failed");
      onPaymentComplete(false);
      toast({
        title: "Payment Failed",
        description:
          "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const retryPayment = () => {
    setPaymentStep("face-auth");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Secure Payment</CardTitle>
            <CardDescription>{serviceName}</CardDescription>
          </div>
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Payment summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{serviceName}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium text-lg">
                ₹{amount.toLocaleString()}
              </span>
            </div>
          </div>          {/* Face auth step */}
          {paymentStep === "face-auth" && (
            <FaceAuthVerification
              emailId={patientId}
              onVerificationComplete={handleFaceVerification}
            />
          )}

          {/* Processing step */}
          {paymentStep === "processing" && (
            <div className="p-6 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
              <p className="text-muted-foreground">
                Please wait while we process your payment...
              </p>
            </div>
          )}

          {/* Complete step */}
          {paymentStep === "complete" && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Payment Successful!
              </h3>
              <p className="text-muted-foreground">
                Your payment of ₹{amount.toLocaleString()} has been processed
                successfully.
              </p>
            </div>
          )}

          {/* Failed step */}
          {paymentStep === "failed" && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
              <p className="text-muted-foreground">
                There was an issue processing your payment. Please try again.
              </p>
              <Button onClick={retryPayment} className="mt-4">
                Retry Payment
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {paymentStep === "complete" && (
        <CardFooter>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="w-full"
          >
            Print Receipt
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PaymentProcessor;
