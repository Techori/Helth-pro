import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Check, Save, Upload, Building, Users, Shield, FileCheck, UserCheck, UploadCloud } from "lucide-react";

const HospitalSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

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

  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [description, setDescription] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!documentType.trim() || !validUntil.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill all document fields before uploading.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("documentType", documentType);
    formData.append("validUntil", validUntil);
    formData.append("description", description);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Document Uploaded",
          description: "Your document has been uploaded successfully and is pending verification.",
        });

        // Clear fields
        setSelectedFile(null);
        setSelectedFileName("");
        setDocumentType("");
        setValidUntil("");
        setDescription("");
      } else {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your document. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    // Validate required fields
    const requiredFields = ["name", "email", "phone"];
    const missingFields = requiredFields.filter(
      (field) => !hospitalProfile[field]?.trim()
    );

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: `Please fill in the following required fields: ${missingFields.join(", ")}.`,
      });
      return;

    }
  };

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(hospitalProfile.email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    // Validate phone format (basic check for digits and optional country code)
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(hospitalProfile.phone)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (e.g., +919876543210).",
      });
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch("/api/hospitals/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(hospitalProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to update profile");
      }

      toast({
        title: "Profile Updated",
        description: data.msg || "Hospital profile has been successfully updated.",
      });
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.message.includes("token")) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.message.includes("Email already in use")) {
        errorMessage = "This email is already in use by another hospital.";
      } else if (error.message.includes("Hospital not found")) {
        errorMessage = "Hospital profile not found. Please contact support.";
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleSaveBranchInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/hospitals/branch", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(branchInfo),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to update branch information");
      }

      toast({
        title: "Branch Information Updated",
        description: "RI Medicare branch information has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    }
  };

  const handleSaveRmInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/hospitals/relationship-manager", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(rmInfo),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to update relationship manager information");
      }

      toast({
        title: "RM Information Updated",
        description: "Relationship manager information has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    }
  };

  const handleUpdatePassword = async () => {
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Invalid Password",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Step 1: Verify current password
      const verifyResponse = await fetch("/api/users/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password: currentPassword }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        throw new Error(error.msg || "Current password is incorrect");
      }

      // Step 2: Update password
      const updateResponse = await fetch("/api/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(error.msg || "Failed to update password");
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    }

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
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalEmail">Email Address</Label>
                  <Input
                    id="hospitalEmail"
                    type="email"
                    value={hospitalProfile.email}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalPhone">Phone Number</Label>
                  <Input
                    id="hospitalPhone"
                    value={hospitalProfile.phone}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalWebsite">Website</Label>
                  <Input
                    id="hospitalWebsite"
                    value={hospitalProfile.website}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hospitalAddress">Address</Label>
                  <Input
                    id="hospitalAddress"
                    value={hospitalProfile.address}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={hospitalProfile.licenseNumber}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    value={hospitalProfile.foundedYear}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, foundedYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospitalType">Hospital Type</Label>
                  <Input
                    id="hospitalType"
                    value={hospitalProfile.type}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedCount">Bed Count</Label>
                  <Input
                    id="bedCount"
                    value={hospitalProfile.bedCount}
                    onChange={(e) => setHospitalProfile({ ...hospitalProfile, bedCount: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
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
                <Button onClick={() => document.getElementById('document-file')?.click()}>
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

          <div className="mt-6 p-6 border rounded-md bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Upload New Document</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">Document Type</Label>
                  <select
                    id="document-type"
                    className="w-full p-2 border rounded-md"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="">Select Document Type</option>
                    <option value="registration">Hospital Registration</option>
                    <option value="license">Medical License</option>
                    <option value="tax">Tax Compliance</option>
                    <option value="safety">Safety Certificate</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valid-until">Valid Until</Label>
                  <Input
                    id="valid-until"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-description">Description</Label>
                <textarea
                  id="document-description"
                  placeholder="Enter additional details about this document"
                  className="w-full p-2 border rounded-md"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-file">Upload File</Label>
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop your file here, or click to browse</p>
                  <input
                    id="document-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById('document-file')?.click()}
                  >
                    Select File
                  </Button>
                  {selectedFileName && (
                    <p className="mt-2 text-sm text-gray-600">Selected File: {selectedFileName}</p>
                  )}
                </div>
              </div>
              <Button onClick={handleUpload}>Upload Document</Button>
            </div>
          </div>
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
                      onChange={(e) => setBranchInfo({ ...branchInfo, branchName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchManagerName">Branch Manager Name</Label>
                    <Input
                      id="branchManagerName"
                      value={branchInfo.branchManagerName}
                      onChange={(e) => setBranchInfo({ ...branchInfo, branchManagerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchManagerEmail">Branch Manager Email</Label>
                    <Input
                      id="branchManagerEmail"
                      value={branchInfo.branchManagerEmail}
                      onChange={(e) => setBranchInfo({ ...branchInfo, branchManagerEmail: e.target.value })}
                    />
                  </div>
                  <div classNameыт

                    className="space-y-2">
                    <Label htmlFor="branchCode">Branch Code</Label>
                    <Input
                      id="branchCode"
                      value={branchInfo.branchCode}
                      onChange={(e) => setBranchInfo({ ...branchInfo, branchCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchContact">Branch Contact Number</Label>
                    <Input
                      id="branchContact"
                      value={branchInfo.branchContact}
                      onChange={(e) => setBranchInfo({ ...branchInfo, branchContact: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchAddress">Branch Address</Label>
                    <Input
                      id="branchAddress"
                      value={branchInfo.branchAddress}
                      onChange={(e) => setBranchInfo({ ...branchInfo, branchAddress: e.target.value })}
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
                      onChange={(e) => setRmInfo({ ...rmInfo, relationshipManager: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rmContact">Relationship Manager Contact Number</Label>
                    <Input
                      id="rmContact"
                      value={rmInfo.rmContact}
                      onChange={(e) => setRmInfo({ ...rmInfo, rmContact: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rmEmail">Relationship Manager Email</Label>
                    <Input
                      id="rmEmail"
                      value={rmInfo.rmEmail}
                      onChange={(e) => setRmInfo({ ...rmInfo, rmEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesManager">Sales Manager Name</Label>
                    <Input
                      id="salesManager"
                      value={rmInfo.salesManager}
                      onChange={(e) => setRmInfo({ ...rmInfo, salesManager: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesManagerEmail">Sales Manager Email</Label>
                    <Input
                      id="salesManagerEmail"
                      value={rmInfo.salesManagerEmail}
                      onChange={(e) => setRmInfo({ ...rmInfo, salesManagerEmail: e.target.value })}
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
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
              <Button onClick={handleUpdatePassword}>Update Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalSettings;