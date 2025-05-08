
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserPlus, Eye, UserCog, Lock, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const AdminUserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for users
  const users = [
    {
      id: "USR-001",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      role: "Patient",
      status: "Active",
      lastLogin: "06/04/2025 10:23 AM",
      registeredOn: "15/01/2025"
    },
    {
      id: "USR-002",
      name: "Dr. Priya Patel",
      email: "priya.patel@citygeneral.com",
      role: "Hospital Staff",
      status: "Active",
      lastLogin: "05/04/2025 09:45 AM",
      registeredOn: "10/01/2025"
    },
    {
      id: "USR-003",
      name: "Sameer Khan",
      email: "sameer.khan@example.com",
      role: "Patient",
      status: "Active",
      lastLogin: "04/04/2025 02:30 PM",
      registeredOn: "20/01/2025"
    },
    {
      id: "USR-004",
      name: "Dr. Aisha Reddy",
      email: "aisha.reddy@carewell.com",
      role: "Hospital Admin",
      status: "Active",
      lastLogin: "06/04/2025 08:15 AM",
      registeredOn: "05/01/2025"
    },
    {
      id: "USR-005",
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      role: "Patient",
      status: "Inactive",
      lastLogin: "25/03/2025 11:10 AM",
      registeredOn: "12/01/2025"
    },
    {
      id: "USR-006",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@lifecare.com",
      role: "Hospital Staff",
      status: "Suspended",
      lastLogin: "01/04/2025 04:50 PM",
      registeredOn: "08/01/2025"
    }
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(
    user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = (action: string, userId: string, userName: string) => {
    switch (action) {
      case "view":
        toast({
          title: "View User Profile",
          description: `Viewing profile for ${userName} (${userId})`,
        });
        break;
      case "edit":
        toast({
          title: "Edit User",
          description: `Editing user ${userName} (${userId})`,
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
          title: "User Suspended",
          description: `${userName} has been suspended`,
        });
        break;
      case "activate":
        toast({
          title: "User Activated",
          description: `${userName} has been activated`,
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage and monitor all system users</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 max-w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">{users.length}</div>
                <div className="text-sm font-medium">Total Users</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-indigo-500">
                  {users.filter(user => user.role === "Patient").length}
                </div>
                <div className="text-sm font-medium">Patients</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-500">
                  {users.filter(user => user.role.includes("Hospital")).length}
                </div>
                <div className="text-sm font-medium">Hospital Users</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-amber-500">
                  {users.filter(user => user.status === "Active").length}
                </div>
                <div className="text-sm font-medium">Active Users</div>
              </div>
            </Card>
          </div>
          
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === "Hospital Admin" ? "default" : 
                          user.role === "Hospital Staff" ? "secondary" : 
                          "outline"
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.status === "Active" ? "default" : 
                            user.status === "Inactive" ? "outline" : 
                            "destructive"
                          }
                          className={user.status === "Active" ? "bg-green-500" : ""}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleUserAction("view", user.id, user.name)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction("edit", user.id, user.name)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction("reset", user.id, user.name)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "Active" ? (
                              <DropdownMenuItem onClick={() => handleUserAction("suspend", user.id, user.name)}>
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUserAction("activate", user.id, user.name)}>
                                Activate User
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
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <Button variant="outline">View All Users</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
