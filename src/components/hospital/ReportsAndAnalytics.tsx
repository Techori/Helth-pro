
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Download, FileText, BarChart as BarChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ReportsAndAnalytics = () => {
  const [reportType, setReportType] = useState("daily");
  const [reportPeriod, setReportPeriod] = useState("current-week");

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `Your ${reportType} report has been generated successfully.`,
    });
  };

  // Sample data for charts
  const barChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Payments Received',
        data: [65000, 59000, 80000, 81000, 56000, 40000, 30000],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
      {
        label: 'Platform Fees',
        data: [3250, 2950, 4000, 4050, 2800, 2000, 1500],
        backgroundColor: 'rgba(244, 114, 182, 0.6)',
        borderColor: 'rgb(244, 114, 182)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Health Card Payments',
        data: [240000, 320000, 380000, 420000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Loan Applications',
        data: [150000, 220000, 185000, 290000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const pieChartData = {
    labels: ['Health Card Payments', 'Cash Payments', 'Loan-based Treatments', 'Insurance'],
    datasets: [
      {
        label: 'Revenue Sources',
        data: [45, 15, 25, 15],
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)',
          'rgba(244, 114, 182, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(251, 191, 36, 0.6)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(244, 114, 182)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample financial data for reports
  const recentTransactions = [
    {
      id: 'TX12345',
      date: '22/11/2023',
      amount: 15000,
      patientName: 'Rahul Sharma',
      paymentType: 'Health Card',
      platformFee: 750,
      status: 'Completed'
    },
    {
      id: 'TX12346',
      date: '22/11/2023',
      amount: 25000,
      patientName: 'Priya Patel',
      paymentType: 'Loan',
      platformFee: 1250,
      status: 'Completed'
    },
    {
      id: 'TX12347',
      date: '21/11/2023',
      amount: 8500,
      patientName: 'Amit Singh',
      paymentType: 'Health Card',
      platformFee: 425,
      status: 'Completed'
    },
    {
      id: 'TX12348',
      date: '21/11/2023',
      amount: 35000,
      patientName: 'Deepika Mehta',
      paymentType: 'Loan',
      platformFee: 1750,
      status: 'Completed'
    },
    {
      id: 'TX12349',
      date: '20/11/2023',
      amount: 5000,
      patientName: 'Rajiv Kumar',
      paymentType: 'Health Card',
      platformFee: 250,
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial Reports & Analytics</CardTitle>
              <CardDescription>Generate and view hospital financial reports</CardDescription>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Revenue</CardTitle>
                <CardDescription>Current Month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹11,45,000</div>
                <p className="text-sm text-green-600 mt-1">↑ 12.5% vs last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Platform Fees</CardTitle>
                <CardDescription>Current Month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹57,250</div>
                <p className="text-sm text-amber-600 mt-1">5% of total revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Health Card Usage</CardTitle>
                <CardDescription>Current Month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">248</div>
                <p className="text-sm text-green-600 mt-1">↑ 18.2% vs last month</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Financial Trends</h3>
                <Select defaultValue="current-week">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-week">Current Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-quarter">Current Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Tabs defaultValue="daily">
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="h-[300px] mt-2">
                  <BarChart data={barChartData} />
                </TabsContent>
                <TabsContent value="weekly" className="h-[300px] mt-2">
                  <LineChart data={lineChartData} />
                </TabsContent>
                <TabsContent value="monthly" className="h-[300px] mt-2">
                  <LineChart data={lineChartData} />
                </TabsContent>
              </Tabs>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[240px]">
                <PieChart data={pieChartData} />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Generate Reports</h3>
              <div className="flex gap-2">
                <Select 
                  value={reportType} 
                  onValueChange={setReportType}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={reportPeriod} 
                  onValueChange={setReportPeriod}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-week">Current Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="custom-range">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleGenerateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 font-medium flex items-center justify-between">
                <div>Recent Transactions</div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform Fee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{tx.id}</td>
                      <td className="px-4 py-3 text-sm">{tx.date}</td>
                      <td className="px-4 py-3 text-sm">{tx.patientName}</td>
                      <td className="px-4 py-3 text-sm">{tx.paymentType}</td>
                      <td className="px-4 py-3 text-sm">₹{tx.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">₹{tx.platformFee.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div>Showing last 5 transactions</div>
            <Button variant="outline" size="sm">View All Transactions</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportsAndAnalytics;
