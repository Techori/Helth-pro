
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
  User,
  AlertCircle,
  UserCheck,
  Phone
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRole } from '@/types/app.types';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState, signUp } = useAuth();
  const [loaded, setLoaded] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "patient" as UserRole,
    hospitalName: "",
    location: "",
    phone: "",
    services: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.initialized && authState.user) {
      const redirectPath = `/${authState.user.role}-dashboard`;
      navigate(redirectPath, { replace: true });
    }
  }, [authState, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.firstName || !formData.lastName || !formData.phone) {
      setError('All fields are required');
      return false;
    }

    if (formData.role === "hospital") {
      if (!formData.hospitalName || !formData.location || !formData.phone) {
        setError("All hospital details are required");
        return false;
      }
    }

    if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
      setError("First name should only contain letters");
      return false;
    }

    if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
      setError("Last name should only contain letters");
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
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
      // Prepare the data for the API
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        ...(formData.role === "hospital" && {
          hospitalName: formData.hospitalName,
          location: formData.location,
          services: formData.services
        })
      };

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
      });

      // Redirect based on role
      const redirectPath = `/${formData.role}-dashboard`;
      navigate(redirectPath, { replace: true });

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
      toast({
        title: "Registration Failed",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading, show loading indicator
  if (authState.loading || !authState.initialized) {
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
                    Create your account
                  </CardTitle>
                  <CardDescription>
                    Join RI Medicare to access healthcare services
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                          required
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                          required
                        />
                      </div>
                    </div>

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

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="patient">Patient</option>
                        <option value="hospital">Hospital</option>
                        {/* <option value="sales">Sales</option>
                        <option value="crm">CRM</option>
                        <option value="agent">Agent</option>
                        <option value="support">Support</option> */}
                      </select>
                    </div>

                    {formData.role === "hospital" && (
                      <>
                        <div className="relative">
                          <input
                            type="text"
                            name="hospitalName"
                            placeholder="Hospital Name"
                            value={formData.hospitalName}
                            onChange={handleInputChange}
                            className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                            required
                          />
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            name="location"
                            placeholder="Hospital Location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                            required
                          />
                        </div>

                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Hospital Phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                            required
                          />
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            name="services"
                            placeholder="Services (comma-separated)e.g., General, Cardiology, Orthopedics"
                            value={formData.services}
                            onChange={handleInputChange}
                            className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"                          />
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating account...' : 'Create Account'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link to="/login" className="text-brand-600 hover:underline">
                        Sign in
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

export default Signup;
