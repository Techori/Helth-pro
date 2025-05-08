
import { Link, useLocation } from "react-router-dom";
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
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LineChart,
  Calendar,
  Settings,
  LogOut,
  Target,
  BarChart2,
  Mail,
} from "lucide-react";

type CrmSidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CrmSidebar = ({ isOpen, setIsOpen }: CrmSidebarProps) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const activeTab = query.get("tab") || "overview";
  
  const handleLogout = () => {
    localStorage.removeItem("crmAuthToken");
    window.location.href = "/login";
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isOpen ? "none" : "offcanvas"}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold">RI Medicare</div>
            <div className="text-xs text-sidebar-foreground/70">CRM Portal</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "overview"}>
                <Link to="/crm-dashboard">
                  <LayoutDashboard />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Customer Management</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "leads"}>
                <Link to="/crm-dashboard?tab=leads">
                  <UserPlus />
                  <span>Lead Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "customers"}>
                <Link to="/crm-dashboard?tab=customers">
                  <Users />
                  <span>Customer Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "opportunities"}>
                <Link to="/crm-dashboard?tab=opportunities">
                  <Target />
                  <span>Opportunities</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sales Activities</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "presales"}>
                <Link to="/crm-dashboard?tab=presales">
                  <LineChart />
                  <span>Presales Activities</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "campaigns"}>
                <Link to="/crm-dashboard?tab=campaigns">
                  <Mail />
                  <span>Campaign Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Planning & Analytics</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "tasks"}>
                <Link to="/crm-dashboard?tab=tasks">
                  <Calendar />
                  <span>Tasks & Calendar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "reporting"}>
                <Link to="/crm-dashboard?tab=reporting">
                  <BarChart2 />
                  <span>Reporting</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === "settings"}>
                <Link to="/crm-dashboard?tab=settings">
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
                  alt="CRM User"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">Priya Sharma</div>
                <div className="text-xs text-sidebar-foreground/70">Relationship Manager</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default CrmSidebar;
