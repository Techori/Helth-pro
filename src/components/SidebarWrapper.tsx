
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

interface SidebarWrapperProps {
  children: React.ReactNode;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </SidebarProvider>
  );
};

export default SidebarWrapper;
