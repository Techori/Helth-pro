
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, FileText, Phone, Mail } from "lucide-react";

const leads = [
  {
    id: "LD001",
    name: "Rajesh Kumar",
    company: "City Central Hospital",
    position: "Procurement Manager",
    email: "rajesh@citycentralhospital.com",
    phone: "9876543210",
    source: "Website",
    status: "New",
    assignedTo: "Priya Sharma",
    lastContact: "2023-04-05"
  },
  {
    id: "LD002",
    name: "Anita Desai",
    company: "Medicare Plus",
    position: "Finance Director",
    email: "anita@medicareplus.com",
    phone: "8765432109",
    source: "Referral",
    status: "Qualified",
    assignedTo: "Rahul Verma",
    lastContact: "2023-04-02"
  },
  {
    id: "LD003",
    name: "Samir Patel",
    company: "HealthFirst Clinic",
    position: "Owner",
    email: "samir@healthfirstclinic.com",
    phone: "7654321098",
    source: "Exhibition",
    status: "Contacted",
    assignedTo: "Priya Sharma",
    lastContact: "2023-04-01"
  },
  {
    id: "LD004",
    name: "Meera Reddy",
    company: "Life Care Hospital",
    position: "HR Manager",
    email: "meera@lifecarehospital.com",
    phone: "6543210987",
    source: "Cold Call",
    status: "Negotiation",
    assignedTo: "Vikram Singh",
    lastContact: "2023-03-28"
  },
  {
    id: "LD005",
    name: "Ravi Sharma",
    company: "Unity Medical Center",
    position: "Medical Director",
    email: "ravi@unitymedical.com",
    phone: "5432109876",
    source: "Partner",
    status: "Proposal",
    assignedTo: "Neha Gupta",
    lastContact: "2023-03-25"
  },
];

const LeadManagement = () => {
  const getStatusColor = (status: string) => {
    const colors = {
      "New": "bg-blue-100 text-blue-800",
      "Contacted": "bg-yellow-100 text-yellow-800",
      "Qualified": "bg-green-100 text-green-800",
      "Proposal": "bg-purple-100 text-purple-800",
      "Negotiation": "bg-orange-100 text-orange-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lead Management</h2>
          <p className="text-muted-foreground">
            Manage and track all your sales leads in one place
          </p>
        </div>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add New Lead
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Lead Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Import Leads
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Campaign
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Campaign
            </Button>
            <Select>
              <SelectTrigger id="filter">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="assign">Assign Selected</SelectItem>
                <SelectItem value="status">Change Status</SelectItem>
                <SelectItem value="export">Export Selected</SelectItem>
                <SelectItem value="delete">Delete Selected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-4 pb-0 pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Leads</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.position}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{lead.company}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-xs">
                        <p>{lead.email}</p>
                        <p>{lead.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{lead.source}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{lead.assignedTo}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadManagement;
