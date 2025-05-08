
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Filter, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";

interface Lead {
  id: string;
  name: string;
  organizationType: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  interestIn: string[];
  status: LeadStatus;
  assignedTo: string;
  createdDate: string;
}

const LeadManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [isAddLeadDialogOpen, setIsAddLeadDialogOpen] = useState(false);
  
  const [newLeadData, setNewLeadData] = useState({
    name: "",
    organizationType: "Hospital",
    contactPerson: "",
    phone: "",
    email: "",
    location: "",
    interestIn: ["Health Cards"],
    status: "New" as LeadStatus,
  });

  // Mock data for leads
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "LD-2301",
      name: "City General Hospital",
      organizationType: "Hospital",
      contactPerson: "Dr. Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh@citygeneralhospital.com",
      location: "Delhi",
      interestIn: ["Health Cards", "Loan Facility"],
      status: "Qualified",
      assignedTo: "Rahul Mehta",
      createdDate: "2023-10-15",
    },
    {
      id: "LD-2302",
      name: "LifeCare Medical Center",
      organizationType: "Clinic",
      contactPerson: "Dr. Priya Singh",
      phone: "8765432109",
      email: "priya@lifecaremedical.com",
      location: "Mumbai",
      interestIn: ["Health Cards"],
      status: "Proposal",
      assignedTo: "Rahul Mehta",
      createdDate: "2023-10-22",
    },
    {
      id: "LD-2303",
      name: "Wellness Hospital",
      organizationType: "Hospital",
      contactPerson: "Dr. Arun Sharma",
      phone: "7654321098",
      email: "arun@wellnesshospital.com",
      location: "Bangalore",
      interestIn: ["Loan Facility"],
      status: "Contacted",
      assignedTo: "Rahul Mehta",
      createdDate: "2023-11-05",
    },
    {
      id: "LD-2304",
      name: "Medicare Clinic",
      organizationType: "Clinic",
      contactPerson: "Dr. Sneha Reddy",
      phone: "6543210987",
      email: "sneha@medicareclinic.com",
      location: "Chennai",
      interestIn: ["Health Cards", "Loan Facility"],
      status: "New",
      assignedTo: "Rahul Mehta",
      createdDate: "2023-11-10",
    },
  ]);

  // Filter leads based on search term and status filter
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddLead = () => {
    // Basic validation
    if (!newLeadData.name || !newLeadData.contactPerson || !newLeadData.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields.",
      });
      return;
    }

    // Generate new lead ID
    const newLeadId = `LD-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create new lead
    const newLead: Lead = {
      id: newLeadId,
      ...newLeadData,
      assignedTo: "Rahul Mehta", // Current user
      createdDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    };
    
    // Add new lead to the list
    setLeads([newLead, ...leads]);
    
    // Show success toast
    toast({
      title: "Lead Created",
      description: `${newLead.name} has been added to your leads.`,
    });
    
    // Reset form and close dialog
    setNewLeadData({
      name: "",
      organizationType: "Hospital",
      contactPerson: "",
      phone: "",
      email: "",
      location: "",
      interestIn: ["Health Cards"],
      status: "New",
    });
    setIsAddLeadDialogOpen(false);
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>;
      case "Contacted":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">{status}</Badge>;
      case "Qualified":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">{status}</Badge>;
      case "Proposal":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>;
      case "Negotiation":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-100">{status}</Badge>;
      case "Closed Won":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
      case "Closed Lost":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status: newStatus };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    
    toast({
      title: "Lead Updated",
      description: `Lead status updated to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>Manage and track your sales leads</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  className="pl-8 w-full md:w-[240px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as LeadStatus | "All")}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filter Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Closed Won">Closed Won</SelectItem>
                    <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddLeadDialogOpen} onOpenChange={setIsAddLeadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lead
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Lead</DialogTitle>
                      <DialogDescription>
                        Enter the details of the potential client.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Organization Name*</Label>
                          <Input
                            id="name"
                            value={newLeadData.name}
                            onChange={(e) => setNewLeadData({...newLeadData, name: e.target.value})}
                            placeholder="Enter organization name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organizationType">Organization Type</Label>
                          <Select
                            value={newLeadData.organizationType}
                            onValueChange={(value) => setNewLeadData({...newLeadData, organizationType: value})}
                          >
                            <SelectTrigger id="organizationType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Hospital">Hospital</SelectItem>
                              <SelectItem value="Clinic">Clinic</SelectItem>
                              <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                              <SelectItem value="Diagnostic Center">Diagnostic Center</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person Name*</Label>
                          <Input
                            id="contactPerson"
                            value={newLeadData.contactPerson}
                            onChange={(e) => setNewLeadData({...newLeadData, contactPerson: e.target.value})}
                            placeholder="Enter contact person's name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number*</Label>
                          <Input
                            id="phone"
                            value={newLeadData.phone}
                            onChange={(e) => setNewLeadData({...newLeadData, phone: e.target.value})}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newLeadData.email}
                            onChange={(e) => setNewLeadData({...newLeadData, email: e.target.value})}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newLeadData.location}
                            onChange={(e) => setNewLeadData({...newLeadData, location: e.target.value})}
                            placeholder="Enter location"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interestIn">Interested In</Label>
                        <Select
                          value={newLeadData.interestIn[0]}
                          onValueChange={(value) => setNewLeadData({...newLeadData, interestIn: [value]})}
                        >
                          <SelectTrigger id="interestIn">
                            <SelectValue placeholder="Select interest" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Health Cards">Health Cards</SelectItem>
                            <SelectItem value="Loan Facility">Loan Facility</SelectItem>
                            <SelectItem value="Health Cards, Loan Facility">Both Health Cards & Loan Facility</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Initial Status</Label>
                        <Select
                          value={newLeadData.status}
                          onValueChange={(value) => setNewLeadData({...newLeadData, status: value as LeadStatus})}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddLeadDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddLead}>
                        Add Lead
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">{lead.organizationType}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{lead.contactPerson}</div>
                          <div className="text-xs text-muted-foreground">{lead.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lead.interestIn.map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{lead.createdDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleUpdateLeadStatus(lead.id, "New")}>
                              New
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateLeadStatus(lead.id, "Contacted")}>
                              Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateLeadStatus(lead.id, "Qualified")}>
                              Qualified
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateLeadStatus(lead.id, "Proposal")}>
                              Proposal
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateLeadStatus(lead.id, "Negotiation")}>
                              Negotiation
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateLeadStatus(lead.id, "Closed Won")}>
                              Closed Won
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateLeadStatus(lead.id, "Closed Lost")}>
                              Closed Lost
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No leads found. Add a new lead or adjust your search filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
          <Button variant="outline">Export Leads</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LeadManagement;
