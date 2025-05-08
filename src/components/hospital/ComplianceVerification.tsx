
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, UploadCloud, AlertTriangle, Shield, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ComplianceVerification = () => {
  const [activeTab, setActiveTab] = useState("documents");

  const handleUpload = () => {
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully and is pending verification.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Compliance & Verification</CardTitle>
              <CardDescription>Manage regulatory compliance and document verification</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button className="flex items-center gap-1">
                <UploadCloud className="h-4 w-4" /> Upload Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="documents" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="documents">
                <FileText className="mr-2 h-4 w-4" /> 
                Required Documents
              </TabsTrigger>
              <TabsTrigger value="verifications">
                <FileCheck className="mr-2 h-4 w-4" /> 
                Verification Status
              </TabsTrigger>
              <TabsTrigger value="compliance">
                <Shield className="mr-2 h-4 w-4" /> 
                Compliance Status
              </TabsTrigger>
              <TabsTrigger value="issues">
                <AlertTriangle className="mr-2 h-4 w-4" /> 
                Compliance Issues
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Required For</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Hospital Registration Certificate</TableCell>
                      <TableCell>Legal Compliance</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell>15/01/2030</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Medical Practitioner Licenses</TableCell>
                      <TableCell>Professional Compliance</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending Renewal</Badge>
                      </TableCell>
                      <TableCell>05/12/2024</TableCell>
                      <TableCell>05/05/2025</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tax Compliance Certificate</TableCell>
                      <TableCell>Financial Compliance</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </TableCell>
                      <TableCell>31/03/2025</TableCell>
                      <TableCell>31/03/2026</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fire Safety Certificate</TableCell>
                      <TableCell>Infrastructure Compliance</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Expired</Badge>
                      </TableCell>
                      <TableCell>10/06/2024</TableCell>
                      <TableCell>10/01/2025</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 p-6 border rounded-md bg-gray-50">
                <h3 className="text-lg font-medium mb-4">Upload New Document</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="document-type">Document Type</Label>
                      <select 
                        id="document-type" 
                        className="w-full p-2 border rounded-md"
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
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document-description">Description</Label>
                    <Textarea 
                      id="document-description" 
                      placeholder="Enter additional details about this document"
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
                      />
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => document.getElementById('document-file')?.click()}
                      >
                        Select File
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleUpload}>Upload Document</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="verifications">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Verification Status</TableHead>
                      <TableHead>Verified By</TableHead>
                      <TableHead>Verification Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Hospital Registration Certificate</TableCell>
                      <TableCell>10/01/2025</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span>Verified</span>
                        </div>
                      </TableCell>
                      <TableCell>RI Medicare Admin</TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Medical License (Dr. Sharma)</TableCell>
                      <TableCell>02/04/2025</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span>Verified</span>
                        </div>
                      </TableCell>
                      <TableCell>RI Medicare Admin</TableCell>
                      <TableCell>05/04/2025</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fire Safety Certificate</TableCell>
                      <TableCell>12/01/2025</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                          <span>Rejected</span>
                        </div>
                      </TableCell>
                      <TableCell>RI Medicare Admin</TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="compliance">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Overall Compliance</p>
                      <p className="text-3xl font-bold">85%</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Legal Compliance</p>
                      <p className="text-3xl font-bold">100%</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Professional Compliance</p>
                      <p className="text-3xl font-bold">90%</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Infrastructure Compliance</p>
                      <p className="text-3xl font-bold">65%</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compliance Area</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Audit</TableHead>
                      <TableHead>Next Audit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Hospital Registration</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                      </TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell>15/01/2026</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Medical Staff Licensing</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                      </TableCell>
                      <TableCell>05/04/2025</TableCell>
                      <TableCell>05/04/2026</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fire Safety</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>
                      </TableCell>
                      <TableCell>10/01/2025</TableCell>
                      <TableCell>Immediate Action Required</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Biomedical Waste Management</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
                      </TableCell>
                      <TableCell>03/03/2025</TableCell>
                      <TableCell>03/06/2025</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="issues">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue ID</TableHead>
                      <TableHead>Compliance Area</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reported Date</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>ISS-1024</TableCell>
                      <TableCell>Fire Safety</TableCell>
                      <TableCell>Fire safety certificate expired</TableCell>
                      <TableCell>11/01/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>Open</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Address Issue</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ISS-1022</TableCell>
                      <TableCell>Biomedical Waste</TableCell>
                      <TableCell>Waste segregation audit findings</TableCell>
                      <TableCell>03/03/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>In Progress</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ISS-1018</TableCell>
                      <TableCell>Medical Staff</TableCell>
                      <TableCell>Two staff licenses need renewal</TableCell>
                      <TableCell>20/02/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>In Progress</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ISS-1015</TableCell>
                      <TableCell>Infrastructure</TableCell>
                      <TableCell>Elevator inspection due</TableCell>
                      <TableCell>15/02/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">Low</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>Scheduled</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceVerification;
