
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SupportDashboardHeaderProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SupportDashboardHeader = ({
  isOpen,
  setIsOpen,
}: SupportDashboardHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4">
      <div className="mx-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Support Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 py-2 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all w-64"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-auto">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div>
                    <p className="font-medium text-sm">New support ticket #1289</p>
                    <p className="text-xs text-gray-500">Patient ID verification issue</p>
                    <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div>
                    <p className="font-medium text-sm">Hospital onboarding request</p>
                    <p className="text-xs text-gray-500">New hospital registration pending review</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div>
                    <p className="font-medium text-sm">KYC verification pending</p>
                    <p className="text-xs text-gray-500">15 new KYC requests need review</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">
                <span className="text-brand-600 text-sm font-medium">View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="https://github.com/shadcn.png"
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="hidden md:inline font-medium text-sm">Raj Sharma</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default SupportDashboardHeader;
