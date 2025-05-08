
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, Filter } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import ReportCard from "../reports/ReportCard";

const commissionBreakdownData = [
  { category: 'Health Cards', amount: 95000 },
  { category: 'Medical Loans', amount: 85000 },
  { category: 'Hospital Referrals', amount: 45000 },
  { category: 'Bonuses', amount: 9500 },
];

const AgentCommissions = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Commission Management</CardTitle>
              <CardDescription>Track your earnings and payment history</CardDescription>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-3xl font-bold">₹2,34,500</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <span>+15% from last month</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                  <p className="text-3xl font-bold">₹35,000</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span>To be credited by 10th</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Highest Commission</p>
                  <p className="text-3xl font-bold">₹15,000</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600">
                <span>Hospital Referral</span>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ReportCard title="Commission Breakdown" description="By product category">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={commissionBreakdownData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="amount" name="Commission Amount (₹)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ReportCard>
            
            <Card>
              <CardHeader>
                <CardTitle>Commission Structure</CardTitle>
                <CardDescription>Your current commission rates</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Commission Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Bronze Health Card</TableCell>
                        <TableCell>5% of card value</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Silver Health Card</TableCell>
                        <TableCell>7% of card value</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gold Health Card</TableCell>
                        <TableCell>10% of card value</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Platinum Health Card</TableCell>
                        <TableCell>12% of card value</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Medical Loan</TableCell>
                        <TableCell>0.5% of loan amount</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hospital Onboarding</TableCell>
                        <TableCell>₹15,000 per hospital</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>TRX-001</TableCell>
                  <TableCell>Apr 05, 2025</TableCell>
                  <TableCell>Commission from Sanjay Mehta (Platinum Card)</TableCell>
                  <TableCell>₹5,000</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRX-002</TableCell>
                  <TableCell>Apr 04, 2025</TableCell>
                  <TableCell>Commission from Priya Patel (Medical Loan)</TableCell>
                  <TableCell>₹7,500</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRX-003</TableCell>
                  <TableCell>Apr 01, 2025</TableCell>
                  <TableCell>Commission from SunHealth Clinic (Onboarding)</TableCell>
                  <TableCell>₹15,000</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRX-004</TableCell>
                  <TableCell>Apr 10, 2025</TableCell>
                  <TableCell>Commission from LifeCare Hospital (Onboarding)</TableCell>
                  <TableCell>₹15,000</TableCell>
                  <TableCell>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TRX-005</TableCell>
                  <TableCell>Apr 12, 2025</TableCell>
                  <TableCell>Commission from Referral Bonus</TableCell>
                  <TableCell>₹5,000</TableCell>
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

export default AgentCommissions;
