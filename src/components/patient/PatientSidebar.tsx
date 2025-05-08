
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
import { User, CreditCard, FileText, Activity, Calendar, Bell, Settings, LogOut } from "lucide-react";

type PatientSidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const PatientSidebar = ({ isOpen, setIsOpen, activeTab, onTabChange }: PatientSidebarProps) => {
  const handleItemClick = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onTabChange(tab);
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isOpen ? "none" : "offcanvas"}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold">RI Medicare</div>
            <div className="text-xs text-sidebar-foreground/70">Patient Portal</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={activeTab === "overview"}
                onClick={handleItemClick("overview")}
              >
                <Link to="/patient-dashboard">
                  <Activity />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={activeTab === "health-card"}
                onClick={handleItemClick("health-card")}
              >
                <Link to="/patient-dashboard?tab=health-card">
                  <CreditCard />
                  <span>My Health Card</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={activeTab === "loans"}
                onClick={handleItemClick("loans")}
              >
                <Link to="/patient-dashboard?tab=loans">
                  <FileText />
                  <span>My Loans</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Healthcare</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={activeTab === "hospital-visits"}
                onClick={handleItemClick("hospital-visits")}
              >
                <Link to="/patient-dashboard?tab=hospital-visits">
                  <Calendar />
                  <span>Hospital Visits</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="#">
                  <FileText />
                  <span>Medical Records</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={activeTab === "profile"}
                onClick={handleItemClick("profile")}
              >
                <Link to="/patient-dashboard?tab=profile">
                  <User />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="#">
                  <Bell />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="mx-4 mb-2 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200">
              <img
                src="https://github.com/shadcn.png"
                alt="User"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-sidebar-foreground/70">Patient</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PatientSidebar;
