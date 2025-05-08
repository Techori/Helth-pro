
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Download, Filter, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AgentManagement = () => {
  const { toast } = useToast();

  const handleAddAgent = () => {
    toast({
      title: "Add New Agent/DSA",
      description: "Creating a new agent registration form",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Agent/DSA Management</CardTitle>
              <CardDescription>Manage and track your referral agents and DSAs</CardDescription>
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
              <Button onClick={handleAddAgent}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Agent/DSA
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                  <p className="text-3xl font-bold">156</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>+15% from last month</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                  <p className="text-3xl font-bold">124</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>79% active rate</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Commission Paid</p>
                  <p className="text-3xl font-bold">₹14.6L</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>₹93,500 per agent avg.</span>
              </div>
            </Card>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>AGT-001</TableCell>
                  <TableCell>Rahul Sharma</TableCell>
                  <TableCell>+91 98765 43210</TableCell>
                  <TableCell>Mumbai</TableCell>
                  <TableCell>45</TableCell>
                  <TableCell>78%</TableCell>
                  <TableCell>₹2,34,500</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AGT-002</TableCell>
                  <TableCell>Priya Patel</TableCell>
                  <TableCell>+91 87654 32109</TableCell>
                  <TableCell>Delhi</TableCell>
                  <TableCell>32</TableCell>
                  <TableCell>65%</TableCell>
                  <TableCell>₹1,56,000</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AGT-003</TableCell>
                  <TableCell>Sanjay Kumar</TableCell>
                  <TableCell>+91 76543 21098</TableCell>
                  <TableCell>Bangalore</TableCell>
                  <TableCell>28</TableCell>
                  <TableCell>71%</TableCell>
                  <TableCell>₹1,42,000</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AGT-004</TableCell>
                  <TableCell>Anita Desai</TableCell>
                  <TableCell>+91 65432 10987</TableCell>
                  <TableCell>Chennai</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>50%</TableCell>
                  <TableCell>₹85,000</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">Probation</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AGT-005</TableCell>
                  <TableCell>Vikram Singh</TableCell>
                  <TableCell>+91 54321 09876</TableCell>
                  <TableCell>Kolkata</TableCell>
                  <TableCell>21</TableCell>
                  <TableCell>62%</TableCell>
                  <TableCell>₹1,05,000</TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentManagement;
