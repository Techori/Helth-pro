
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Building, CheckCircle2 } from 'lucide-react';

// Schema for form validation
const formSchema = z.object({
  hospitalName: z.string().min(3, { message: "Hospital name must be at least 3 characters" }),
  contactPerson: z.string().min(3, { message: "Contact person name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  establishedYear: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1900 && Number(val) <= new Date().getFullYear(), {
    message: "Please enter a valid establishment year",
  }),
  numberOfBeds: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid number of beds",
  }),
});

const HospitalRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [credentials, setCredentials] = useState({
    referenceNumber: '',
    userId: '',
    loginId: '',
    password: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      establishedYear: '',
      numberOfBeds: '',
    },
  });

  // Generate a random alphanumeric string
  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate secure password
  const generateSecurePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+';
    
    let password = '';
    // Ensure at least one of each character type
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Add more random characters
    for (let i = 0; i < 8; i++) {
      const allChars = uppercase + lowercase + numbers + symbols;
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate credentials
      const referenceNumber = `RI-HOSP-${Date.now().toString().slice(-6)}`;
      const userId = `H${Date.now().toString().slice(-6)}`;
      const loginId = values.email;
      const password = generateSecurePassword();
      
      setCredentials({
        referenceNumber,
        userId,
        loginId,
        password,
      });
      
      // In a real app, you would save this data to a database
      console.log("Hospital registration data:", {
        ...values,
        referenceNumber,
        userId,
        loginId,
        password,
      });
      
      toast({
        title: "Registration Successful!",
        description: "Your hospital has been registered successfully.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred while registering your hospital. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Information copied to clipboard.",
    });
  };

  // Display success screen if form was submitted
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">
                  Registration Successful!
                </h1>
                <p className="text-lg text-gray-600">
                  Your hospital has been registered with RI Medicare. Please save your credentials.
                </p>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-500">Reference Number</span>
                        <button 
                          onClick={() => handleCopyToClipboard(credentials.referenceNumber)}
                          className="text-xs text-brand-600 hover:text-brand-700"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{credentials.referenceNumber}</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-500">User ID</span>
                        <button 
                          onClick={() => handleCopyToClipboard(credentials.userId)}
                          className="text-xs text-brand-600 hover:text-brand-700"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{credentials.userId}</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-500">Login ID (Your Email)</span>
                        <button 
                          onClick={() => handleCopyToClipboard(credentials.loginId)}
                          className="text-xs text-brand-600 hover:text-brand-700"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{credentials.loginId}</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-500">Password</span>
                        <button 
                          onClick={() => handleCopyToClipboard(credentials.password)}
                          className="text-xs text-brand-600 hover:text-brand-700"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-lg font-semibold text-gray-900 font-mono">{credentials.password}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Important:</strong> Please save these credentials securely. This is the only time you'll see your password.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="default" 
                  className="bg-brand-600 hover:bg-brand-700 flex-1"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.print()}
                >
                  Print Credentials
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-4">
                <Building className="h-8 w-8 text-brand-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">
                Hospital Registration
              </h1>
              <p className="text-lg text-gray-600 max-w-lg mx-auto">
                Join the RI Medicare network to provide flexible payment options to your patients.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="hospitalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hospital Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter hospital name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter contact person's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter hospital address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="establishedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Established*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter establishment year" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="numberOfBeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Beds*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number of beds" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      By submitting this form, you agree to RI Medicare's <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>.
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-600 hover:bg-brand-700"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Register Hospital"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HospitalRegistration;
