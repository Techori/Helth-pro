
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { getHospitalById } from '@/services/hospitalService';
import { Hospital } from '@/types/app.types';
import { Hospital as HospitalIcon, MapPin, Mail, Phone, Globe } from 'lucide-react';

const HospitalProfileInfo = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        // Using a mock hospital ID for demo purposes
        // In real scenario, this would come from user data
        if (authState.user) {
          // Get hospital data associated with the current user
          const data = await getHospitalById(authState.user.id);
          setHospital(data);
        }
      } catch (err) {
        console.error('Error fetching hospital data:', err);
        setError('Failed to load hospital information');
      } finally {
        setLoading(false);
      }
    };

    if (authState.initialized && authState.user) {
      fetchHospitalData();
    }
  }, [authState]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hospital Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hospital Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use a fallback when hospital data isn't available
  const hospitalName = hospital?.name || authState?.user?.firstName || 'Hospital';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start">
          <div className="bg-brand-100 p-3 rounded-full mr-4">
            <HospitalIcon className="h-8 w-8 text-brand-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold">{hospitalName}</h3>
            {hospital ? (
              <div className="mt-2 space-y-2 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.zipCode}</span>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{hospital.contactEmail}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{hospital.contactPhone}</span>
                </div>
                
                {hospital.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {hospital.website}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-gray-600">
                {authState?.user?.email || 'No hospital data available'}
              </p>
            )}
            
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalProfileInfo;
