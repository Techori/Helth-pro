import { useState } from "react";
import { Check, CreditCard, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  processHealthCardPayment,
  processLoanRequest,
} from "@/services/transactionService";
import { getPaymentUser } from "@/services/hospitalService";
import FaceAuthVerification from "@/components/payment/FaceAuthVerification";

interface PatientInfo {
  id: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  cardNumber: string;
  cardBalance: number;
  cardStatus: "active" | "inactive" | "expired";
  loanLimit: number;
  loanBalance: number;
}

const PaymentProcessor = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [paymentTab, setPaymentTab] = useState("healthcard");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [paymentType, setPaymentType] = useState("consultation");
  const [loanPurpose, setLoanPurpose] = useState("treatment");
  const [loanTenure, setLoanTenure] = useState("3");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setSearching(true);
    setPatientInfo(null);
    setPaymentSuccess(false);
    setShowFaceAuth(false);

    try {
      const raw = await getPaymentUser(searchTerm);
      // Type guard: ensure raw is an object
      if (!raw || typeof raw !== "object") {
        throw new Error("Invalid response from server");
      }      // Add console log to see the raw response
      console.log('Raw API Response:', raw);
      
      // Map API response to PatientInfo
      const mappedPatient: PatientInfo = {
        id: (raw.patientId ?? raw.id ?? "Unknown ID").toString(),
        name: raw.name ?? "Unknown Name",
        gender: raw.gender ?? "Unknown",
        age: typeof raw.age === "number" ? raw.age : 0,
        phone: raw.phone ?? "",
        email: raw.email ?? "",
        cardNumber: raw.cardNumber ?? "",
        cardBalance: typeof raw.cardBalance === "number" ? raw.cardBalance : 0,
        cardStatus: typeof raw.cardStatus === "string" 
          ? raw.cardStatus.toLowerCase() as "active" | "inactive" | "expired"
          : "inactive",
        loanLimit: typeof raw.loanLimit === "number" ? raw.loanLimit : 0,
        loanBalance: typeof raw.loanBalance === "number" ? raw.loanBalance : 0,
      };
      setPatientInfo(mappedPatient);
    } catch (error: any) {
      const msg = error.message || "Failed to fetch patient";
      if (msg.toLowerCase().includes("patient not found")) {
        toast({
          variant: "destructive",
          title: "Patient not found",
          description: msg,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching patient",
          description: msg,
        });
      }
    } finally {
      setSearching(false);
    }
  };

  const initiatePayment = () => {
    if (!patientInfo || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid payment",
        description: "Please enter a valid payment amount.",
      });
      return;
    }

    const amount = parseFloat(paymentAmount);

    // Check if payment amount exceeds card balance for health card payments
    if (paymentTab === "healthcard" && amount > patientInfo.cardBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description:
          "The patient's health card balance is insufficient for this transaction.",
      });
      return;
    }

    // Store payment data for later processing
    setPaymentData({
      amount,
      patientId: patientInfo.id,
      paymentType,
      paymentDescription,
      loanPurpose,
      loanTenure,
    });

    // Show face authentication step
    setShowFaceAuth(true);
  };

  const handleFaceVerification = async (success: boolean) => {
    if (success) {
      // Face verification succeeded, proceed with payment processing
      processPayment();
    } else {
      // Face verification failed
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Face verification failed. Payment cannot be processed.",
      });
      setShowFaceAuth(false);
    }
  };

  const processPayment = async () => {
    if (!paymentData || !patientInfo) return;

    setProcessingPayment(true);

    try {
      // We should have the actual hospital name from auth state
      const hospitalName = authState.user?.firstName
        ? `${authState.user.firstName} ${authState.user.lastName} Hospital`
        : "City General Hospital";

      if (paymentTab === "healthcard") {
        // Process health card payment
        await processHealthCardPayment(
          paymentData.patientId,
          paymentData.amount,
          `Payment for ${paymentData.paymentType}: ${paymentData.paymentDescription}`,
          hospitalName
        );
      } else {
        // Process loan request
        await processLoanRequest(
          paymentData.patientId,
          paymentData.amount,
          paymentData.loanPurpose,
          parseInt(paymentData.loanTenure),
          hospitalName
        );
      }

      // Update patient card balance in the UI
      setPatientInfo({
        ...patientInfo,
        cardBalance:
          paymentTab === "healthcard"
            ? patientInfo.cardBalance - paymentData.amount
            : patientInfo.cardBalance,
      });

      setPaymentSuccess(true);
      setShowFaceAuth(false);
      toast({
        title:
          paymentTab === "healthcard"
            ? "Payment successful"
            : "Loan request submitted",
        description: `₹${paymentData.amount.toLocaleString()} has been processed successfully.`,
      });
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description:
          error.message || "An error occurred while processing the payment.",
      });
      setShowFaceAuth(false);
    } finally {
      setProcessingPayment(false);
      setPaymentAmount("");
      setPaymentDescription("");
    }
  };

  const handleNewTransaction = () => {
    setPaymentSuccess(false);
    setSearchTerm("");
    setPatientInfo(null);
    setShowFaceAuth(false);
    setPaymentData(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Process Payment</CardTitle>
          <CardDescription>
            Collect payments using Health Card or initiate a new loan request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showFaceAuth && patientInfo ? (
            <div>
              <Button
                variant="outline"
                onClick={() => setShowFaceAuth(false)}
                className="mb-4"
              >
                ← Back to Payment Form
              </Button>

              <FaceAuthVerification
                emailId={patientInfo.email}
                onVerificationComplete={handleFaceVerification}
              />
            </div>
          ) : (
            !paymentSuccess && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="patient-search">Search Patient</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="patient-search"
                        placeholder="Enter Email ID or Card Number"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                  </div>
                  <div className="sm:mt-6">
                    <Button
                      onClick={handleSearch}
                      disabled={!searchTerm || searching}
                    >
                      {searching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>

                {/* Patient Information Card */}
                {patientInfo && (
                  <Card className="border-dashed">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">
                          Patient Information
                        </CardTitle>                        <div
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            patientInfo.cardStatus === "active"
                              ? "bg-green-100 text-green-800"
                              : patientInfo.cardStatus === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {patientInfo.cardStatus.charAt(0).toUpperCase() + patientInfo.cardStatus.slice(1)} Card
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Patient ID
                            </p>
                            <p className="font-medium">{patientInfo.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Patient Name
                            </p>
                            <p>{patientInfo.name}</p>
                          </div>
                          <div className="flex gap-8">
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Gender
                              </p>
                              <p>{patientInfo.gender}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Age
                              </p>
                              <p>{patientInfo.age} years</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Contact
                            </p>
                            <p>
                              {patientInfo.phone} | {patientInfo.email}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Card Number
                            </p>
                            <p className="font-mono">
                              {patientInfo.cardNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Health Card Balance
                            </p>
                            <p className="font-bold text-lg text-green-600">
                              ₹{patientInfo.cardBalance.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Loan Status
                            </p>
                            <div className="flex gap-1 items-center">
                              <p>
                                Available: ₹
                                {(
                                  patientInfo.loanLimit -
                                  patientInfo.loanBalance
                                ).toLocaleString()}
                              </p>
                              <span className="text-gray-400">|</span>
                              <p>
                                Used: ₹
                                {patientInfo.loanBalance.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Form */}
                {patientInfo && (
                  <div className="pt-2">
                    <Tabs value={paymentTab} onValueChange={setPaymentTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="healthcard">
                          Health Card Payment
                        </TabsTrigger>
                        <TabsTrigger value="newloan">
                          New Loan Request
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="healthcard"
                        className="space-y-4 pt-4"
                      >
                        <div className="space-y-1">
                          <Label htmlFor="amount">Payment Amount (₹)</Label>
                          <Input
                            id="amount"
                            placeholder="Enter amount"
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="payment-type">Payment For</Label>
                          <Select
                            defaultValue="consultation"
                            value={paymentType}
                            onValueChange={setPaymentType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">
                                Consultation
                              </SelectItem>
                              <SelectItem value="procedure">
                                Medical Procedure
                              </SelectItem>
                              <SelectItem value="lab">Lab Tests</SelectItem>
                              <SelectItem value="pharmacy">Pharmacy</SelectItem>
                              <SelectItem value="other">
                                Other Services
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="description">
                            Description (Optional)
                          </Label>
                          <Input
                            id="description"
                            placeholder="Enter payment details"
                            value={paymentDescription}
                            onChange={(e) =>
                              setPaymentDescription(e.target.value)
                            }
                          />
                        </div>

                        {patientInfo &&
                          parseFloat(paymentAmount) >
                            patientInfo.cardBalance && (
                            <Alert variant="destructive">
                              <AlertTitle>Insufficient Balance</AlertTitle>
                              <AlertDescription>
                                The entered amount exceeds the patient's card
                                balance.
                              </AlertDescription>
                            </Alert>
                          )}

                        <Button
                          className="w-full mt-4"
                          onClick={initiatePayment}
                          disabled={
                            !paymentAmount ||
                            parseFloat(paymentAmount) <= 0 ||
                            parseFloat(paymentAmount) >
                              patientInfo.cardBalance ||
                            processingPayment
                          }
                        >
                          Pay ₹{paymentAmount}
                        </Button>
                      </TabsContent>
                      <TabsContent value="newloan" className="space-y-4 pt-4">
                        <div className="space-y-1">
                          <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                          <Input
                            id="loan-amount"
                            placeholder="Enter amount"
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="loan-purpose">Loan Purpose</Label>
                          <Select
                            defaultValue="treatment"
                            value={loanPurpose}
                            onValueChange={setLoanPurpose}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select loan purpose" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="treatment">
                                Medical Treatment
                              </SelectItem>
                              <SelectItem value="surgery">Surgery</SelectItem>
                              <SelectItem value="maternity">
                                Maternity Care
                              </SelectItem>
                              <SelectItem value="emergency">
                                Emergency Care
                              </SelectItem>
                              <SelectItem value="other">
                                Other Medical Expenses
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="tenure">Loan Tenure</Label>
                          <Select
                            defaultValue="3"
                            value={loanTenure}
                            onValueChange={setLoanTenure}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tenure" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Months</SelectItem>
                              <SelectItem value="6">6 Months</SelectItem>
                              <SelectItem value="9">9 Months</SelectItem>
                              <SelectItem value="12">12 Months</SelectItem>
                              <SelectItem value="18">18 Months</SelectItem>
                              <SelectItem value="24">24 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="loan-description">
                            Treatment Details
                          </Label>
                          <Input
                            id="loan-description"
                            placeholder="Enter treatment details"
                            value={paymentDescription}
                            onChange={(e) =>
                              setPaymentDescription(e.target.value)
                            }
                          />
                        </div>

                        {parseFloat(paymentAmount) > 0 &&
                          parseFloat(paymentAmount) >
                            patientInfo.loanLimit - patientInfo.loanBalance && (
                            <Alert variant="destructive" className="mt-4">
                              <X className="h-4 w-4" />
                              <AlertTitle>Loan limit exceeded</AlertTitle>
                              <AlertDescription>
                                The requested amount (₹
                                {parseFloat(paymentAmount).toLocaleString()})
                                exceeds the patient's available loan limit (₹
                                {(
                                  patientInfo.loanLimit -
                                  patientInfo.loanBalance
                                ).toLocaleString()}
                                ).
                              </AlertDescription>
                            </Alert>
                          )}

                        <Button
                          className="w-full mt-4"
                          onClick={initiatePayment}
                          disabled={
                            !paymentAmount ||
                            parseFloat(paymentAmount) <= 0 ||
                            processingPayment
                          }
                        >
                          Request Loan ₹{paymentAmount}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            )
          )}

          {/* Payment Success */}
          {paymentSuccess && (
            <div className="py-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Payment Successful
                </h3>
                <p className="text-gray-500">
                  {paymentTab === "healthcard"
                    ? `₹${paymentData?.amount?.toLocaleString()} has been charged to the patient's health card.`
                    : `₹${paymentData?.amount?.toLocaleString()} loan request has been submitted successfully.`}
                </p>
              </div>
              <Button onClick={handleNewTransaction}>
                Process New Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessor;
