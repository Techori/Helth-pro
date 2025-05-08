
import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Hospital, 
  Users,
  Mail, 
  Lock,
  BadgePercent,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';

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

  // Redirect if already authenticated
  if (authState.initialized && authState.user) {
    const redirectPath = `/${authState.user.role}-dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

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
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
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
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        // Auth provider will handle the redirect
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Since we're now using real authentication, demo login is removed

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
                        onClick={() => setLoginType('patient')}
                      >
                        Patient
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'hospital' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => setLoginType('hospital')}
                      >
                        Hospital
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'admin' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => setLoginType('admin')}
                      >
                        Admin
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'sales' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => setLoginType('sales')}
                      >
                        Sales
                      </button>
                      <button
                        className={`flex-1 py-2 px-3 text-sm font-medium ${loginType === 'crm' ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-50'}`}
                        onClick={() => setLoginType('crm')}
                      >
                        CRM
                      </button>
                    </div>
                  </div>
                  
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
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link to="/register" className="text-brand-600 hover:underline">
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
