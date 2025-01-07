"use client";

import { useSidebar } from '@/app/context/SidebarContext';
import { Header } from './Header';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <main 
      className={`flex-1 transition-all duration-300 
      ${isCollapsed ? 'ml-20' : 'ml-60'} 
      min-h-screen relative z-10`}
    >
      <Header />
      <div className="h-full w-full bg-navy/10 backdrop-blur-sm shadow-xl border border-white/10 relative z-20">
        {children}
      </div>
    </main>
  );
}
