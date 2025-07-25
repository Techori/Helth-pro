
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Hospital, CreditCard, FileText, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://helth-pro.onrender.com/api'
  : 'http://localhost:4000/api';

const AdminDashboardOverview = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [systemData, setSystemData] = useState({
    totalUsers: 0,
    totalHospitals: 0,
    activeHealthCards: 0,
    activeLoans: 0,
    latestHospitals1: 0,
    latestHealthCards1: 0,
    latestPendingLoans: 0,
    lastMonthUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of activities per page

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/admin/overview-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch overview statistics");
      }

      const data = await response.json();
      setSystemData(data.systemData);
      console.log("System Data:", data.systemData);
      setMonthlyData(data.monthlyData);
      setRecentActivities(data.recentActivities);
      console.log("Recent Activities:", data.recentActivities);
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch overview statistics",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">{error}</p>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          onClick={fetchOverviewData}
        >
          Retry
        </button>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{systemData.totalUsers}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>{(systemData.lastMonthUsers)/100}% from last month</span>
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
              <span>{systemData.latestHospitals1.length} new this month</span>
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
              <span>{systemData.latestHealthCards1.length} new this month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Active health cards issued
            </p>
          </CardContent>
        </Card>

        {/* Loans Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.activeLoans}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>{systemData.latestPendingLoans.length} new this month</span>
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
          <div className="overflow-x-auto max-h-[400px]">
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
                {recentActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No recent activities found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActivities
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.id}</TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.type}</TableCell>
                        <TableCell className="max-w-xs truncate">{activity.description}</TableCell>
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
                    ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          {recentActivities.length > pageSize && (
            <div className="flex justify-end items-center mt-4 space-x-2">
              <button
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {Math.ceil(recentActivities.length / pageSize)}
              </span>
              <button
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(Math.ceil(recentActivities.length / pageSize), p + 1)
                  )
                }
                disabled={currentPage === Math.ceil(recentActivities.length / pageSize)}
              >
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
