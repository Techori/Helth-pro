
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, FileCheck, Clock, AlertCircle, CheckCircle, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const KycSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const kycTickets = [
    { 
      id: "KYC-2421", 
      name: "Rajat Sharma",
      type: "Patient",
      issue: "Address verification failed",
      status: "pending", 
      date: "2025-05-06"
    },
    { 
      id: "KYC-2422", 
      name: "City Hospital",
      type: "Hospital",
      issue: "Document mismatch",
      status: "rejected", 
      date: "2025-05-05"
    },
    { 
      id: "KYC-2423", 
      name: "Anil Kumar",
      type: "Patient",
      issue: "ID verification pending",
      status: "pending", 
      date: "2025-05-06"
    },
    { 
      id: "KYC-2424", 
      name: "Medicare Clinic",
      type: "Hospital",
      issue: "Registration document expired",
      status: "rejected", 
      date: "2025-05-03"
    },
    { 
      id: "KYC-2425", 
      name: "Priya Shah",
      type: "Patient",
      issue: "Pan card verification",
      status: "verified", 
      date: "2025-05-04"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">This module helps with KYC verification issues, document validation, and identity verification processes for both patients and hospitals.</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by name, ID or issue type..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="flex-shrink-0">New Verification</Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {kycTickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FileCheck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.name}
                          </h3>
                          <Badge variant={
                            ticket.status === 'pending' ? 'outline' : 
                            ticket.status === 'rejected' ? 'destructive' : 'default'
                          }>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(ticket.status)}
                              {ticket.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            {ticket.type}
                          </span>
                          <p className="text-sm text-gray-600">{ticket.issue}</p>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="flex items-center text-xs text-gray-500 ml-4">
                            <User className="h-3 w-3 mr-1" />
                            ID: {ticket.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="outline" size="sm">
                        View Documents
                      </Button>
                      <Button variant={ticket.status === 'verified' ? 'secondary' : 'default'} size="sm">
                        {ticket.status === 'verified' ? 'Review Verification' : 'Verify Now'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {kycTickets.filter(t => t.status === 'pending').map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card content for pending tickets */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FileCheck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.name}
                          </h3>
                          <Badge variant="outline">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-amber-500" />
                              {ticket.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            {ticket.type}
                          </span>
                          <p className="text-sm text-gray-600">{ticket.issue}</p>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="flex items-center text-xs text-gray-500 ml-4">
                            <User className="h-3 w-3 mr-1" />
                            ID: {ticket.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="outline" size="sm">
                        View Documents
                      </Button>
                      <Button size="sm">
                        Verify Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {kycTickets.filter(t => t.status === 'rejected').map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card content for rejected tickets */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FileCheck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.name}
                          </h3>
                          <Badge variant="destructive">
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {ticket.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            {ticket.type}
                          </span>
                          <p className="text-sm text-gray-600">{ticket.issue}</p>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="flex items-center text-xs text-gray-500 ml-4">
                            <User className="h-3 w-3 mr-1" />
                            ID: {ticket.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="outline" size="sm">
                        View Documents
                      </Button>
                      <Button size="sm">
                        Request New Documents
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="verified" className="space-y-4">
              {kycTickets.filter(t => t.status === 'verified').map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {/* Card content for verified tickets */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FileCheck className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {ticket.name}
                          </h3>
                          <Badge>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              {ticket.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                            {ticket.type}
                          </span>
                          <p className="text-sm text-gray-600">{ticket.issue}</p>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {ticket.date}
                          </span>
                          <span className="flex items-center text-xs text-gray-500 ml-4">
                            <User className="h-3 w-3 mr-1" />
                            ID: {ticket.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="outline" size="sm">
                        View Documents
                      </Button>
                      <Button variant="secondary" size="sm">
                        Review Verification
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

export default KycSupport;
