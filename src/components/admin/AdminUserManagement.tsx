import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserPlus, Eye, UserCog, Lock, MoreHorizontal, Save, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the User type to ensure consistency
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  registeredOn: string;
}

const AdminUserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState({ name: "", email: "" });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please log in to view users.",
          });
          return;
        }

        console.log("Fetching users...");
        const response = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${responseText}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (err) {
          console.error("JSON parse error:", err);
          throw new Error("Invalid JSON response from server");
        }

        console.log("Parsed data:", data);
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch users. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const roleMap = {
      "Patient": "patient",
      "Hospital Staff": "hospital staff",
      "Hospital Admin": "hospital admin",
    };
    const backendRole = roleMap[newUser.role] || newUser.role;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to add a user.",
        });
        return;
      }

      // Make API call
      const response = await fetch("api/admin/quick-action-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: backendRole,
          notes: "",
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(data.msg || "Failed to add user");
      }

      // Add the new user to the list with the data from the backend
      const newUserData: User = {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: newUser.role,
        status: "Active",
        lastLogin: "Never",
        registeredOn: data.user.registeredOn,
      };

      setUsers([...users, newUserData]);

      // Reset form and close dialog
      setNewUser({
        name: "",
        email: "",
        role: "",
        status: "Active",
      });
      setIsAddingUser(false);

      toast({
        title: "Success",
        description: "User added successfully.",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add user. Please try again.",
      });
    }
  };

  const handleEditUser = async (userId: string) => {
    const index = users.findIndex((user) => user.id === userId);
    if (index === -1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not found.",
      });
      return;
    }
    if (!editingUser.name || !editingUser.email) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to update a user.",
        });
        return;
      }

      // Use the user's ID for the API request
      const userToUpdate = users[index];
      console.log("User ID for update:", userToUpdate.id, "User:", userToUpdate);

      // Store original users for rollback
      const originalUsers = [...users];

      // Optimistic update
      const updatedUsers = [...users];
      updatedUsers[index] = {
        ...updatedUsers[index],
        firstName: editingUser.name,
        email: editingUser.email,
      };
      setUsers(updatedUsers);

      const response = await fetch(`api/admin/update-user/${userToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editingUser.name,
          email: editingUser.email,
        }),
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("JSON parse error:", err.message);
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) {
        setUsers(originalUsers); // Rollback
        throw new Error(data.msg || "Failed to update user");
      }

      setEditingUserId(null);
      setEditingUser({ name: "", email: "" });
      toast({
        title: "User Updated",
        description: `User ${editingUser.name} has been updated successfully.`,
      });
    } catch (error) {
      // Rollback is already handled in the catch block above
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user. Please try again.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingUser({ name: "", email: "" });
  };

  const handleUserAction = (action: string, userId: string, userName: string) => {
    switch (action) {
      case "view":
        toast({
          title: "View User Profile",
          description: `Viewing profile for ${userName} (${userId})`,
        });
        break;
      case "edit": {
        const userToEdit = users.find((user) => user.id === userId);
        if (userToEdit) {
          setEditingUserId(userId);
          setEditingUser({
            name: userToEdit.firstName,
            email: userToEdit.email,
          });
        }
        break;
      }
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
              <Button onClick={() => setIsAddingUser(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <>
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
                      {users.filter((user) => user.role === "patient").length}
                    </div>
                    <div className="text-sm font-medium">Patients</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-green-500">
                      {users.filter((user) => user.role.includes("hospital")).length}
                    </div>
                    <div className="text-sm font-medium">Hospital Users</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-amber-500">
                      {users.filter((user) => user.status === "Active").length}
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
                          <TableCell>
                            {editingUserId === user.id ? (
                              <Input
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                className="w-full"
                              />
                            ) : (
                              `${user.firstName} ${user.lastName}`
                            )}
                          </TableCell>
                          <TableCell>
                            {editingUserId === user.id ? (
                              <Input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                className="w-full"
                              />
                            ) : (
                              user.email
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "hospital admin"
                                  ? "default"
                                  : user.role === "hospital staff"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "Active"
                                  ? "default"
                                  : user.status === "Inactive"
                                    ? "outline"
                                    : "destructive"
                              }
                              className={user.status === "Active" ? "bg-green-500" : ""}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell>
                            {editingUserId === user.id ? (
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditUser(user.id)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleUserAction("view", user.id, `${user.firstName} ${user.lastName}`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUserAction("edit", user.id, `${user.firstName} ${user.lastName}`)}>
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUserAction("reset", user.id, `${user.firstName} ${user.lastName}`)}>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {user.status === "Active" ? (
                                    <DropdownMenuItem onClick={() => handleUserAction("suspend", user.id, `${user.firstName} ${user.lastName}`)}>
                                      Suspend User
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleUserAction("activate", user.id, `${user.firstName} ${user.lastName}`)}>
                                      Activate User
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
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
            </>
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

      {/* Add User Dialog */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account and set their role.</DialogDescription>

          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Hospital Staff">Hospital Staff</SelectItem>
                  <SelectItem value="Hospital Admin">Hospital Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingUser(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;