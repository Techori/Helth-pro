
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Mail, 
  Lock,
  AlertCircle,
  Hospital
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState, signIn } = useAuth();
  const [loaded, setLoaded] = useState(true);
  const [loginType, setLoginType] = useState<'hospital' | 'patient' | 'admin' | 'sales' | 'crm'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHospitalList, setShowHospitalList] = useState(false);

  // Demo credentials
  const demoCredentials = {
    patient: { email: 'patient@demo.com', password: 'demo123' },
    hospital: { email: 'hospital@demo.com', password: 'demo123' },
    admin: { email: 'admin@demo.com', password: 'demo123' },
    sales: { email: 'sales@demo.com', password: 'demo123' },
    crm: { email: 'crm@demo.com', password: 'demo123' },
  };

  // Hospital specific demo credentials
  const hospitalDemoCredentials = [
    { 
      name: 'City General Hospital',
      email: 'rajesh@cityhospital.com',
      password: 'demo123',
      address: 'Mumbai, Maharashtra'
    },
    { 
      name: 'Wellness Multispecialty Hospital',
      email: 'priya@wellnesshospital.com',
      password: 'demo123',
      address: 'Delhi, Delhi'
    },
    { 
      name: 'LifeCare Medical Center',
      email: 'anand@lifecaremedical.com',
      password: 'demo123',
      address: 'Bangalore, Karnataka'
    }
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.initialized && authState.user) {
      const redirectPath = `/${authState.user.role}-dashboard`;
      console.log('User already authenticated, redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [authState, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Attempting sign in with:', formData.email);
      const { error, data } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Invalid email or password');
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive"
        });
      } else {
        console.log('Login successful:', data);
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        });
        
        if (data?.user?.role) {
          const redirectPath = `/${data.user.role}-dashboard`;
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Login Failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginTypeChange = (type: 'hospital' | 'patient' | 'admin' | 'sales' | 'crm') => {
    setLoginType(type);
    setShowHospitalList(type === 'hospital');
    setFormData({ email: '', password: '' }); // Reset form data when changing login type
  };

  const handleHospitalSelect = (hospital: typeof hospitalDemoCredentials[0]) => {
    setFormData({
      email: hospital.email,
      password: hospital.password
    });
    setShowHospitalList(false);
    toast({
      title: "Hospital Selected",
      description: `Login credentials for ${hospital.name} loaded`,
    });
  };

  const handleDemoLogin = async (type: 'hospital' | 'patient' | 'admin' | 'sales' | 'crm') => {
    setLoginType(type);
    setIsSubmitting(true);
    setError(null);
    
    const credentials = demoCredentials[type];
    setFormData(credentials);
    
    try {
      console.log('Attempting demo login as:', type);
      const { error, data } = await signIn(credentials.email, credentials.password);
      
      if (error) {
        console.error('Demo login error:', error);
        setError('Demo login failed. Please try again.');
        toast({
          title: "Demo Login Failed",
          description: error.message || 'Please try again',
          variant: "destructive"
        });
      } else {
        toast({
          title: "Demo Login Successful",
          description: `Logged in as ${type} demo user`,
        });
        
        if (data?.user?.role) {
          const redirectPath = `/${data.user.role}-dashboard`;
          console.log('Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Unexpected demo login error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Demo Login Failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still initializing auth, show loading indicator
  if (!authState.initialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-md mx-auto">
              <Card className={`border-gray-100 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold font-display text-gray-900">
                    Sign in to RI Medicare
                  </CardTitle>
                  <CardDescription>
                    Access your dashboard to manage healthcare services
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <div className="flex flex-wrap border rounded-md overflow-hidden">
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'patient' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => handleLoginTypeChange('patient')}
                      >
                        Patient
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'hospital' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => handleLoginTypeChange('hospital')}
                      >
                        Hospital
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'admin' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => handleLoginTypeChange('admin')}
                      >
                        Admin
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'sales' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => handleLoginTypeChange('sales')}
                      >
                        Sales
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'crm' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => handleLoginTypeChange('crm')}
                      >
                        CRM
                      </button>
                    </div>
                  </div>
                  
                  {loginType === 'hospital' && (
                    <div className="mb-6">
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full flex items-center justify-center"
                        onClick={() => setShowHospitalList(!showHospitalList)}
                      >
                        <Hospital className="mr-2 h-4 w-4" />
                        {showHospitalList ? 'Hide Hospital List' : 'Select a Specific Hospital'}
                      </Button>
                      
                      {showHospitalList && (
                        <div className="mt-4 border rounded-md overflow-hidden">
                          {hospitalDemoCredentials.map((hospital, index) => (
                            <div 
                              key={index} 
                              className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleHospitalSelect(hospital)}
                            >
                              <div className="font-medium">{hospital.name}</div>
                              <div className="text-sm text-gray-500">{hospital.address}</div>
                              <div className="text-sm text-gray-500">{hospital.email}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                          autoComplete="current-password"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-brand-600 hover:bg-brand-700" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in...' : `Sign in as ${loginType}`}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                  
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDemoLogin(loginType)}
                      disabled={isSubmitting}
                    >
                      Demo Login as {loginType}
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-brand-600 hover:underline">
                        Sign up
                      </Link>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      <Link to="/forgot-password" className="hover:underline">
                        Forgot your password?
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
