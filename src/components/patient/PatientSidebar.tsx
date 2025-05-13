
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
  // Updated to prevent default behavior and use tab change directly
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
                isActive={activeTab === "overview"}
                onClick={() => onTabChange("overview")}
              >
                <Activity />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "health-card"}
                onClick={() => onTabChange("health-card")}
              >
                <CreditCard />
                <span>My Health Card</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "loans"}
                onClick={() => onTabChange("loans")}
              >
                <FileText />
                <span>My Loans</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Healthcare</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "hospital-visits"}
                onClick={() => onTabChange("hospital-visits")}
              >
                <Calendar />
                <span>Hospital Visits</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => onTabChange("medical-records")}
                isActive={activeTab === "medical-records"}
              >
                <FileText />
                <span>Medical Records</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => onTabChange("notifications")}
                isActive={activeTab === "notifications"}
              >
                <Bell />
                <span>Notifications</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => onTabChange("settings")}
                isActive={activeTab === "settings"}
              >
                <Settings />
                <span>Settings</span>
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
                  alt="Patient Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-sidebar-foreground/70">Patient</div>
              </div>
            </div>
            <button className="text-gray-500 hover:text-red-500">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PatientSidebar;
