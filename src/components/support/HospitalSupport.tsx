
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAllHospitals } from "@/services/hospitalService";
import { Hospital } from '@/types/app.types';
import { Skeleton } from "@/components/ui/skeleton";
import { Search, CheckCircle, XCircle, Clock, Phone, Globe, MapPin, Mail, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const HospitalSupport: React.FC = () => {
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const data = await getAllHospitals();
        setHospitals(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
        setError('Failed to load hospitals. Please try again later.');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load hospital data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [toast]);

  const filteredHospitals = hospitals.filter(hospital => 
    hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    hospital.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleContactHospital = (hospital: Hospital) => {
    toast({
      title: "Contact Initiated",
      description: `Contacting ${hospital.name} at ${hospital.contactEmail}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Support</CardTitle>
          <CardDescription>Manage and support hospital partners on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hospitals by name, city, or state..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-6">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="mt-2 text-lg font-medium">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-muted-foreground">No hospitals found matching your search criteria.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.city}, {hospital.state}</TableCell>
                      <TableCell>{hospital.contactPerson}</TableCell>
                      <TableCell>{getStatusBadge(hospital.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => handleViewDetails(hospital)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {selectedHospital && (
            <div className="mt-6 p-6 border rounded-lg bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{selectedHospital.name}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p>{selectedHospital.address}, {selectedHospital.city}, {selectedHospital.state} - {selectedHospital.zipCode}</p>
                  </div>
                </div>
                {getStatusBadge(selectedHospital.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      <span>{selectedHospital.contactEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      <span>{selectedHospital.contactPhone}</span>
                    </div>
                    {selectedHospital.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-primary" />
                        <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedHospital.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Hospital Details</h4>
                  <div className="space-y-1">
                    <p><span className="font-medium">Contact Person:</span> {selectedHospital.contactPerson}</p>
                    <p><span className="font-medium">Registration #:</span> {selectedHospital.registrationNumber || 'Not available'}</p>
                    <p><span className="font-medium">Type:</span> {selectedHospital.hospitalType || 'Not specified'}</p>
                    <p><span className="font-medium">Bed Count:</span> {selectedHospital.bedCount || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <Collapsible className="mt-4">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">View Specialties and Services</Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.specialties && selectedHospital.specialties.length > 0 ? 
                          selectedHospital.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">{specialty}</Badge>
                          )) : 
                          <p className="text-muted-foreground">No specialties listed</p>
                        }
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.services && selectedHospital.services.length > 0 ? 
                          selectedHospital.services.map((service, index) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          )) : 
                          <p className="text-muted-foreground">No services listed</p>
                        }
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <Button onClick={() => handleContactHospital(selectedHospital)}>
                  Contact Hospital
                </Button>
                <Button variant="outline" onClick={() => setSelectedHospital(null)}>
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredHospitals.length} of {hospitals.length} hospitals
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HospitalSupport;
