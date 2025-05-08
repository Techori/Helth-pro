
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, CircleDollarSign, Calendar, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const RecoveryDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const recoveryTickets = [
    { 
      id: "REC-2901", 
      name: "EMI Payment Overdue",
      amount: "₹12,500",
      patient: "Vikram Patel",
      hospital: "City General Hospital",
      status: "critical", 
      progress: 10,
      daysOverdue: 45,
      date: "2025-05-06T10:30:00",
      contact: "+91 98765 43210"
    },
    { 
      id: "REC-2902", 
      name: "Final Payment Pending",
      amount: "₹8,200",
      patient: "Meera Sharma",
      hospital: "MedLife Hospital",
      status: "high", 
      progress: 30,
      daysOverdue: 30,
      date: "2025-05-05T14:15:00",
      contact: "+91 87654 32109"
    },
    { 
      id: "REC-2903", 
      name: "Payment Plan Required",
      amount: "₹35,000",
      patient: "Rahul Kumar",
      hospital: "Apollo Healthcare",
      status: "medium", 
      progress: 50,
      daysOverdue: 15,
      date: "2025-05-03T11:45:00",
      contact: "+91 76543 21098"
    },
    { 
      id: "REC-2904", 
      name: "First Reminder",
      amount: "₹5,500",
      patient: "Priya Verma",
      hospital: "LifeLine Medical",
      status: "low", 
      progress: 80,
      daysOverdue: 5,
      date: "2025-05-01T09:20:00",
      contact: "+91 65432 10987"
    }
  ];

  // Filter tickets based on search query and status filter
  const filteredTickets = recoveryTickets.filter(ticket => {
    const matchesSearch = searchQuery === "" || 
      ticket.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !filterStatus || ticket.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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

  const handleViewDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  };

  const handleContactPatient = (ticket: any) => {
    toast({
      title: "Contacting Patient",
      description: `Initiating contact with ${ticket.patient} at ${ticket.contact}`,
    });
  };

  const handleApplyFilter = () => {
    toast({
      title: "Filters Applied",
      description: `Showing ${filteredTickets.length} recovery cases`,
    });
  };

  const renderTicketCard = (ticket: any) => (
    <Card key={ticket.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <CircleDollarSign className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {ticket.name} - {ticket.amount}
                </h3>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`}></div>
                <Badge variant={
                  ticket.status === 'critical' ? 'destructive' : 
                  ticket.status === 'high' ? 'outline' : 
                  ticket.status === 'medium' ? 'secondary' : 'default'
                }>
                  {ticket.daysOverdue} days overdue
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                  {ticket.hospital}
                </span>
                <span className="flex items-center text-xs text-gray-500">
                  ID: {ticket.id}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewDetails(ticket)}
            >
              View Details
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleContactPatient(ticket)}
            >
              Contact Patient
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-3/4 flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">Recovery Progress</span>
              <span className="text-xs font-medium">{ticket.progress}%</span>
            </div>
            <Progress value={ticket.progress} className="h-2" />
          </div>
          
          <div className="flex items-center mt-3 md:mt-0 md:ml-6 text-sm">
            <span className="flex items-center text-xs text-gray-500 mr-4">
              <User className="h-3 w-3 mr-1" />
              {ticket.patient}
            </span>
            <span className="flex items-center text-xs text-gray-500 mr-4">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(ticket.date)}
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <Phone className="h-3 w-3 mr-1" />
              {ticket.contact}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recovery Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">This dashboard helps track and manage overdue payments from patients, allowing the recovery team to follow up and ensure timely collections.</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by patient name or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="flex-shrink-0"
              onClick={handleApplyFilter}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              className="flex-shrink-0"
              onClick={() => {
                toast({
                  title: "Create New Case",
                  description: "Opening case creation form",
                });
              }}
            >
              New Case
            </Button>
          </div>

          <Tabs 
            defaultValue="all" 
            className="w-full" 
            onValueChange={(value) => {
              if (value === "all") {
                setFilterStatus(null);
              } else {
                setFilterStatus(value);
              }
            }}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="critical">Critical (45+ days)</TabsTrigger>
              <TabsTrigger value="high">High (30+ days)</TabsTrigger>
              <TabsTrigger value="medium">Medium (15+ days)</TabsTrigger>
              <TabsTrigger value="low">Low (&lt; 15 days)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {filteredTickets.length > 0 ? (
                filteredTickets.map(renderTicketCard)
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No recovery cases found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="critical" className="space-y-4">
              {filteredTickets.filter(t => t.status === 'critical').length > 0 ? (
                filteredTickets.filter(t => t.status === 'critical').map(renderTicketCard)
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No critical cases found matching your criteria.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="high" className="space-y-4">
              {filteredTickets.filter(t => t.status === 'high').length > 0 ? (
                filteredTickets.filter(t => t.status === 'high').map(renderTicketCard)
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No high priority cases found matching your criteria.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="medium" className="space-y-4">
              {filteredTickets.filter(t => t.status === 'medium').length > 0 ? (
                filteredTickets.filter(t => t.status === 'medium').map(renderTicketCard)
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No medium priority cases found matching your criteria.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="low" className="space-y-4">
              {filteredTickets.filter(t => t.status === 'low').length > 0 ? (
                filteredTickets.filter(t => t.status === 'low').map(renderTicketCard)
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No low priority cases found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recovery Case Details</DialogTitle>
            <DialogDescription>
              Detailed information about the recovery case.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Case ID</p>
                  <p>{selectedTicket.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedTicket.status)}`}></div>
                    <Badge variant={
                      selectedTicket.status === 'critical' ? 'destructive' : 
                      selectedTicket.status === 'high' ? 'outline' : 
                      selectedTicket.status === 'medium' ? 'secondary' : 'default'
                    }>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Patient Name</p>
                  <p>{selectedTicket.patient}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p>{selectedTicket.contact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p>{selectedTicket.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Days Overdue</p>
                  <p>{selectedTicket.daysOverdue} days</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Hospital</p>
                  <p>{selectedTicket.hospital}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{formatDate(selectedTicket.date)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Recovery Progress</p>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">{selectedTicket.progress}% Complete</span>
                </div>
                <Progress value={selectedTicket.progress} className="h-2" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Recovery Actions</p>
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>First Reminder Sent</span>
                    <span>{selectedTicket.daysOverdue > 5 ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Second Reminder Sent</span>
                    <span>{selectedTicket.daysOverdue > 15 ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Final Notice Sent</span>
                    <span>{selectedTicket.daysOverdue > 30 ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Legal Action Initiated</span>
                    <span>{selectedTicket.daysOverdue > 45 ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Send Reminder",
                    description: `Reminder sent to ${selectedTicket?.patient}`,
                  });
                }}
              >
                Send Reminder
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Contacting Patient",
                    description: `Initiating contact with ${selectedTicket?.patient}`,
                  });
                  setIsDialogOpen(false);
                }}
              >
                Contact Patient
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecoveryDashboard;
