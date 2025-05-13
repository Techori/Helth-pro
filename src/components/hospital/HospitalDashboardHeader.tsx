import { Bell, Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HospitalDashboardHeaderProps {
  hospitalName: string;
  toggleSidebar: () => void;
}

const HospitalDashboardHeader = ({
  hospitalName,
  toggleSidebar,
}: HospitalDashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4 lg:hidden"
          >
            <Menu size={20} />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {hospitalName} Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="py-2">
                  <div>
                    <p className="font-medium text-sm">New payment received</p>
                    <p className="text-xs text-gray-500">Patient ID: P12345 - ₹5,000</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  <div>
                    <p className="font-medium text-sm">EMI disbursement completed</p>
                    <p className="text-xs text-gray-500">Loan ID: L78901 - ₹15,000</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  <div>
                    <p className="font-medium text-sm">Low wallet balance alert</p>
                    <p className="text-xs text-gray-500">Hospital Wallet below ₹10,000</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium text-brand-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-brand-100 text-brand-700">
                    CH
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default HospitalDashboardHeader;
