
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSupportTickets } from '@/services/dashboardService';

const SupportReports = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    ticketVolume: [],
    responseTime: [],
    resolutionRate: [],
    ticketsByCategory: [],
    ticketsByPriority: []
  });

  useEffect(() => {
    const loadReportData = async () => {
      setIsLoading(true);
      try {
        // Fetch actual data from API
        const supportData = await fetchSupportTickets();
        
        // Format data for charts
        // In a real app, this would come from the API
        setReportData({
          ticketVolume: [
            { name: 'Jan', tickets: 65 },
            { name: 'Feb', tickets: 78 },
            { name: 'Mar', tickets: 82 },
            { name: 'Apr', tickets: 70 },
            { name: 'May', tickets: 85 },
            { name: 'Jun', tickets: 90 }
          ],
          responseTime: [
            { name: 'Jan', time: 120 },
            { name: 'Feb', time: 100 },
            { name: 'Mar', time: 140 },
            { name: 'Apr', time: 90 },
            { name: 'May', time: 110 },
            { name: 'Jun', time: 80 }
          ],
          resolutionRate: [
            { name: 'Jan', rate: 75 },
            { name: 'Feb', rate: 82 },
            { name: 'Mar', rate: 78 },
            { name: 'Apr', rate: 85 },
            { name: 'May', rate: 88 },
            { name: 'Jun', rate: 92 }
          ],
          ticketsByCategory: [
            { name: 'Technical', value: 40 },
            { name: 'Billing', value: 25 },
            { name: 'Account', value: 15 },
            { name: 'Health Card', value: 20 }
          ],
          ticketsByPriority: [
            { name: 'Low', value: 30 },
            { name: 'Medium', value: 45 },
            { name: 'High', value: 25 }
          ]
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Reports & Analytics</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white border overflow-x-auto w-full flex md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="customer">Customer Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="text-2xl font-bold">843</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="text-2xl font-bold">57</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">-3% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="text-2xl font-bold">1.8h</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">-32min from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="text-2xl font-bold">93%</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Ticket Volume Over Time</CardTitle>
                <CardDescription>Monthly ticket submission trends</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.ticketVolume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="tickets" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Ticket distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.ticketsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.ticketsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
              <CardDescription>Average response time in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.responseTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="time" fill="#82ca9d" name="Minutes" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          {/* Additional ticket analysis content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Analysis Content</CardTitle>
              <CardDescription>Detailed breakdown of support tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p>Ticket analysis details would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance metrics content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Support team performance analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p>Performance data would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          {/* Customer satisfaction content would go here */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
              <CardDescription>Feedback and satisfaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p>Customer satisfaction data would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportReports;
