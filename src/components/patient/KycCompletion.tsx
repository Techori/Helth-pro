
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Check, User, Calendar, MapPin } from 'lucide-react';
import { apiRequest } from '@/services/api';

interface KycCompletionProps {
  onComplete: (uhid: string) => void;
}

const KycCompletion = ({ onComplete }: KycCompletionProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    dependents: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiRequest('/kyc/complete', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      toast({
        title: "KYC Completed Successfully",
        description: `Your UHID is: ${response.uhid}`,
      });

      onComplete(response.uhid);
    } catch (error: any) {
      toast({
        title: "KYC Submission Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Complete KYC Verification
        </CardTitle>
        <CardDescription>
          Complete your KYC to get your unique UHID and access loan services
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
            {isSubmitting ? 'Completing KYC...' : 'Complete KYC'}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KycCompletion;
