import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const backendURL = import.meta.env.VITE_BACKEND_BASE_URL;

const HospitalRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState, signIn } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    specialties: [],
    hospitalType: 'private',
    bedCount: 0,
    registrationNumber: '',
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const values = value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast({
          title: "Validation Error",
          description: "Please fill out all required fields",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `/api/hospitals`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authState?.user ? `Bearer ${localStorage.getItem('token')}` : '',
          },
        }
      );

      toast({
        title: "Registration Successful",
        description: "Your hospital has been registered successfully! You can now login to manage your hospital.",
      });

      // Redirect to login after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Hospital registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering your hospital. Please try again.",
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
                <p className="mt-2" >Hospital Details</p>
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
                      <Label htmlFor="address" style={{ color: '#521C0D' }}>Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" style={{ color: '#521C0D' }}>City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" style={{ color: '#521C0D' }}>State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" style={{ color: '#521C0D' }}>ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
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
                        <Label htmlFor="contactEmail" style={{ color: '#521C0D' }}>Contact Email *</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone" style={{ color: '#521C0D' }}>Contact Phone *</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="specialties" style={{ color: '#521C0D' }}>Specialties (comma-separated)</Label>
                      <Input
                        id="specialties"
                        name="specialties"
                        value={formData.specialties.join(', ')}
                        onChange={handleMultiSelectChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hospitalType" style={{ color: '#521C0D' }}>Hospital Type</Label>
                        <Select
                          value={formData.hospitalType}
                          onValueChange={(value) => handleSelectChange('hospitalType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select hospital type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="nonprofit">Non-Profit</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bedCount" style={{ color: '#521C0D' }}>Bed Count</Label>
                        <Input
                          id="bedCount"
                          name="bedCount"
                          type="number"
                          value={formData.bedCount.toString()}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="registrationNumber" style={{ color: '#521C0D' }}>Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
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
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Address</p>
                        <p>{formData.address}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>City</p>
                        <p>{formData.city}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>State</p>
                        <p>{formData.state}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>ZIP Code</p>
                        <p>{formData.zipCode}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Contact Person</p>
                        <p>{formData.contactPerson}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Contact Email</p>
                        <p>{formData.contactEmail}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Contact Phone</p>
                        <p>{formData.contactPhone}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Specialties</p>
                        <p>{formData.specialties.join(', ') || 'None specified'}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Hospital Type</p>
                        <p className="capitalize">{formData.hospitalType}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Bed Count</p>
                        <p>{formData.bedCount}</p>
                      </div>
                      <div className="p-4 border rounded-md bg-white shadow-sm">
                        <p className="text-base font-medium" style={{ color: '#521C0D' }}>Registration Number</p>
                        <p>{formData.registrationNumber || 'Not provided'}</p>
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
