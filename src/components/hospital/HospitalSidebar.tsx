
import { Link, useLocation } from "react-router-dom";
import {
  Wallet,
  CreditCard,
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  PersonStanding,
  FilePlus,
  HeartPulse,
  HelpCircle,
  BarChart4,
  Settings,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const HospitalSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const activeTab = query.get('tab') || '';
  
  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible={isOpen ? "none" : "offcanvas"}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold">RI Medicare</div>
            <div className="text-xs text-sidebar-foreground/70">Hospital Portal</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === ''}>
                <Link to="/hospital-dashboard">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'patients'}>
                <Link to="/hospital-dashboard?tab=patients">
                  <PersonStanding size={20} />
                  <span>Patient Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'health-cards'}>
                <Link to="/hospital-dashboard?tab=health-cards">
                  <HeartPulse size={20} />
                  <span>Health Cards</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'payments'}>
                <Link to="/hospital-dashboard?tab=payments">
                  <CreditCard size={20} />
                  <span>Process Payment</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'loans'}>
                <Link to="/hospital-dashboard?tab=loans">
                  <FilePlus size={20} />
                  <span>Loan Applications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Finance</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'wallet'}>
                <Link to="/hospital-dashboard?tab=wallet">
                  <Wallet size={20} />
                  <span>Wallet Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'transactions'}>
                <Link to="/hospital-dashboard?tab=transactions">
                  <ClipboardList size={20} />
                  <span>Transactions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'reports'}>
                <Link to="/hospital-dashboard?tab=reports">
                  <BarChart4 size={20} />
                  <span>Reports & Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Compliance & Support</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'compliance'}>
                <Link to="/hospital-dashboard?tab=compliance">
                  <Shield size={20} />
                  <span>Compliance</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'support'}>
                <Link to="/hospital-dashboard?tab=support">
                  <HelpCircle size={20} />
                  <span>Support & Disputes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'users'}>
                <Link to="/hospital-dashboard?tab=users">
                  <Users size={20} />
                  <span>User Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={activeTab === 'settings'}>
                <Link to="/hospital-dashboard?tab=settings">
                  <Settings size={20} />
                  <span>Hospital Settings</span>
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
                  alt="Hospital User"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">Hospital Admin</div>
                <div className="text-xs text-sidebar-foreground/70">City General Hospital</div>
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

export default HospitalSidebar;
