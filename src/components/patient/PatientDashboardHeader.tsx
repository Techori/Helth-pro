import { useEffect, useState } from "react";
import { Bell, Menu, User, CreditCard, LogOut, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { fetchNotifications, markNotificationsAsRead, deleteNotification, Notification } from "@/services/notificationService";

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
  const { signOut, authState } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReadNotifications = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n._id);

      if (unreadIds.length === 0) return;

      await markNotificationsAsRead(unreadIds);
      
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          read: true
        }))
      );

      toast({
        title: "Notifications Updated",
        description: "All notifications have been marked as read.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast({
        title: "Notification Deleted",
        description: "The notification has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = (path: string) => {
    navigate(path);
    setShowNotifications(false);
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Notifications</h4>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReadNotifications}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-80 overflow-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent mx-auto" />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification._id} 
                    className={`p-4 border-b last:border-0 ${
                      notification.read ? 'bg-background' : 'bg-accent/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h5 className="text-sm font-medium">{notification.title}</h5>
                        <p className="text-xs mt-1 text-muted-foreground">
                          {notification.description}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {new Date(notification.date).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              )}
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
            <DropdownMenuItem onClick={() => handleProfileClick('/health-card')} className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" /> Health Card
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleProfileClick('/profile')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-500" 
              onClick={handleLogout}
            >
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
