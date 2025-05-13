import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search, MessageSquare, ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type CrmDashboardHeaderProps = {
  userName: string;
  toggleSidebar: () => void;
};

const CrmDashboardHeader = ({ userName, toggleSidebar }: CrmDashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="outline"
        size="icon"
        className="mr-2 h-8 w-8 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <div className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-lg pl-8 md:w-80"
          />
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              5
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8"
          >
            <MessageSquare className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt={userName} />
                  <AvatarFallback>
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs">Relationship Manager</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Performance Metrics</DropdownMenuItem>
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

export default CrmDashboardHeader;
