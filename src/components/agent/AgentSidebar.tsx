
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Activity, FileText, Target, Settings, LogOut, UserPlus, DollarSign } from "lucide-react";

type AgentSidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const AgentSidebar = ({ isOpen, setIsOpen }: AgentSidebarProps) => {
  const handleLogout = () => {
    localStorage.removeItem("agentAuthToken");
    window.location.href = "/login";
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isOpen ? "none" : "offcanvas"}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold">RI Medicare</div>
            <div className="text-xs text-sidebar-foreground/70">Agent Portal</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/agent-dashboard">
                  <Activity />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Business</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/agent-dashboard?tab=referrals">
                  <UserPlus />
                  <span>Referrals</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/agent-dashboard?tab=commissions">
                  <DollarSign />
                  <span>Commissions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/agent-dashboard?tab=settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="mx-4 mb-2 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200">
                <img
                  src="https://github.com/shadcn.png"
                  alt="Agent User"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">Rahul Sharma</div>
                <div className="text-xs text-sidebar-foreground/70">Agent ID: AGT-001</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-medicare-500"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AgentSidebar;
