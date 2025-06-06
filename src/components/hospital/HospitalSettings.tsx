import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Check, Save, Upload, Building, Users, Shield, FileCheck, UserCheck } from "lucide-react";

const HospitalSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Hospital profile state
  const [hospitalProfile, setHospitalProfile] = useState({
    name: "City General Hospital",
    email: "admin@citygeneralhospital.com",
    phone: "+91 9876543210",
    address: "123 Healthcare Avenue, Medical District, Mumbai - 400001",
    website: "www.citygeneralhospital.com",
    licenseNumber: "MH-HOSP-12345",
    foundedYear: "1995",
    type: "Multi-Specialty Hospital",
    bedCount: "250",
  });

  // Branch information state
  const [branchInfo, setBranchInfo] = useState({
    branchName: "City General Hospital - Main Branch",
    branchManagerName: "Dr. Rajesh Kumar",
    branchManagerEmail: "rajesh.kumar@citygeneralhospital.com",
    branchCode: "CGH-MUM-001",
    branchContact: "+91 9876543210",
    branchAddress: "123 Healthcare Avenue, Medical District, Mumbai - 400001",
  });

  // Relationship manager information state
  const [rmInfo, setRmInfo] = useState({
    relationshipManager: "Ms. Priya Singh",
    rmContact: "+91 8765432109",
    rmEmail: "priya.singh@rimedicare.com",
    salesManager: "Mr. Vikram Malhotra",
    salesManagerEmail: "vikram.malhotra@rimedicare.com",
  });

  // Compliance document state
  const [complianceDocuments, setComplianceDocuments] = useState([
    { name: "Hospital Registration Certificate", status: "Verified", date: "15/01/2023" },
    { name: "Medical License", status: "Verified", date: "10/02/2023" },
    { name: "Fire Safety Certificate", status: "Pending", date: "05/03/2023" },
    { name: "Pollution Control Certificate", status: "Verified", date: "20/01/2023" },
    { name: "Biomedical Waste Authorization", status: "Pending", date: "15/02/2023" },
  ]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('Token:', token);

      // First, get the current hospital profile to check if it exists and get the ID
      const getProfileResponse = await fetch("/api/hospitals/me", {
        method: "GET",
        headers: {
          "x-auth-token": token
        }
      });

      console.log('Get Profile Response Status:', getProfileResponse.status);
      
      let hospitalId = null;
      if (getProfileResponse.ok) {
        const profileData = await getProfileResponse.json();
        hospitalId = profileData._id;
        console.log('Existing hospital ID:', hospitalId);
      }

      // Transform the data to match the backend schema
      const hospitalData = {
        name: hospitalProfile.name,
        contactEmail: hospitalProfile.email,
        contactPhone: hospitalProfile.phone,
        address: hospitalProfile.address,
        website: hospitalProfile.website,
        licenseNumber: hospitalProfile.licenseNumber,
        foundedYear: parseInt(hospitalProfile.foundedYear),
        hospitalType: hospitalProfile.type,
        bedCount: parseInt(hospitalProfile.bedCount),
        status: 'active',
        // Add required fields
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        contactPerson: hospitalProfile.name
      };

      console.log('Sending hospital data:', JSON.stringify(hospitalData, null, 2));

      // Determine the endpoint based on whether we have a hospital ID
      const endpoint = hospitalId ? `/api/hospitals/${hospitalId}` : '/api/hospitals/me';
      console.log('Using endpoint:', endpoint);

      // Use PUT for both create and update
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify(hospitalData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('Response data:', JSON.stringify(result, null, 2));

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You are not authorized to update hospital profiles');
        } else if (response.status === 400) {
          throw new Error(result.message || 'Invalid data provided');
        } else if (response.status === 404) {
          throw new Error('Hospital profile not found');
        } else {
          throw new Error(result.message || "Failed to update profile");
        }
      }

      toast({
        title: "Profile Updated",
        description: "Hospital profile has been successfully updated.",
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong while updating the profile",
      });
    }
  };

  const handleSaveBranch = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to save branch information",
          variant: "destructive"
        });
        return;
      }

      // First, check if hospital profile exists
      const hospitalResponse = await fetch('/hospitals/me', {
        headers: {
          'x-auth-token': token
        }
      });

      if (!hospitalResponse.ok) {
        if (hospitalResponse.status === 404) {
          // Create a new hospital profile if it doesn't exist
          const createHospitalResponse = await fetch('/hospitals/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              name: hospitalProfile.name,
              contactEmail: hospitalProfile.email,
              contactPhone: hospitalProfile.phone,
              address: hospitalProfile.address,
              website: hospitalProfile.website,
              licenseNumber: hospitalProfile.licenseNumber,
              foundedYear: parseInt(hospitalProfile.foundedYear),
              hospitalType: hospitalProfile.type,
              bedCount: parseInt(hospitalProfile.bedCount),
              status: 'active',
              city: 'Mumbai',
              state: 'Maharashtra',
              zipCode: '400001',
              contactPerson: hospitalProfile.name
            })
          });

          if (!createHospitalResponse.ok) {
            const errorData = await createHospitalResponse.json();
            throw new Error(errorData.message || 'Failed to create hospital profile');
          }
        } else {
          const errorData = await hospitalResponse.json();
          throw new Error(errorData.message || 'Failed to check hospital profile');
        }
      }

      console.log('Saving branch information:', branchInfo);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'x-auth-token': token
      });

      const response = await fetch('/hospitals/branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(branchInfo)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server response was not JSON');
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid data provided');
        } else if (response.status === 404) {
          throw new Error('Hospital profile not found');
        } else {
          throw new Error(data.message || 'Failed to save branch information');
        }
      }

      toast({
        title: "Success",
        description: "Branch information saved successfully"
      });
      setBranchInfo(data.data || data);
    } catch (error) {
      console.error('Error saving branch information:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save branch information',
        variant: "destructive"
      });
    }
  };

  const handleSaveRM = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        toast({
          title: "Error",
          description: "Please login to save RM information",
          variant: "destructive"
        });
        return;
      }

      // First, check if hospital profile exists
      const hospitalResponse = await fetch('/api/hospitals/me', {
        headers: {
          'x-auth-token': token
        }
      });

      if (!hospitalResponse.ok) {
        if (hospitalResponse.status === 404) {
          // Create a new hospital profile if it doesn't exist
          const createHospitalResponse = await fetch('/api/hospitals/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              name: hospitalProfile.name,
              contactEmail: hospitalProfile.email,
              contactPhone: hospitalProfile.phone,
              address: hospitalProfile.address,
              website: hospitalProfile.website,
              licenseNumber: hospitalProfile.licenseNumber,
              foundedYear: parseInt(hospitalProfile.foundedYear),
              hospitalType: hospitalProfile.type,
              bedCount: parseInt(hospitalProfile.bedCount),
              status: 'active',
              city: 'Mumbai',
              state: 'Maharashtra',
              zipCode: '400001',
              contactPerson: hospitalProfile.name
            })
          });

          if (!createHospitalResponse.ok) {
            const errorData = await createHospitalResponse.json();
            throw new Error(errorData.message || 'Failed to create hospital profile');
          }
        } else {
          const errorData = await hospitalResponse.json();
          throw new Error(errorData.message || 'Failed to check hospital profile');
        }
      }

      console.log('Saving RM information:', rmInfo);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'x-auth-token': token
      });

      const response = await fetch('/api/hospitals/rm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(rmInfo)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('RM save response:', data);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid data provided');
        } else if (response.status === 404) {
          throw new Error('Hospital profile not found');
        } else {
          throw new Error(data.message || 'Failed to save RM information');
        }
      }

      toast({
        title: "Success",
        description: "RM information saved successfully"
      });
      setRmInfo(data.data);
    } catch (error) {
      console.error('Error saving RM information:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save RM information',
        variant: "destructive"
      });
    }
  };

  // Add useEffect to fetch branch and RM information on component mount
  useEffect(() => {
    const fetchBranchAndRMInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch branch information
        const branchResponse = await fetch('/hospitals/branch', {
          headers: {
            'x-auth-token': token
          }
        });
        const branchData = await branchResponse.json();
        if (branchData && Object.keys(branchData).length > 0) {
          setBranchInfo(branchData);
        }

        // Fetch RM information
        const rmResponse = await fetch('/hospitals/rm', {
          headers: {
            'x-auth-token': token
          }
        });
        const rmData = await rmResponse.json();
        if (rmData && Object.keys(rmData).length > 0) {
          setRmInfo(rmData);
        }
      } catch (error) {
        console.error('Error fetching branch and RM information:', error);
      }
    };

    fetchBranchAndRMInfo();
  }, []);

  const handleUploadDocument = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded and is pending verification.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Hospital Profile</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Profile</CardTitle>
              <CardDescription>
                Manage your hospital information and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input 
                    id="hospitalName" 
                    value={hospitalProfile.name} 
                    onChange={(e) => setHospitalProfile({...hospitalProfile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalEmail">Email Address</Label>
                  <Input 
                    id="hospitalEmail" 
                    type="email" 
                    value={hospitalProfile.email} 
                    onChange={(e) => setHospitalProfile({...hospitalProfile, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalPhone">Phone Number</Label>
                  <Input 
                    id="hospitalPhone" 
                    value={hospitalProfile.phone} 
                    onChange={(e) => setHospitalProfile({...hospitalProfile, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalWebsite">Website</Label>
                  <Input 
                    id="hospitalWebsite" 
                    value={hospitalProfile.website} 
                    onChange={(e) => setHospitalProfile({...hospitalProfile, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hospitalAddress">Address</Label>
                  <Input 
                    id="hospitalAddress" 
                    value={hospitalProfile.address} 
                    onChange={(e) => setHospitalProfile({...hospitalProfile, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input 
                    id="licenseNumber" 
                    value={hospitalProfile.licenseNumber}
                    onChange={(e) => setHospitalProfile({...hospitalProfile, licenseNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input 
                    id="foundedYear" 
                    value={hospitalProfile.foundedYear}
                    onChange={(e) => setHospitalProfile({...hospitalProfile, foundedYear: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalType">Hospital Type</Label>
                  <Input 
                    id="hospitalType" 
                    value={hospitalProfile.type}
                    onChange={(e) => setHospitalProfile({...hospitalProfile, type: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedCount">Bed Count</Label>
                  <Input 
                    id="bedCount" 
                    value={hospitalProfile.bedCount}
                    onChange={(e) => setHospitalProfile({...hospitalProfile, bedCount: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Documents</CardTitle>
                  <CardDescription>
                    Manage compliance certifications and documents
                  </CardDescription>
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <FileCheck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">Uploaded on: {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.status === "Verified" ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                          <Check className="h-3 w-3" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                          Pending
                        </div>
                      )}
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Update</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full bg-slate-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Compliance Status</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your hospital is currently <span className="text-amber-600 font-medium">partially compliant</span>. 
                      Please upload all required documents to achieve full compliance.
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">3 of 5 documents verified (60%)</p>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>RI Medicare Branch Information</CardTitle>
              <CardDescription>
                Verify your RI Medicare branch and relationship manager details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium flex items-center mb-4">
                  <Building className="mr-2 h-5 w-5 text-primary" />
                  RI Medicare Branch Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchName">RI Medicare Branch</Label>
                    <Input 
                      id="branchName" 
                      value={branchInfo.branchName}
                      onChange={(e) => setBranchInfo({...branchInfo, branchName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchManagerName">Branch Manager Name</Label>
                    <Input 
                      id="branchManagerName" 
                      value={branchInfo.branchManagerName}
                      onChange={(e) => setBranchInfo({...branchInfo, branchManagerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchManagerEmail">Branch Manager Email</Label>
                    <Input 
                      id="branchManagerEmail" 
                      value={branchInfo.branchManagerEmail}
                      onChange={(e) => setBranchInfo({...branchInfo, branchManagerEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input 
                      id="branchCode" 
                      value={branchInfo.branchCode}
                      onChange={(e) => setBranchInfo({...branchInfo, branchCode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchContact">Branch Contact Number</Label>
                    <Input 
                      id="branchContact" 
                      value={branchInfo.branchContact}
                      onChange={(e) => setBranchInfo({...branchInfo, branchContact: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchAddress">Branch Address</Label>
                    <Input 
                      id="branchAddress" 
                      value={branchInfo.branchAddress}
                      onChange={(e) => setBranchInfo({...branchInfo, branchAddress: e.target.value})}
                    />
                  </div>
                </div>
                <Button className="mt-4" onClick={handleSaveBranch}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Branch Information
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium flex items-center mb-4">
                  <UserCheck className="mr-2 h-5 w-5 text-primary" />
                  RI Medicare Relationship Manager Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="relationshipManager">Relationship Manager</Label>
                    <Input 
                      id="relationshipManager" 
                      value={rmInfo.relationshipManager}
                      onChange={(e) => setRmInfo({...rmInfo, relationshipManager: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rmContact">Relationship Manager Contact Number</Label>
                    <Input 
                      id="rmContact" 
                      value={rmInfo.rmContact}
                      onChange={(e) => setRmInfo({...rmInfo, rmContact: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rmEmail">Relationship Manager Email</Label>
                    <Input 
                      id="rmEmail" 
                      value={rmInfo.rmEmail}
                      onChange={(e) => setRmInfo({...rmInfo, rmEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesManager">Sales Manager Name</Label>
                    <Input 
                      id="salesManager" 
                      value={rmInfo.salesManager}
                      onChange={(e) => setRmInfo({...rmInfo, salesManager: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesManagerEmail">Sales Manager Email</Label>
                    <Input 
                      id="salesManagerEmail" 
                      value={rmInfo.salesManagerEmail}
                      onChange={(e) => setRmInfo({...rmInfo, salesManagerEmail: e.target.value})}
                    />
                  </div>
                </div>
                <Button className="mt-4" onClick={handleSaveRM}>
                  <Save className="mr-2 h-4 w-4" />
                  Save RM Information
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-700">Verification Status</h4>
                    <p className="text-sm text-blue-600">
                      All your branch and relationship manager details have been verified. Please keep this information updated for seamless communication.
                    </p>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <Button variant="outline">
                  Enable Two-Factor Authentication
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="font-medium mb-2">Active Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These are the devices that are currently logged into your account.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-xs text-muted-foreground">Mumbai, India • Current session</p>
                    </div>
                    <Button variant="ghost" size="sm">Sign Out</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Safari on iPhone</p>
                      <p className="text-xs text-muted-foreground">Mumbai, India • 2 days ago</p>
                    </div>
                    <Button variant="ghost" size="sm">Sign Out</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalSettings;