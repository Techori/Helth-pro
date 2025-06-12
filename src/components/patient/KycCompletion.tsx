import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Check, User, Loader2, Shield } from 'lucide-react';
import { submitKYC, verifyKYCWithDigio, getKYCStatus } from '@/services/kycService';
import io from 'socket.io-client';

interface KycCompletionProps {
  onComplete: (uhid: string) => void;
}

const KycCompletion = ({ onComplete }: KycCompletionProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'form' | 'verification' | 'pending' | 'completed'>('form');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    panNumber: '',
    aadhaarNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    maritalStatus: '',
    dependents: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    accessToken: '',
    expiresInDays: '',
    verificationId: '', // Add verificationId to formData
    verificationDetails: null
  });

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = io('http://localhost:4000/api/kyc/');
    socket.on('kycStatusUpdate', (data: any) => {
      if (data.kycStatus === 'completed') {
        setStep('completed');
        setFormData(prev => ({
          ...prev,
          verificationDetails: data.kycData.verificationDetails,
          verificationId: data.kycData.verificationId
        }));
        onComplete(data.uhid);
        toast({
          title: 'KYC Completed Successfully',
          description: `Your UHID is: ${data.uhid}. KYC verification approved.`
        });
      } else if (data.kycStatus === 'rejected') {
        setStep('form');
        toast({
          title: 'KYC Verification Failed',
          description: data.kycData.rejectionReason || 'Verification failed. Please try again.',
          variant: 'destructive'
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [onComplete, toast]);

  // Fetch existing KYC status on mount
  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const response = await getKYCStatus();
        if (response.kycData?.verificationId) {
          setFormData(prev => ({
            ...prev,
            verificationId: response.kycData.verificationId,
            panNumber: response.kycData.panNumber || '',
            aadhaarNumber: response.kycData.aadhaarNumber || '',
            dateOfBirth: response.kycData.dateOfBirth || '',
            gender: response.kycData.gender || '',
            address: response.kycData.address || '',
            city: response.kycData.city || '',
            state: response.kycData.state || '',
            zipCode: response.kycData.zipCode || '',
            maritalStatus: response.kycData.maritalStatus || '',
            dependents: response.kycData.dependents || '',
            email: response.kycData.email || '',
            phone: response.kycData.phone || '',
            firstName: response.kycData.firstName || '',
            lastName: response.kycData.lastName || ''
          }));
          setVerificationId(response.kycData.verificationId);
          if (response.kycStatus === 'completed') {
            setStep('completed');
            onComplete(response.uhid);
          } else if (response.kycStatus === 'pending') {
            setStep('pending');
          }
        }
      } catch (error) {
        console.error('Error fetching KYC status:', error);
      }
    };
    fetchKycStatus();
  }, [onComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'panNumber' ? value.toUpperCase() : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsVerifying(true);
    setStep('verification');

    try {
      const digioResponse = await verifyKYCWithDigio(formData);
      setVerificationId(digioResponse.verificationId);
      setFormData(prev => ({
        ...prev,
        verificationId: digioResponse.verificationId,
        accessToken: digioResponse.accessToken,
        expiresInDays: digioResponse.expiresInDays
      }));

      const response = await submitKYC(formData);
      setStep('pending');
      toast({
        title: 'KYC Verification Initiated',
        description: `Verification ID: ${digioResponse.verificationId}. Awaiting confirmation...`
      });
    } catch (error: any) {
      console.error('KYC process failed:', error);
      setStep('form');
      setIsVerifying(false);
      toast({
        title: 'KYC Verification Failed',
        description: error.message || 'Please verify your details.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single status check as fallback
  const checkStatusOnce = async () => {
    try {
      const response = await getKYCStatus();
      if (response.kycStatus === 'completed') {
        setStep('completed');
        setFormData(prev => ({
          ...prev,
          verificationDetails: response.kycData.verificationDetails
        }));
        onComplete(response.uhid);
        toast({
          title: 'KYC Completed Successfully',
          description: `Your KYC verification is approved!`
        });
      } else if (response.kycStatus === 'rejected') {
        setStep('form');
        toast({
          title: 'KYC Verification Failed',
          description: response.rejectionReason || 'Verification failed. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  };

  useEffect(() => {
    if (step === 'pending' && verificationId) {
      // Perform a single status check after 30 seconds as a fallback
      const timeout = setTimeout(checkStatusOnce, 30000);
      return () => clearTimeout(timeout);
    }
  }, [step, verificationId]);

  if (step === 'verification') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            KYC Verification in Progress
          </CardTitle>
          <CardDescription>
            Verifying your identity through secure channels
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Processing KYC Verification</p>
              <p className="text-sm text-gray-600">
                {isVerifying ? 'Verifying documents with Digio API...' : 'Initiating verification...'}
              </p>
            </div>
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'pending') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            KYC Verification Pending
          </CardTitle>
          <CardDescription>
            Awaiting verification results from Digio
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-lg font-medium">Verification in Progress</p>
            <p className="text-sm text-gray-600">
              Verification ID: {verificationId}
            </p>
            {formData.accessToken && (
              <p className="text-sm text-gray-600">
                Access Token: {formData.accessToken}
              </p>
            )}
            {formData.expiresInDays && (
              <p className="text-sm text-gray-600">
                Expires in: {formData.expiresInDays} days
              </p>
            )}
            <p className="text-sm text-gray-600">
              We will notify you once verification is complete.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'completed') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-green-600">
            <Check className="h-6 w-6" />
            KYC Verification Completed
          </CardTitle>
          <CardDescription>
            Your identity has been successfully verified
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium">KYC Successfully Completed!</p>
            <p className="text-sm text-gray-600">
              You can now apply for health cards and loans
            </p>
            {formData.verificationDetails && (
              <div className="text-sm text-gray-600">
                <p><strong>Verification Details:</strong></p>
                {formData.verificationDetails.aadhaar && (
                  <div>
                    <p>Aadhaar: {formData.verificationDetails.aadhaar.idNumber} (Gender: {formData.verificationDetails.aadhaar.gender})</p>
                    <p>Proof Type: {formData.verificationDetails.aadhaar.idProofType}</p>
                  </div>
                )}
                {formData.verificationDetails.pan && (
                  <p>PAN: {formData.verificationDetails.pan.idNumber}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Complete KYC Verification
        </CardTitle>
        <CardDescription>
          Complete your KYC to get your unique UHID and access health services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="panNumber">PAN Number *</Label>
              <Input
                id="panNumber"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                placeholder="ABCDE1234F"
                required
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            
            <div>
              <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
              <Input
                id="aadhaarNumber"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012"
                required
                maxLength={12}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@domain.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="1234567890"
                required
                maxLength={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Complete address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) => handleSelectChange('maritalStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dependents">Number of Dependents</Label>
              <Input
                id="dependents"
                name="dependents"
                type="number"
                value={formData.dependents}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying with Digio...
              </>
            ) : (
              <>
                Complete KYC Verification
                <Shield className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KycCompletion;