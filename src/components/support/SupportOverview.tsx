
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchSupportTickets } from '@/services/dashboardService';

type SupportOverviewProps = {
  isLoading?: boolean;
};

const SupportOverview = ({ isLoading = false }: SupportOverviewProps) => {
  const [ticketsData, setTicketsData] = useState<any>({
    tickets: [],
    statistics: {
      total: 0,
      open: 0,
      closed: 0,
      avgResponseTime: '0h'
    }
  });

  useEffect(() => {
    const loadTicketsData = async () => {
      try {
        // Fetch real data in production
        const data = await fetchSupportTickets();
        
        // For demo, use this mock data if API is not available
        if (!data.tickets || !data.tickets.length) {
          setTicketsData({
            statistics: {
              total: 157,
              open: 34,
              closed: 123,
              avgResponseTime: '1.4h'
            },
            tickets: [
              { id: 'ST-001', subject: 'Unable to login to dashboard', status: 'open', priority: 'high', category: 'Technical', createdAt: '2023-05-10T09:30:00', customerName: 'John Doe' },
              { id: 'ST-002', subject: 'Health card activation issue', status: 'open', priority: 'medium', category: 'Health Card', createdAt: '2023-05-10T10:15:00', customerName: 'Jane Smith' },
              { id: 'ST-003', subject: 'Payment not reflecting in account', status: 'open', priority: 'high', category: 'Billing', createdAt: '2023-05-10T11:00:00', customerName: 'Robert Johnson' },
              { id: 'ST-004', subject: 'Need help with insurance claim', status: 'open', priority: 'medium', category: 'Insurance', createdAt: '2023-05-10T13:45:00', customerName: 'Sarah Williams' },
              { id: 'ST-005', subject: 'App crashing on Android device', status: 'open', priority: 'low', category: 'Technical', createdAt: '2023-05-11T09:20:00', customerName: 'Michael Brown' }
            ]
          });
        } else {
          setTicketsData(data);
        }
      } catch (error) {
        console.error("Error loading tickets data:", error);
      }
    };
    
    if (!isLoading) {
      loadTicketsData();
    }
  }, [isLoading]);

  const ticketVolumeData = [
    { name: 'Mon', tickets: 24 },
    { name: 'Tue', tickets: 18 },
    { name: 'Wed', tickets: 32 },
    { name: 'Thu', tickets: 27 },
    { name: 'Fri', tickets: 21 },
    { name: 'Sat', tickets: 15 },
    { name: 'Sun', tickets: 12 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-2xl font-bold">{ticketsData.statistics.total}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
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
              <div className="text-2xl font-bold">{ticketsData.statistics.open}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Closed Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <div className="text-2xl font-bold">{ticketsData.statistics.closed}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
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
              <div className="text-2xl font-bold">{ticketsData.statistics.avgResponseTime}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Ticket Volume (Last 7 Days)</CardTitle>
            <CardDescription>Daily number of new support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ticketVolumeData}>
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest support team activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Ananya closed ticket ST-095</p>
                    <p className="text-xs text-muted-foreground">12 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>TS</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Rahul assigned ticket ST-102 to Priya</p>
                    <p className="text-xs text-muted-foreground">43 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Priya replied to ticket ST-098</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Support Tickets</CardTitle>
              <CardDescription>Showing the latest open support tickets</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-2 text-left text-sm font-medium">ID</th>
                    <th className="py-3 px-2 text-left text-sm font-medium">Subject</th>
                    <th className="py-3 px-2 text-left text-sm font-medium">Status</th>
                    <th className="py-3 px-2 text-left text-sm font-medium">Priority</th>
                    <th className="py-3 px-2 text-left text-sm font-medium">Category</th>
                    <th className="py-3 px-2 text-left text-sm font-medium">Customer</th>
                    <th className="py-3 px-2 text-left text-sm font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsData.tickets.map((ticket: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 text-sm">{ticket.id}</td>
                      <td className="py-3 px-2 text-sm">{ticket.subject}</td>
                      <td className="py-3 px-2">
                        <Badge variant={ticket.status === 'open' ? 'default' : 'outline'}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={
                          ticket.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' : 
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                          'bg-green-100 text-green-800 border-green-300'
                        }>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">{ticket.category}</td>
                      <td className="py-3 px-2 text-sm">{ticket.customerName}</td>
                      <td className="py-3 px-2 text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">View All Tickets</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupportOverview;
