
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Building2, Phone, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HospitalSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const hospitalTickets = [
    { 
      id: "HSP-1289", 
      hospital: "Apollo Hospital", 
      subject: "EMI processing delay", 
      status: "open", 
      priority: "high",
      date: "2025-05-06"
    },
    { 
      id: "HSP-1290", 
      hospital: "Medanta Hospital", 
      subject: "Portal login issues", 
      status: "pending", 
      priority: "medium",
      date: "2025-05-05" 
    },
    { 
      id: "HSP-1291", 
      hospital: "Max Healthcare", 
      subject: "Payment reconciliation", 
      status: "open", 
      priority: "high",
      date: "2025-05-06" 
    },
    { 
      id: "HSP-1292", 
      hospital: "Fortis Hospital", 
      subject: "API integration failure", 
      status: "closed", 
      priority: "low",
      date: "2025-05-03" 
    },
    { 
      id: "HSP-1293", 
      hospital: "Manipal Hospital", 
      subject: "User permission issues", 
      status: "open", 
      priority: "medium",
      date: "2025-05-04" 
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">This module is designed for managing hospital support inquiries, onboarding issues, and EMI processing concerns.</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by hospital name, ticket ID or subject..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="flex-shrink-0">New Ticket</Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Tickets</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {hospitalTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.hospital}
                          </h3>
                          <Badge variant={ticket.status === 'open' ? 'default' : ticket.status === 'pending' ? 'outline' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="text-xs font-medium" style={{ 
                            color: ticket.priority === 'high' ? '#ef4444' : 
                                  ticket.priority === 'medium' ? '#f59e0b' : 
                                  '#10b981'
                          }}>
                            {ticket.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Mail className="h-4 w-4 mr-1" /> Email
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
              {hospitalTickets.filter(t => t.status === 'open').map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Same card content as above */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.hospital}
                          </h3>
                          <Badge variant="default">
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="text-xs font-medium" style={{ 
                            color: ticket.priority === 'high' ? '#ef4444' : 
                                  ticket.priority === 'medium' ? '#f59e0b' : 
                                  '#10b981'
                          }}>
                            {ticket.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Mail className="h-4 w-4 mr-1" /> Email
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            {/* Similar content for pending and closed tabs */}
            <TabsContent value="pending" className="space-y-4">
              {hospitalTickets.filter(t => t.status === 'pending').map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card content for pending tickets */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.hospital}
                          </h3>
                          <Badge variant="outline">
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="text-xs font-medium" style={{ 
                            color: ticket.priority === 'high' ? '#ef4444' : 
                                  ticket.priority === 'medium' ? '#f59e0b' : 
                                  '#10b981'
                          }}>
                            {ticket.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Mail className="h-4 w-4 mr-1" /> Email
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="closed" className="space-y-4">
              {hospitalTickets.filter(t => t.status === 'closed').map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card content for closed tickets */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Building2 className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.hospital}
                          </h3>
                          <Badge variant="secondary">
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{ticket.subject}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="text-xs font-medium" style={{ 
                            color: ticket.priority === 'high' ? '#ef4444' : 
                                  ticket.priority === 'medium' ? '#f59e0b' : 
                                  '#10b981'
                          }}>
                            {ticket.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Phone className="h-4 w-4 mr-1" /> Call
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Mail className="h-4 w-4 mr-1" /> Email
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalSupport;
