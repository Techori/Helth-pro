
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, UserPlus, Building, FileText } from "lucide-react";

const customers = [
  {
    id: "CUS001",
    name: "Metro Hospital",
    type: "Hospital",
    location: "New Delhi",
    contactPerson: "Dr. Anil Kapoor",
    phone: "9876543210",
    email: "anil@metrohospital.com",
    status: "Active",
    revenue: "₹24,50,000",
    lastPurchase: "2023-04-02"
  },
  {
    id: "CUS002",
    name: "City Care Clinic",
    type: "Clinic",
    location: "Mumbai",
    contactPerson: "Dr. Sunita Rao",
    phone: "8765432109",
    email: "sunita@citycareclinic.com",
    status: "Active",
    revenue: "₹12,75,000",
    lastPurchase: "2023-03-28"
  },
  {
    id: "CUS003",
    name: "Health First Hospital",
    type: "Hospital",
    location: "Bangalore",
    contactPerson: "Dr. Ramesh Kumar",
    phone: "7654321098",
    email: "ramesh@healthfirst.com",
    status: "Inactive",
    revenue: "₹8,20,000",
    lastPurchase: "2023-02-15"
  },
  {
    id: "CUS004",
    name: "Wellness Medical Center",
    type: "Medical Center",
    location: "Chennai",
    contactPerson: "Dr. Priya Patel",
    phone: "6543210987",
    email: "priya@wellnessmedical.com",
    status: "Active",
    revenue: "₹16,40,000",
    lastPurchase: "2023-03-20"
  },
  {
    id: "CUS005",
    name: "Care Plus Hospital",
    type: "Hospital",
    location: "Hyderabad",
    contactPerson: "Dr. Vikram Singh",
    phone: "5432109876",
    email: "vikram@careplus.com",
    status: "Active",
    revenue: "₹31,25,000",
    lastPurchase: "2023-04-01"
  }
];

const CustomerManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Management</h2>
          <p className="text-muted-foreground">
            Manage your customer portfolio and relationships
          </p>
        </div>
        <Button className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          Add New Customer
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Customer Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Export Customer List
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Industry Analysis
                </Button>
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-4 pb-0 pt-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Customer Database</CardTitle>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Contact</TableHead>
                      <TableHead className="hidden lg:table-cell">Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Revenue</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.type}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs">
                            <p className="font-medium">{customer.contactPerson}</p>
                            <p>{customer.email}</p>
                            <p>{customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{customer.location}</TableCell>
                        <TableCell>
                          <Badge className={customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{customer.revenue}</TableCell>
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
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {/* Active customers content - Similar to all but filtered */}
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-center py-4">
                Showing active customers - 4 records found
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          {/* Inactive customers content - Similar to all but filtered */}
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-center py-4">
                Showing inactive customers - 1 record found
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerManagement;
