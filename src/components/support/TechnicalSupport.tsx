
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Cpu, Calendar, Clock, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const TechnicalSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const techTickets = [
    { 
      id: "TCH-1091", 
      name: "Payment Gateway Error",
      component: "Payment System",
      status: "critical", 
      progress: 20,
      date: "2025-05-06T10:30:00",
      assignee: "Vikram Singh"
    },
    { 
      id: "TCH-1092", 
      name: "Dashboard Loading Issue",
      component: "Frontend",
      status: "high", 
      progress: 45,
      date: "2025-05-06T09:15:00",
      assignee: "Neha Patel"
    },
    { 
      id: "TCH-1093", 
      name: "API Timeout Error",
      component: "Backend",
      status: "medium", 
      progress: 70,
      date: "2025-05-05T16:20:00",
      assignee: "Arjun Kumar"
    },
    { 
      id: "TCH-1094", 
      name: "Authentication Failure",
      component: "Security",
      status: "critical", 
      progress: 10,
      date: "2025-05-06T08:45:00",
      assignee: "Priya Sharma"
    },
    { 
      id: "TCH-1095", 
      name: "EMI Calculation Bug",
      component: "Core Logic",
      status: "low", 
      progress: 90,
      date: "2025-05-04T14:30:00",
      assignee: "Rahul Dev"
    }
  ];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">This module handles technical issues related to the platform functionality, payment processes, and system errors for all users.</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by issue name or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="flex-shrink-0">New Issue</Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Issues</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="high">High</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="low">Low</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {techTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Cpu className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {ticket.name}
                            </h3>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`}></div>
                            <Badge variant={
                              ticket.status === 'critical' ? 'destructive' : 
                              ticket.status === 'high' ? 'outline' : 
                              ticket.status === 'medium' ? 'secondary' : 'default'
                            }>
                              {ticket.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {ticket.component}
                            </span>
                            <span className="flex items-center text-xs text-gray-500">
                              <Tag className="h-3 w-3 mr-1" />
                              {ticket.id}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-auto">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="default" size="sm">
                          Assign
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
                      <div className="w-full md:w-3/4 flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-medium">{ticket.progress}%</span>
                        </div>
                        <Progress value={ticket.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center mt-3 md:mt-0 md:ml-6 text-sm">
                        <span className="flex items-center text-xs text-gray-500 mr-4">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(ticket.date)}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {ticket.assignee}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Similar content for critical, high, medium, and low tabs */}
            <TabsContent value="critical" className="space-y-4">
              {techTickets.filter(t => t.status === 'critical').map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card content for critical issues */}
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Cpu className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {ticket.name}
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <Badge variant="destructive">
                              {ticket.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {ticket.component}
                            </span>
                            <span className="flex items-center text-xs text-gray-500">
                              <Tag className="h-3 w-3 mr-1" />
                              {ticket.id}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-auto">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="default" size="sm">
                          Assign
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
                      <div className="w-full md:w-3/4 flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-medium">{ticket.progress}%</span>
                        </div>
                        <Progress value={ticket.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center mt-3 md:mt-0 md:ml-6 text-sm">
                        <span className="flex items-center text-xs text-gray-500 mr-4">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(ticket.date)}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {ticket.assignee}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
            
            {/* Additional tabs for other priority levels would follow the same pattern */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalSupport;
