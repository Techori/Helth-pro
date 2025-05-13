import { Bell, Menu, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboardHeader = ({ 
  adminName, 
  toggleSidebar 
}: { 
  adminName: string; 
  toggleSidebar: () => void;
}) => {
  const { signOut } = useAuth();
  const [notificationCount, setNotificationCount] = useState(5);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New Hospital Registration",
      description: "City General Hospital has submitted registration",
      time: "5 mins ago",
      read: false,
      type: "hospital"
    },
    {
      id: 2,
      title: "Loan Approval Pending",
      description: "3 new loan approvals require your attention",
      time: "15 mins ago",
      read: false,
      type: "loan"
    },
    {
      id: 3,
      title: "System Update",
      description: "New platform version available for installation",
      time: "1 hour ago",
      read: false,
      type: "system"
    },
    {
      id: 4,
      title: "User Account Issue",
      description: "5 users reported login problems today",
      time: "3 hours ago",
      read: true,
      type: "user"
    },
    {
      id: 5,
      title: "Payment Gateway Alert",
      description: "Payment gateway showing intermittent issues",
      time: "5 hours ago",
      read: true,
      type: "payment"
    }
  ];

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleNotificationRead = (id: number) => {
    toast({
      title: "Notification Marked as Read",
      description: "The notification has been marked as read.",
    });
    setNotificationCount(prevCount => Math.max(0, prevCount - 1));
  };

  const handleAllRead = () => {
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
    setNotificationCount(0);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    signOut();
  };

  const handleHelpClick = () => {
    setShowHelpDialog(true);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome, {adminName}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleHelpClick}>
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">{notificationCount}</span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-5 w-5" />
              <span className="sr-only">User Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>
              Recent system notifications and alerts
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(notification => (
              <div key={notification.id} className={`p-3 mb-2 border rounded-md ${!notification.read ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {notification.title}
                      {!notification.read && (
                        <Badge variant="default" className="bg-blue-500">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleNotificationRead(notification.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleAllRead}>
              Mark All as Read
            </Button>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Admin Help Center</DialogTitle>
            <DialogDescription>
              Get help with common admin tasks
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border rounded-md p-3">
              <h3 className="font-medium">Managing Hospital Registrations</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to the Hospitals tab to review and process hospital registration requests.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium">Loan Approval Process</h3>
              <p className="text-sm text-muted-foreground">
                Review loan applications in the Loan Approvals tab. Check patient details and financial information before approving.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Create, edit, or suspend user accounts in the Users tab. You can also manage user roles and permissions.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium">Need More Help?</h3>
              <p className="text-sm text-muted-foreground">
                Contact the IT support team at support@rimedicare.com or call +91 98765 43210.
              </p>
            </div>
          </div>
          
          <DialogClose asChild>
            <Button className="w-full">Close Help</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default AdminDashboardHeader;
