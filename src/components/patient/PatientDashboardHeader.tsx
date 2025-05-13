import { Bell, Menu, User, CreditCard, LogOut, Settings } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PatientDashboardHeaderProps {
  patientName: string;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const PatientDashboardHeader = ({ 
  patientName, 
  toggleSidebar,
  onLogout
}: PatientDashboardHeaderProps) => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "EMI Payment Due",
      description: "Your EMI payment of ₹5,000 is due on 30th Nov 2023",
      date: "25 Nov 2023",
      read: false,
      type: "emi",
    },
    {
      id: 2,
      title: "Health Card Balance Low",
      description: "Your health card balance is below ₹1,000. Consider topping up.",
      date: "24 Nov 2023",
      read: false,
      type: "balance",
    },
    {
      id: 3,
      title: "Hospital Visit Scheduled",
      description: "Reminder: Your appointment at City General Hospital is tomorrow at 10:00 AM",
      date: "23 Nov 2023",
      read: false,
      type: "appointment",
    },
    {
      id: 4,
      title: "Medical Report Available",
      description: "Your latest blood test report is now available for download",
      date: "20 Nov 2023",
      read: true,
      type: "report",
    },
  ];
  
  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleReadNotifications = () => {
    setNotificationCount(0);
    setShowNotifications(false);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    });
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
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
        <h1 className="text-lg font-semibold">Welcome, {patientName}</h1>
        <p className="text-sm text-muted-foreground">Health Card ID: HC-78901-23456</p>
      </div>
      <div className="flex items-center gap-4">
        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">{notificationCount}</span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Notifications</h4>
                <Button variant="ghost" size="sm" onClick={handleReadNotifications}>
                  Mark all as read
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-auto">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b last:border-0 ${notification.read ? 'bg-background' : 'bg-accent/20'}`}
                >
                  <div className="flex justify-between gap-2">
                    <h5 className="text-sm font-medium">{notification.title}</h5>
                    <span className="text-xs text-muted-foreground">{notification.date}</span>
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">{notification.description}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              )}
            </div>
            <div className="p-2 border-t">
              <Button variant="outline" size="sm" className="w-full">View all notifications</Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" /> Health Card
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Help Dialog */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Need Help?</DialogTitle>
            <DialogDescription>
              Contact our support team for assistance with your health card or loan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-accent/20 p-4 rounded-md">
              <h3 className="font-medium">Support Contact</h3>
              <p className="text-sm mt-1">Phone: 1800-123-4567</p>
              <p className="text-sm">Email: support@rimedicare.com</p>
            </div>
            <div>
              <h3 className="font-medium">Help Center</h3>
              <p className="text-sm mt-1">Visit our help center for FAQs and guides on using your health card.</p>
              <Button variant="outline" size="sm" className="mt-2">Visit Help Center</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default PatientDashboardHeader;
