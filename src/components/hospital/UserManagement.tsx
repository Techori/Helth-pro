
import { useState } from "react";
import { Eye, EyeOff, Lock, PlusCircle, Search, Trash, UserCog } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  department: string;
  lastLogin: string;
  status: "active" | "inactive";
}

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states for new user
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "manager" | "staff">("staff");
  const [newUserDepartment, setNewUserDepartment] = useState("billing");
  const [newUserPassword, setNewUserPassword] = useState("rimedical@123");
  const [sendCredentials, setSendCredentials] = useState(true);
  
  // Mock user data for demo purposes
  const [users, setUsers] = useState<User[]>([
    {
      id: "U12345",
      name: "Amit Kumar",
      email: "amit.kumar@citygeneralhospital.com",
      role: "admin",
      department: "Admin",
      lastLogin: "2023-11-15 10:30",
      status: "active",
    },
    {
      id: "U12346",
      name: "Sneha Reddy",
      email: "sneha.reddy@citygeneralhospital.com",
      role: "manager",
      department: "Finance",
      lastLogin: "2023-11-14 14:45",
      status: "active",
    },
    {
      id: "U12347",
      name: "Raj Sharma",
      email: "raj.sharma@citygeneralhospital.com",
      role: "staff",
      department: "Billing",
      lastLogin: "2023-11-13 09:15",
      status: "active",
    },
    {
      id: "U12348",
      name: "Meera Patel",
      email: "meera.patel@citygeneralhospital.com",
      role: "staff",
      department: "Front Desk",
      lastLogin: "2023-11-10 11:20",
      status: "inactive",
    },
  ]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower)
    );
  });

  const handleAddUser = () => {
    // Validate form
    if (!newUserName || !newUserEmail) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Generate a new user ID
    const newUserId = `U${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Create new user object
    const newUser: User = {
      id: newUserId,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDepartment,
      lastLogin: "Never",
      status: "active",
    };
    
    // Add user to the list
    setUsers([...users, newUser]);
    
    // Close dialog
    setAddUserOpen(false);
    
    // Reset form
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("staff");
    setNewUserDepartment("billing");
    setNewUserPassword("rimedical@123");
    
    // Show success toast
    toast({
      title: "User added successfully",
      description: sendCredentials 
        ? "Login credentials have been sent to the user's email." 
        : "User has been added to the system.",
    });
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    
    // In a real app, this would call an API to reset the password
    
    // Close dialog
    setResetPasswordOpen(false);
    
    // Show success toast
    toast({
      title: "Password reset successful",
      description: sendCredentials 
        ? `New login credentials have been sent to ${selectedUser.email}.` 
        : "Password has been reset successfully.",
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // Filter out the selected user
    setUsers(users.filter(user => user.id !== selectedUser.id));
    
    // Close dialog
    setDeleteUserOpen(false);
    
    // Show success toast
    toast({
      title: "User deleted",
      description: `${selectedUser.name} has been removed from the system.`,
    });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: "active" | "inactive") => {
    // Update the user's status
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: currentStatus === "active" ? "inactive" : "active",
        };
      }
      return user;
    }));
    
    // Get the user
    const user = users.find(u => u.id === userId);
    
    // Show success toast
    toast({
      title: `User ${currentStatus === "active" ? "deactivated" : "activated"}`,
      description: `${user?.name} is now ${currentStatus === "active" ? "inactive" : "active"}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage hospital staff access and permissions
              </CardDescription>
            </div>
            <Button onClick={() => setAddUserOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users by name, email, role..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={user.status === "active"}
                            onCheckedChange={() => handleToggleUserStatus(user.id, user.status)}
                          />
                          <span className={`capitalize text-sm ${
                            user.status === "active" ? "text-green-600" : "text-gray-500"
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setResetPasswordOpen(true);
                            }}
                          >
                            <Lock className="h-3.5 w-3.5" />
                            <span className="sr-only">Reset Password</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteUserOpen(true);
                            }}
                          >
                            <Trash className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No users found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardFooter>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and set their access permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUserRole} onValueChange={setNewUserRole as any}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newUserDepartment} onValueChange={setNewUserDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="front-desk">Front Desk</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="send-credentials"
                checked={sendCredentials}
                onCheckedChange={setSendCredentials}
              />
              <Label htmlFor="send-credentials">Send login credentials via email</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              {selectedUser && `Reset the password for ${selectedUser.name} (${selectedUser.email}).`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="send-credentials-reset"
                checked={sendCredentials}
                onCheckedChange={setSendCredentials}
              />
              <Label htmlFor="send-credentials-reset">Send new password via email</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
