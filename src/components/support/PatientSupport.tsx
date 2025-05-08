
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const patientTickets = [
  {
    id: 'TKT-1289',
    patientId: 'PAT-5678',
    patientName: 'Rahul Sharma',
    issue: 'Unable to access patient dashboard',
    status: 'New',
    time: '10 minutes ago',
    priority: 'High',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210'
  },
  {
    id: 'TKT-1283',
    patientId: 'PAT-3456',
    patientName: 'Priya Patel',
    issue: 'Payment receipt not generated',
    status: 'In Progress',
    time: '1 hour ago',
    priority: 'Medium',
    email: 'priya.patel@example.com',
    phone: '+91 8765432109'
  },
  {
    id: 'TKT-1278',
    patientId: 'PAT-7890',
    patientName: 'Amit Kumar',
    issue: 'EMI payment confirmation pending',
    status: 'Pending',
    time: '3 hours ago',
    priority: 'Medium',
    email: 'amit.kumar@example.com',
    phone: '+91 7654321098'
  },
  {
    id: 'TKT-1275',
    patientId: 'PAT-2345',
    patientName: 'Neha Singh',
    issue: 'Account recovery request',
    status: 'New',
    time: '5 hours ago',
    priority: 'High',
    email: 'neha.singh@example.com',
    phone: '+91 6543210987'
  },
  {
    id: 'TKT-1268',
    patientId: 'PAT-8901',
    patientName: 'Rajesh Verma',
    issue: 'KYC document rejection issue',
    status: 'Resolved',
    time: '1 day ago',
    priority: 'Medium',
    email: 'rajesh.verma@example.com',
    phone: '+91 5432109876'
  }
];

const PatientSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingPatient, setViewingPatient] = useState<any | null>(null);

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

  const filteredTickets = patientTickets.filter(ticket => 
    ticket.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewPatientDetails = (patient: any) => {
    setViewingPatient(patient);
  };

  return (
    <div className="space-y-6">
      {viewingPatient ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => setViewingPatient(null)}
            >
              Back to Tickets
            </Button>
            <h2 className="text-2xl font-bold">Patient Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Name</h3>
                    <p>{viewingPatient.patientName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Patient ID</h3>
                    <p>{viewingPatient.patientId}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Email</h3>
                    <p>{viewingPatient.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Phone</h3>
                    <p>{viewingPatient.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Current Balance</h3>
                      <p className="text-2xl font-bold">₹10,500</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Available Credit</h3>
                      <p className="text-2xl font-bold">₹50,000</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">KYC Status</h3>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm mt-1">Verified</span>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium">Transaction History</h3>
                    <div className="mt-2 border rounded-md">
                      <div className="p-3 border-b flex justify-between items-center">
                        <div>
                          <p className="font-medium">Hospital Payment</p>
                          <p className="text-sm text-gray-500">Apollo Hospital</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">-₹5,000</p>
                          <p className="text-xs text-gray-500">May 5, 2025</p>
                        </div>
                      </div>
                      <div className="p-3 border-b flex justify-between items-center">
                        <div>
                          <p className="font-medium">EMI Payment</p>
                          <p className="text-sm text-gray-500">Monthly Installment</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+₹2,500</p>
                          <p className="text-xs text-gray-500">May 1, 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Support Ticket - {viewingPatient.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Issue</h3>
                    <p>{viewingPatient.issue}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Status</h3>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium mt-1 inline-block", getStatusColor(viewingPatient.status))}>
                        {viewingPatient.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Priority</h3>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium mt-1 inline-block", getPriorityColor(viewingPatient.priority))}>
                        {viewingPatient.priority}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500">Created</h3>
                      <p className="text-sm mt-1">{viewingPatient.time}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium">Communication</h3>
                    <div className="mt-2 space-y-4">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0">
                          <img 
                            src="https://github.com/shadcn.png" 
                            alt="Support" 
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg max-w-3xl">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Support Agent</span>
                            <span className="text-xs text-gray-500">10:35 AM</span>
                          </div>
                          <p className="text-sm">Hello, how can I help you with your dashboard access issue today?</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 justify-end">
                        <div className="bg-brand-100 p-3 rounded-lg max-w-3xl">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{viewingPatient.patientName}</span>
                            <span className="text-xs text-gray-500">10:40 AM</span>
                          </div>
                          <p className="text-sm">I'm trying to log in but keep getting an error message saying my account is locked.</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-brand-200 shrink-0 flex items-center justify-center text-brand-700 font-bold">
                          {viewingPatient.patientName.charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <Input placeholder="Type your message..." className="flex-1" />
                      <Button>Send</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Patient Support Tickets</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search tickets..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Tickets</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Ticket ID</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Patient</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Issue</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Priority</th>
                          <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((ticket) => (
                          <tr key={ticket.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-sm font-medium">{ticket.id}</td>
                            <td className="py-3 px-4 text-sm">
                              <div>
                                <p className="font-medium">{ticket.patientName}</p>
                                <p className="text-xs text-gray-500">{ticket.patientId}</p>
                              </div>
                            </td>
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
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => viewPatientDetails(ticket)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="new">
                  <div className="p-4 text-center text-gray-500">
                    <p>Filtered view for new tickets will appear here.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="in-progress">
                  <div className="p-4 text-center text-gray-500">
                    <p>Filtered view for in-progress tickets will appear here.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="pending">
                  <div className="p-4 text-center text-gray-500">
                    <p>Filtered view for pending tickets will appear here.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="resolved">
                  <div className="p-4 text-center text-gray-500">
                    <p>Filtered view for resolved tickets will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PatientSupport;
