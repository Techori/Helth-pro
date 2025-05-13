import { Bell, ChevronDown, Menu, MessageSquare, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SalesTeamDashboardHeaderProps {
  userName: string;
  userRole?: string;
  targetAchieved?: number;
  pendingLeads?: number;
  toggleSidebar: () => void;
}

const SalesTeamDashboardHeader = ({ 
  userName, 
  userRole = "Sales Executive",
  targetAchieved = 0, 
  pendingLeads = 0,
  toggleSidebar 
}: SalesTeamDashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="outline"
        size="icon"
        className="mr-2 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-semibold">RI Medicare Sales Portal</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-6 mx-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Target</div>
          <div className="w-40">
            <div className="flex justify-between mb-1 text-xs">
              <span>{targetAchieved}% achieved</span>
              <span>100%</span>
            </div>
            <Progress value={targetAchieved} className="h-2" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Pending</div>
          <Badge variant="outline">{pendingLeads} leads</Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="outline" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center">
            2
          </Badge>
          <span className="sr-only">Messages</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 md:pl-4">
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
                <span className="text-xs">{userRole}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Commission Structure</DropdownMenuItem>
            <DropdownMenuItem>Sales Targets</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default SalesTeamDashboardHeader;
