
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
  Building2,
  UserPlus,
  FileCheck,
  HelpCircle,
  LogOut,
  Settings,
  CircleDollarSign,
} from "lucide-react";

type SupportSidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const SupportSidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }: SupportSidebarProps) => {
  const handleLogout = () => {
    localStorage.removeItem("supportAuthToken");
    window.location.href = "/login";
  };

  // Updated to use setActiveTab directly without Link components
  return (
    <Sidebar side="left" variant="sidebar" collapsible={isOpen ? "none" : "offcanvas"}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold">RI Medicare</div>
            <div className="text-xs text-sidebar-foreground/70">Support Portal</div>
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
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support Departments</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "patient-support"}
                onClick={() => setActiveTab("patient-support")}
              >
                <Users />
                <span>Patient Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "hospital-support"}
                onClick={() => setActiveTab("hospital-support")}
              >
                <Building2 />
                <span>Hospital Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "onboarding-support"}
                onClick={() => setActiveTab("onboarding-support")}
              >
                <UserPlus />
                <span>Onboarding Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "kyc-support"}
                onClick={() => setActiveTab("kyc-support")}
              >
                <FileCheck />
                <span>KYC Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "technical-support"}
                onClick={() => setActiveTab("technical-support")}
              >
                <Settings />
                <span>Technical Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Collection Management</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "recovery"}
                onClick={() => setActiveTab("recovery")}
              >
                <CircleDollarSign />
                <span>Recovery Team</span>
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
                  alt="Support User"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">Support Agent</div>
                <div className="text-xs text-sidebar-foreground/70">Level 2 Support</div>
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

export default SupportSidebar;
