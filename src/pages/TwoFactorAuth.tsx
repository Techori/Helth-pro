
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { startVerification, checkVerification } from '@/services/twilioService';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Phone, RotateCcw } from 'lucide-react';
import { AuthState, AuthUser, UserRole } from '@/types/app.types';
import axios from 'axios';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  initialized: false
};


const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(initialState);
  
  
  
  // Get user data from location state
  const { userData, userRole } = location.state || {};
  const userPhone = userData?.phone || authState.user?.phone;
  
  
  useEffect(() => {
    if (!userData && !authState.user) {
      navigate('/login');  
      return;
    }
    else if(localStorage.getItem('token')){
      navigate('/patient-dashboard');
    }
    // Start verification automatically
    handleStartVerification();
  }, []);
  
  // Countdown timer for resend
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);
  
  const handleStartVerification = async () => {
    if (!userPhone) {
      setError('Phone number not found');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await startVerification(userPhone);
      
      if (response.success) {
        toast({
          title: "Verification Code Sent",
          description: `Code sent to ${userPhone}`,
        });
        setTimeLeft(30);
        setCanResend(false);
      } else {
        setError(response.error || 'Failed to send verification code');
      }
    } catch (error) {
      setError('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch client IP address
    let ipAddress = 'Unknown';
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      ipAddress = response.data.ip || 'Unknown';
    } catch (ipError) {
      console.error('Failed to fetch IP address:', ipError);
    }
      const token = localStorage.getItem('token') || userData?.token;
      const response = await checkVerification(userPhone, verificationCode,userData.email,ipAddress,userData.token);
      
      if (response.success) {
        toast({
          title: "2FA Verified",
          description: "Two-factor authentication successful",
        });
        
        console.log(userData, userRole);
        // Store token and redirect to appropriate dashboard
        if (userData?.token) {
          localStorage.setItem('token', userData.token);
        }
        // Set user in auth state
       if (userData) {
              setAuthState({
                user: userData,
                token: localStorage.getItem('token'), // Ensure token is set
                loading: false,
                initialized: true
              });
            } else {
              console.log('No user data received, clearing token');
              localStorage.removeItem('token');
              setAuthState({
                user: null,
                token: null,
                loading: false,
                initialized: true
              });
            }
        
        const redirectPath = userRole ? `/${userRole}-dashboard` : '/patient-dashboard';
        console.log('Redirecting to:', redirectPath);
        //refresh the page to ensure auth state is updated
        window.location.reload();
        navigate(redirectPath);
      } else {
        setError(response.message || 'Invalid verification code');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    setResendLoading(true);
    await handleStartVerification();
    setResendLoading(false);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the verification code sent to your phone number
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">
                {userPhone ? `****${userPhone.slice(-4)}` : 'Phone number'}
              </span>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !verificationCode.trim()}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {resendLoading ? (
                    <>
                      <RotateCcw className="inline h-4 w-4 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Code'
                  )}
                </button>
              ) : (
                <span className="text-gray-500">
                  Resend in {timeLeft}s
                </span>
              )}
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
