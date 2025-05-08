
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Download, Filter, BarChart } from "lucide-react";

const CommissionManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Commission Management</CardTitle>
              <CardDescription>Track and manage your commission earnings</CardDescription>
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
              <Button>
                <BarChart className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold">₹1,85,450</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>+15% from last month</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">This Quarter</p>
                  <p className="text-3xl font-bold">₹5,42,800</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>+8% from last quarter</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Year to Date</p>
                  <p className="text-3xl font-bold">₹18,75,600</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>+22% from last year</span>
              </div>
            </Card>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Apr 05, 2025</TableCell>
                  <TableCell>RIMC-5729</TableCell>
                  <TableCell>Platinum Health Card</TableCell>
                  <TableCell>Vikram Hospitals</TableCell>
                  <TableCell>₹50,000</TableCell>
                  <TableCell>₹5,000</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 04, 2025</TableCell>
                  <TableCell>RIMC-5712</TableCell>
                  <TableCell>Medical Loan</TableCell>
                  <TableCell>City General Hospital</TableCell>
                  <TableCell>₹2,50,000</TableCell>
                  <TableCell>₹12,500</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 03, 2025</TableCell>
                  <TableCell>RIMC-5698</TableCell>
                  <TableCell>Gold Health Card</TableCell>
                  <TableCell>MedPlus Hospital</TableCell>
                  <TableCell>₹25,000</TableCell>
                  <TableCell>₹2,500</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 02, 2025</TableCell>
                  <TableCell>RIMC-5685</TableCell>
                  <TableCell>Silver Health Card</TableCell>
                  <TableCell>LifeCare Hospital</TableCell>
                  <TableCell>₹15,000</TableCell>
                  <TableCell>₹1,500</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 01, 2025</TableCell>
                  <TableCell>RIMC-5672</TableCell>
                  <TableCell>Medical Loan</TableCell>
                  <TableCell>Apollo Hospitals</TableCell>
                  <TableCell>₹3,50,000</TableCell>
                  <TableCell>₹17,500</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
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

export default CommissionManagement;
