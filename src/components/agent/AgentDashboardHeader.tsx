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
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AgentDashboardHeaderProps {
  agentName: string;
  agentId: string;
  totalReferrals: number;
  conversionRate: number;
  toggleSidebar: () => void;
}

const AgentDashboardHeader = ({
  agentName,
  agentId,
  totalReferrals,
  conversionRate,
  toggleSidebar
}: AgentDashboardHeaderProps) => {
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
        <h1 className="text-xl font-semibold">RI Medicare Agent Portal</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-6 mx-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Referrals</div>
          <Badge variant="outline">{totalReferrals} total</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">Conversion</div>
          <Badge variant="outline">{conversionRate}%</Badge>
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
                <AvatarImage src="https://github.com/shadcn.png" alt={agentName} />
                <AvatarFallback>
                  {agentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">{agentName}</span>
                <span className="text-xs">{agentId}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Commission Structure</DropdownMenuItem>
            <DropdownMenuItem>Commission History</DropdownMenuItem>
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

export default AgentDashboardHeader;
