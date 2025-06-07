
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Phone, Mail, Globe, Edit, Users, TrendingUp, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllHospitals, getHospitalAnalytics } from "@/services/hospitalService";
import { useAuth } from "@/hooks/useAuth";
import { Hospital } from '@/types/app.types';

const HospitalProfileInfo = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitalData();
  }, [authState.user]);

  const fetchHospitalData = async () => {
    try {
      setLoading(true);
      // Get hospitals for the current user
      const hospitals = await getAllHospitals();
      
      if (hospitals && hospitals.length > 0) {
        const userHospital = hospitals[0]; // Assuming user has one hospital
        setHospital(userHospital);
        
        if (userHospital.id) {
          const analyticsData = await getHospitalAnalytics(userHospital.id);
          setAnalytics(analyticsData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch hospital data:', error);
      toast({
        title: "Error",
        description: "Failed to load hospital information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'active': { className: 'bg-green-100 text-green-800', label: 'Active' },
      'pending': { className: 'bg-yellow-100 text-yellow-800', label: 'Pending Approval' },
      'inactive': { className: 'bg-red-100 text-red-800', label: 'Inactive' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hospital) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Hospital Profile Found</h3>
          <p className="text-gray-600 mb-4">
            It looks like you haven't registered your hospital yet.
          </p>
          <Button onClick={() => window.location.href = '/hospital-registration'}>
            Register Hospital
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hospital Info Card */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {hospital.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(hospital.status)}
                <Badge variant="outline" className="capitalize">
                  {hospital.hospitalType}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-gray-600">
                    {hospital.address}<br />
                    {hospital.city}, {hospital.state} - {hospital.zipCode}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{hospital.contactPhone}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">{hospital.contactEmail}</p>
                </div>
              </div>
              
              {hospital.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a 
                      href={hospital.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {hospital.website}
                    </a>
                  </div>
                </div>
              )}
              
              <div>
                <p className="font-medium">Contact Person</p>
                <p className="text-sm text-gray-600">{hospital.contactPerson}</p>
              </div>
            </div>
          </div>

          {hospital.specialties && hospital.specialties.length > 0 && (
            <div className="mt-6">
              <p className="font-medium mb-2">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {hospital.services && hospital.services.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">Services</p>
              <div className="flex flex-wrap gap-2">
                {hospital.services.map((service, index) => (
                  <Badge key={index} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Total Patients</span>
              </div>
              <span className="font-semibold">{analytics?.totalLoans || 0}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Approved Loans</span>
              </div>
              <span className="font-semibold">{analytics?.approvedLoans || 0}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Pending Loans</span>
              </div>
              <span className="font-semibold">{analytics?.pendingLoans || 0}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Bed Count</span>
              </div>
              <span className="font-semibold">{hospital.bedCount || 'N/A'}</span>
            </div>

            {analytics?.approvalRate && (
              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.approvalRate}%
                  </div>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalProfileInfo;
