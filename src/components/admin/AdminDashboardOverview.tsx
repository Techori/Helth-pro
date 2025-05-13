
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Hospital, CreditCard, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";

const AdminDashboardOverview = () => {
  // Mock data - would come from API in real implementation
  const systemData = {
    totalUsers: 1280,
    totalHospitals: 42,
    activeHealthCards: 980,
    activeLoans: 320,
  };

  const recentActivities = [
    { id: "ACT123456", date: "2023-11-20", type: "User Registration", description: "New patient registered", status: "Completed" },
    { id: "ACT123457", date: "2023-11-20", type: "Hospital Onboarding", description: "New hospital added to network", status: "Pending Review" },
    { id: "ACT123458", date: "2023-11-19", type: "Loan Approval", description: "Medical loan approved", status: "Completed" },
    { id: "ACT123459", date: "2023-11-19", type: "Health Card Issuance", description: "New health card issued", status: "Completed" },
    { id: "ACT123460", date: "2023-11-18", type: "Loan Application", description: "New loan application received", status: "Under Review" },
  ];
  
  // Monthly data for charts
  const monthlyData = [
    { month: "Jan", users: 850, loans: 210 },
    { month: "Feb", users: 880, loans: 230 },
    { month: "Mar", users: 910, loans: 240 },
    { month: "Apr", users: 940, loans: 250 },
    { month: "May", users: 980, loans: 260 },
    { month: "Jun", users: 1020, loans: 270 },
    { month: "Jul", users: 1050, loans: 280 },
    { month: "Aug", users: 1090, loans: 290 },
    { month: "Sep", users: 1150, loans: 300 },
    { month: "Oct", users: 1220, loans: 310 },
    { month: "Nov", users: 1280, loans: 320 },
  ];

  const chartConfig = {
    users: {
      label: "Registered Users",
      theme: {
        light: "#8B5CF6",
        dark: "#6366f1"
      },
    },
    loans: {
      label: "Active Loans",
      theme: {
        light: "#16a34a",
        dark: "#22c55e"
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.totalUsers.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>5% from last month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Registered patients and hospitals
            </p>
          </CardContent>
        </Card>

        {/* Hospitals Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hospitals</CardTitle>
            <Hospital className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.totalHospitals}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>2 new this month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Onboarded healthcare providers
            </p>
          </CardContent>
        </Card>

        {/* Health Cards Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.activeHealthCards}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>30 new this month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Active health cards issued
            </p>
          </CardContent>
        </Card>

        {/* Loans Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.activeLoans}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>10 new this month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Loans with pending repayments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Users Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Registered users over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="users" name="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
                    <ChartTooltip>
                      <ChartTooltipContent />
                    </ChartTooltip>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartContainer config={chartConfig}>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Loans Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Loan Growth</CardTitle>
            <CardDescription>
              Active loans over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="loans" name="loans" stroke="var(--color-loans)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartContainer config={chartConfig}>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest system activities and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.id}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>{activity.description}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : activity.status === 'Under Review' || activity.status === 'Pending Review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
