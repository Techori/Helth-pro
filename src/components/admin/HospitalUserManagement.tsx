import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserPlus, Eye, UserCog, Lock, MoreHorizontal, Phone, Building, Mail } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffMember, addStaff, getAllStaff, updateStaffStatus } from "@/services/staffService";

const HospitalUserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [hospitalStaff, setHospitalStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newStaffInfo, setNewStaffInfo] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    hospital: "",
    department: "",
  });

  // Load staff data on component mount
  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      setIsLoading(true);
      const staff = await getAllStaff();
      setHospitalStaff(staff);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load staff data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleAddStaff = async () => {
    // Validate form data
    if (!newStaffInfo.name || !newStaffInfo.email || !newStaffInfo.phone || !newStaffInfo.hospital || !newStaffInfo.role || !newStaffInfo.department) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      // Generate a new staff ID
      const newStaffId = `HS-${String(hospitalStaff.length + 1).padStart(3, '0')}`;

      // Create new staff object
      const staffToAdd = {
        id: newStaffId,
        name: newStaffInfo.name,
        email: newStaffInfo.email,
        phone: newStaffInfo.phone,
        hospital: newStaffInfo.hospital,
        role: newStaffInfo.role,
        department: newStaffInfo.department,
        status: "Active",
        lastLogin: "Never",
        registeredOn: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '/')
      };

      // Call the service to add staff
      const newStaff = await addStaff(staffToAdd);
      setHospitalStaff(prevStaff => [...prevStaff, newStaff]);
      
      toast({
        title: "Staff Added",
        description: `Staff member ${newStaffInfo.name} has been added successfully.`,
      });

      // Reset form and close dialog
      setNewStaffInfo({
        name: "",
        email: "",
        phone: "",
        role: "",
        hospital: "",
        department: "",
      });
      setIsAddingStaff(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add staff member. Please try again.",
      });
    }
  };

  const handleUserAction = async (action: string, userId: string, userName: string) => {
    try {
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
          await updateStaffStatus(userId, "Inactive");
          setHospitalStaff(prevStaff =>
            prevStaff.map(staff =>
              staff.id === userId ? { ...staff, status: "Inactive" } : staff
            )
          );
          toast({
            title: "Staff Suspended",
            description: `${userName} has been suspended`,
          });
          break;
        case "activate":
          await updateStaffStatus(userId, "Active");
          setHospitalStaff(prevStaff =>
            prevStaff.map(staff =>
              staff.id === userId ? { ...staff, status: "Active" } : staff
            )
          );
          toast({
            title: "Staff Activated",
            description: `${userName} has been activated`,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform action. Please try again.",
      });
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
              <Button onClick={() => setIsAddingStaff(true)}>
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

      {/* Add Staff Dialog */}
      <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new staff member to the hospital.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  value={newStaffInfo.name}
                  onChange={(e) => setNewStaffInfo({ ...newStaffInfo, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaffInfo.email}
                  onChange={(e) => setNewStaffInfo({ ...newStaffInfo, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newStaffInfo.phone}
                  onChange={(e) => setNewStaffInfo({ ...newStaffInfo, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role*</Label>
                <Select
                  value={newStaffInfo.role}
                  onValueChange={(value) => setNewStaffInfo({ ...newStaffInfo, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hospital Manager">Hospital Manager</SelectItem>
                    <SelectItem value="Finance Staff">Finance Staff</SelectItem>
                    <SelectItem value="Front Desk Staff">Front Desk Staff</SelectItem>
                    <SelectItem value="Relationship Manager">Relationship Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department*</Label>
                <Select
                  value={newStaffInfo.department}
                  onValueChange={(value) => setNewStaffInfo({ ...newStaffInfo, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Reception">Reception</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="hospital">Hospital*</Label>
              <Select
                value={newStaffInfo.hospital}
                onValueChange={(value) => setNewStaffInfo({ ...newStaffInfo, hospital: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="City General Hospital">City General Hospital</SelectItem>
                  <SelectItem value="LifeCare Hospital">LifeCare Hospital</SelectItem>
                  <SelectItem value="City Medical Center">City Medical Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingStaff(false)}>Cancel</Button>
            <Button onClick={handleAddStaff}>Add Staff Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalUserManagement;