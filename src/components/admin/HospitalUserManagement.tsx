
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Eye, UserCog, Lock, MoreHorizontal, Phone, Building, Mail } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const HospitalUserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for hospital staff
  const hospitalStaff = [
    {
      id: "HS-001",
      name: "Dr. Anil Kapoor",
      email: "anil.kapoor@citygeneralhospital.com",
      phone: "+91 9876543210",
      role: "Hospital Manager",
      hospital: "City General Hospital",
      department: "Administration",
      status: "Active",
      lastLogin: "06/04/2025 10:23 AM"
    },
    {
      id: "HS-002",
      name: "Meena Shah",
      email: "meena.shah@citygeneralhospital.com",
      phone: "+91 9876543211",
      role: "Billing Staff",
      hospital: "City General Hospital",
      department: "Finance",
      status: "Active",
      lastLogin: "06/04/2025 09:45 AM"
    },
    {
      id: "HS-003",
      name: "Rahul Verma",
      email: "rahul.verma@citygeneralhospital.com",
      phone: "+91 9876543212",
      role: "Front Desk Staff",
      hospital: "City General Hospital",
      department: "Reception",
      status: "Active",
      lastLogin: "06/04/2025 08:30 AM"
    },
    {
      id: "HS-004",
      name: "Sunita Patel",
      email: "sunita.patel@citygeneralhospital.com",
      phone: "+91 9876543213",
      role: "Finance Staff",
      hospital: "City General Hospital",
      department: "Finance",
      status: "Active",
      lastLogin: "05/04/2025 04:15 PM"
    },
    {
      id: "HS-005",
      name: "Dr. Raj Malhotra",
      email: "raj.malhotra@lifecarehospital.com",
      phone: "+91 9876543214",
      role: "Hospital Manager",
      hospital: "LifeCare Hospital",
      department: "Administration",
      status: "Active",
      lastLogin: "06/04/2025 11:10 AM"
    },
    {
      id: "HS-006",
      name: "Pooja Singh",
      email: "pooja.singh@lifecarehospital.com",
      phone: "+91 9876543215",
      role: "Relationship Manager",
      hospital: "LifeCare Hospital",
      department: "Marketing",
      status: "Active",
      lastLogin: "05/04/2025 02:30 PM"
    },
    {
      id: "HS-007",
      name: "Vikram Agarwal",
      email: "vikram.agarwal@citymedicalcenter.com",
      phone: "+91 9876543216",
      role: "Finance Staff",
      hospital: "City Medical Center",
      department: "Finance",
      status: "Inactive",
      lastLogin: "01/04/2025 10:45 AM"
    },
    {
      id: "HS-008",
      name: "Neha Reddy",
      email: "neha.reddy@citymedicalcenter.com",
      phone: "+91 9876543217",
      role: "Front Desk Staff",
      hospital: "City Medical Center",
      department: "Reception",
      status: "Active",
      lastLogin: "06/04/2025 09:20 AM"
    }
  ];

  // Filter hospital staff based on search term and active tab
  const filteredStaff = hospitalStaff.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "managers") return matchesSearch && staff.role.includes("Manager");
    if (activeTab === "finance") return matchesSearch && (staff.role.includes("Finance") || staff.role.includes("Billing"));
    if (activeTab === "front-desk") return matchesSearch && staff.role.includes("Front Desk");
    if (activeTab === "relationship") return matchesSearch && staff.role.includes("Relationship");
    
    return matchesSearch;
  });

  const handleAddStaff = () => {
    toast({
      title: "Add Hospital Staff",
      description: "Opening form to add new hospital staff member",
    });
  };

  const handleUserAction = (action: string, userId: string, userName: string) => {
    switch (action) {
      case "view":
        toast({
          title: "View Staff Profile",
          description: `Viewing profile for ${userName} (${userId})`,
        });
        break;
      case "edit":
        toast({
          title: "Edit Staff",
          description: `Editing staff ${userName} (${userId})`,
        });
        break;
      case "reset":
        toast({
          title: "Reset Password",
          description: `Password reset link sent to ${userName}`,
        });
        break;
      case "suspend":
        toast({
          title: "Staff Suspended",
          description: `${userName} has been suspended`,
        });
        break;
      case "activate":
        toast({
          title: "Staff Activated",
          description: `${userName} has been activated`,
        });
        break;
      default:
        break;
    }
  };

  // Count different staff roles
  const managerCount = hospitalStaff.filter(staff => staff.role.includes("Manager")).length;
  const financeCount = hospitalStaff.filter(staff => staff.role.includes("Finance") || staff.role.includes("Billing")).length;
  const frontDeskCount = hospitalStaff.filter(staff => staff.role.includes("Front Desk")).length;
  const relationshipCount = hospitalStaff.filter(staff => staff.role.includes("Relationship")).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Hospital Staff Management</CardTitle>
              <CardDescription>Manage hospital staff and their roles across partner hospitals</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search staff..."
                  className="pl-8 max-w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={handleAddStaff}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="p-4" onClick={() => setActiveTab("all")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-primary">{hospitalStaff.length}</div>
                <div className="text-sm font-medium">Total Staff</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("managers")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-indigo-500">{managerCount}</div>
                <div className="text-sm font-medium">Managers</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("finance")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-emerald-500">{financeCount}</div>
                <div className="text-sm font-medium">Finance Staff</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("front-desk")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-amber-500">{frontDeskCount}</div>
                <div className="text-sm font-medium">Front Desk</div>
              </div>
            </Card>
            <Card className="p-4" onClick={() => setActiveTab("relationship")}>
              <div className="text-center space-y-2 cursor-pointer">
                <div className="text-4xl font-bold text-purple-500">{relationshipCount}</div>
                <div className="text-sm font-medium">Relationship Managers</div>
              </div>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="managers">Managers</TabsTrigger>
              <TabsTrigger value="finance">Finance Staff</TabsTrigger>
              <TabsTrigger value="front-desk">Front Desk</TabsTrigger>
              <TabsTrigger value="relationship">Relationship Managers</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredStaff.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.id}</TableCell>
                          <TableCell>{staff.name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                staff.role.includes("Manager") ? "border-indigo-500 text-indigo-600" : 
                                staff.role.includes("Finance") || staff.role.includes("Billing") ? "border-emerald-500 text-emerald-600" : 
                                staff.role.includes("Front Desk") ? "border-amber-500 text-amber-600" : 
                                staff.role.includes("Relationship") ? "border-purple-500 text-purple-600" : 
                                "border-gray-500"
                              }
                            >
                              {staff.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-muted-foreground" />
                              <span>{staff.hospital}</span>
                            </div>
                          </TableCell>
                          <TableCell>{staff.department}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{staff.phone}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{staff.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={staff.status === "Active" ? "default" : "outline"}
                              className={staff.status === "Active" ? "bg-green-500" : ""}
                            >
                              {staff.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{staff.lastLogin}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUserAction("view", staff.id, staff.name)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction("edit", staff.id, staff.name)}>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Edit Staff
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUserAction("reset", staff.id, staff.name)}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {staff.status === "Active" ? (
                                  <DropdownMenuItem onClick={() => handleUserAction("suspend", staff.id, staff.name)}>
                                    Suspend Staff
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleUserAction("activate", staff.id, staff.name)}>
                                    Activate Staff
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <p className="text-muted-foreground">No staff found matching your search criteria</p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredStaff.length} of {hospitalStaff.length} staff members
            </p>
            <Button variant="outline">Export Staff List</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HospitalUserManagement;
