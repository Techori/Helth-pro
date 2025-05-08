
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Download, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgentReferrals = () => {
  const { toast } = useToast();

  const handleAddReferral = () => {
    toast({
      title: "Add New Referral",
      description: "Creating a new referral entry form",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Referral Management</CardTitle>
              <CardDescription>Track and manage your patient and hospital referrals</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={handleAddReferral}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Referral
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Referrals</TabsTrigger>
              <TabsTrigger value="patient">Patient Referrals</TabsTrigger>
              <TabsTrigger value="hospital">Hospital Referrals</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referral ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Referred On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Conversion</TableHead>
                      <TableHead>Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>REF-001</TableCell>
                      <TableCell>Sanjay Mehta</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Platinum Health Card</TableCell>
                      <TableCell>Apr 02, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Converted</Badge>
                      </TableCell>
                      <TableCell>Apr 05, 2025</TableCell>
                      <TableCell>₹5,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>REF-002</TableCell>
                      <TableCell>LifeCare Hospital</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell>Hospital Onboarding</TableCell>
                      <TableCell>Apr 03, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">In Process</Badge>
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>Pending</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>REF-003</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Medical Loan</TableCell>
                      <TableCell>Apr 01, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Converted</Badge>
                      </TableCell>
                      <TableCell>Apr 04, 2025</TableCell>
                      <TableCell>₹7,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>REF-004</TableCell>
                      <TableCell>Vikrant Iyer</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Gold Health Card</TableCell>
                      <TableCell>Mar 30, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>₹0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>REF-005</TableCell>
                      <TableCell>SunHealth Clinic</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell>Hospital Onboarding</TableCell>
                      <TableCell>Mar 28, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Converted</Badge>
                      </TableCell>
                      <TableCell>Apr 01, 2025</TableCell>
                      <TableCell>₹15,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="patient">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referral ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Referred On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Conversion</TableHead>
                      <TableHead>Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>REF-001</TableCell>
                      <TableCell>Sanjay Mehta</TableCell>
                      <TableCell>Platinum Health Card</TableCell>
                      <TableCell>Apr 02, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Converted</Badge>
                      </TableCell>
                      <TableCell>Apr 05, 2025</TableCell>
                      <TableCell>₹5,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>REF-003</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>Medical Loan</TableCell>
                      <TableCell>Apr 01, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Converted</Badge>
                      </TableCell>
                      <TableCell>Apr 04, 2025</TableCell>
                      <TableCell>₹7,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>REF-004</TableCell>
                      <TableCell>Vikrant Iyer</TableCell>
                      <TableCell>Gold Health Card</TableCell>
                      <TableCell>Mar 30, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>₹0</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="hospital">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referral ID</TableHead>
                      <TableHead>Hospital Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Referred On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Conversion</TableHead>
                      <TableHead>Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>REF-002</TableCell>
                      <TableCell>LifeCare Hospital</TableCell>
                      <TableCell>Mumbai</TableCell>
                      <TableCell>Apr 03, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">In Process</Badge>
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>Pending</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>REF-005</TableCell>
                      <TableCell>SunHealth Clinic</TableCell>
                      <TableCell>Pune</TableCell>
                      <TableCell>Mar 28, 2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Converted</Badge>
                      </TableCell>
                      <TableCell>Apr 01, 2025</TableCell>
                      <TableCell>₹15,000</TableCell>
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

export default AgentReferrals;
