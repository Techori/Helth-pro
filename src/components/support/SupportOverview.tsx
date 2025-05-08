
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  FileCheck, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";

const ticketData = [
  { name: 'Mon', Patient: 4, Hospital: 3, Onboarding: 2, Technical: 1, KYC: 2 },
  { name: 'Tue', Patient: 3, Hospital: 4, Onboarding: 1, Technical: 2, KYC: 3 },
  { name: 'Wed', Patient: 5, Hospital: 2, Onboarding: 3, Technical: 3, KYC: 1 },
  { name: 'Thu', Patient: 6, Hospital: 4, Onboarding: 1, Technical: 1, KYC: 4 },
  { name: 'Fri', Patient: 4, Hospital: 5, Onboarding: 2, Technical: 2, KYC: 3 },
  { name: 'Sat', Patient: 2, Hospital: 1, Onboarding: 1, Technical: 0, KYC: 1 },
  { name: 'Sun', Patient: 1, Hospital: 0, Onboarding: 0, Technical: 0, KYC: 0 },
];

const statusData = [
  { name: 'New', value: 15, color: '#ff8a65' },
  { name: 'In Progress', value: 20, color: '#4dabf7' },
  { name: 'Pending', value: 8, color: '#ffd43b' },
  { name: 'Resolved', value: 32, color: '#69db7c' },
];

const recentTickets = [
  {
    id: 'TKT-1289',
    type: 'Patient',
    issue: 'Unable to access patient dashboard',
    status: 'New',
    time: '10 minutes ago',
    priority: 'High'
  },
  {
    id: 'TKT-1288',
    type: 'Hospital',
    issue: 'EMI collection process clarification',
    status: 'In Progress',
    time: '1 hour ago',
    priority: 'Medium'
  },
  {
    id: 'TKT-1287',
    type: 'KYC',
    issue: 'Document verification failed',
    status: 'Pending',
    time: '3 hours ago',
    priority: 'High'
  },
  {
    id: 'TKT-1286',
    type: 'Onboarding',
    issue: 'Hospital registration issue',
    status: 'Resolved',
    time: '1 day ago',
    priority: 'Medium'
  },
  {
    id: 'TKT-1285',
    type: 'Technical',
    issue: 'Payment gateway integration error',
    status: 'In Progress',
    time: '1 day ago',
    priority: 'Critical'
  }
];

const SupportOverview = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-orange-100 text-orange-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
        <Card className={`transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 hrs</div>
            <p className="text-xs text-muted-foreground">-15% from last week</p>
          </CardContent>
        </Card>
        <Card className={`transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card className={`transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 transition-all duration-500 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader>
            <CardTitle>Support Ticket Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ticketData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Patient" stackId="a" fill="#8884d8" />
                  <Bar dataKey="Hospital" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="Onboarding" stackId="a" fill="#ffc658" />
                  <Bar dataKey="Technical" stackId="a" fill="#ff8042" />
                  <Bar dataKey="KYC" stackId="a" fill="#0088fe" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={`transition-all duration-500 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader>
            <CardTitle>Ticket Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={`transition-all duration-500 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Support Tickets</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm">Ticket ID</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Issue</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Time</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{ticket.id}</td>
                    <td className="py-3 px-4 text-sm">{ticket.type}</td>
                    <td className="py-3 px-4 text-sm">{ticket.issue}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(ticket.status))}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getPriorityColor(ticket.priority))}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{ticket.time}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportOverview;
