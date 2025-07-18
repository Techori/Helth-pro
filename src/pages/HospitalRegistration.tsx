import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { registerHospital } from '@/services/hospitalService';
import { Hospital } from '@/types/app.types';
import { getHospitalByHospitalId } from '@/services/hospitalService';

const HospitalRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState } = useAuth();

  const [formData, setFormData] = useState<Partial<Hospital>>({
    name: '',
    location: '',
    contactPerson: '',
    email: '',
    phone: '',
    services: [],
  });

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);




    
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const values = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.name || !formData.location) {
        toast({
          title: "Validation Error",
          description: "Please fill out all required fields: Name, Location",
          variant: "destructive",
        });
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.contactPerson || !formData.email || !formData.phone) {
        toast({
          title: "Validation Error",
          description: "Please fill out all required fields: Contact Person, Email, Phone",
          variant: "destructive",
        });
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast({
          title: "Validation Error",
          description: "Please provide a valid email address",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    if (!authState?.token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to register a hospital.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await registerHospital(formData, authState.token);

      toast({
        title: "Registration Successful",
        description: "Your hospital has been registered successfully! You can now manage your hospital.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Hospital registration error:', error);
      const errorMessage = error.response?.data?.msg || error.response?.data?.errors?.[0]?.msg || 'There was an error registering your hospital. Please try again.';
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ color: '#521C0D' }}>
      <Navbar />
      <div className="flex-grow container mx-auto py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Hospital Registration</h1>
          <div className="mb-10">
            <div className="flex justify-between items-center relative">
              <div className={`w-1/3 text-center ${step >= 1 ? 'text-#521C0D' : 'text-gray-400'}`}>
                <div className={`rounded-full h-10 w-10 mx-auto flex items-center justify-center ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>1</div>
                <p className="mt-2">Basic Information</p>
              </div>
              <div className={`w-1/3 text-center ${step >= 2 ? 'text-#521C0D' : 'text-gray-400'}`}>
                <div className={`rounded-full h-10 w-10 mx-auto flex items-center justify-center ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>2</div>
                <p className="mt-2">Hospital Details</p>
              </div>
              <div className={`w-1/3 text-center ${step >= 3 ? 'text-#521C0D' : 'text-gray-400'}`}>
                <div className={`rounded-full h-10 w-10 mx-auto flex items-center justify-center ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-gray-200'}`}>3</div>
                <p className="mt-2">Confirmation</p>
              </div>
              <div className="absolute top-5 left-0 w-full h-1 bg-brand-600 -z-10">
                <div
                  className="h-full bg-brand-600"
                  style={{ width: `${(step - 1) * 50}%` }}
                ></div>
              </div>
            </div>
          </div>

          <Card style={{ backgroundColor: '#FFE0C2' }} className="shadow-lg">
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Basic Information'}
                {step === 2 && 'Hospital Details'}
                {step === 3 && 'Review and Submit'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Please provide the basic information about your hospital.'}
                {step === 2 && 'Please provide detailed information about your hospital.'}
                {step === 3 && 'Review your information and submit your registration.'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" style={{ color: '#521C0D' }}>Hospital Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" style={{ color: '#521C0D' }}>Location *</Label>
                      <Textarea
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contactPerson" style={{ color: '#521C0D' }}>Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" style={{ color: '#521C0D' }}>Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" style={{ color: '#521C0D' }}>Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="services" style={{ color: '#521C0D' }}>Services (comma-separated)</Label>
                      <Input
                        id="services"
                        name="services"
                        value={formData.services?.join(', ') || ''}
                        onChange={handleMultiSelectChange}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{ color: '#521C0D' }}>Review Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Hospital Name</p>
                        <p>{formData.name}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Location</p>
                        <p>{formData.location}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Contact Person</p>
                        <p>{formData.contactPerson}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Email</p>
                        <p>{formData.email}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Phone</p>
                        <p>{formData.phone}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Services</p>
                        <p>{formData.services?.join(', ') || 'None specified'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>

            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} style={{ backgroundColor: '#D5451B', color: '#FFFFFF' }}>
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="ml-auto" style={{ backgroundColor: '#D5451B', color: '#FFFFFF' }}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="ml-auto"
                  style={{ backgroundColor: '#D5451B', color: '#FFFFFF' }}
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HospitalRegistration;