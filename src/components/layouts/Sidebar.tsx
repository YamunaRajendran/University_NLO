"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  AcademicCapIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  BookOpenIcon, 
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { useSidebar } from '@/app/context/SidebarContext';
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

interface NavigationItem {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>>;
  color: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/overview',
    icon: ChartBarIcon,
    color: 'from-[#2AB1BB] to-[#2E6BB2]'
  },
  {
    name: 'Majors',
    href: '/majors',
    icon: BookOpenIcon,
    color: 'from-[#2AB1BB] to-[#2E6BB2]'
  },
  {
    name: 'Education',
    href: '/education',
    icon: AcademicCapIcon,
    color: 'from-[#2AB1BB] to-[#2E6BB2]'
  },
  {
    name: 'Compare',
    href: '/comparison',
    icon: ArrowsRightLeftIcon,
    color: 'from-[#2AB1BB] to-[#2E6BB2]'
  }
];

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <aside 
      className={`fixed opacity-95 backdrop-blur-sm left-0 top-0 h-screen bg-[#21265E] text-white transition-all duration-300 
      ${isCollapsed ? 'w-20' : 'w-60'} 
      shadow-xl z-50`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-[#2E6BB2]/30">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="h-10 w-10 text-white" aria-hidden={true} />
              <span className="font-['Neo_Sans_Arabic_Medium'] text-2xl text-white">
                NLO
              </span>
            </div>
          ) : (
            <AcademicCapIcon className="h-10 w-10 text-white" aria-hidden={true} />
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="py-6">
        <nav className="space-y-2 px-3">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? `bg-gradient-to-r ${item.color} shadow-lg` 
                  : 'hover:bg-[#2E6BB2]/20'
                } 
                group relative
                ${isCollapsed ? 'justify-center' : ''}`}
              >
                <IconComponent 
                  className={`h-6 w-6 transition-all duration-200
                  ${isActive ? 'text-white' : 'text-[#2AB1BB] group-hover:text-white'}`}
                  aria-hidden={true}
                />
                
                {!isCollapsed && (
                  <span className={`ml-3 transition-all duration-200 font-['Neo_Sans_Arabic'] text-lg
                    ${isActive ? 'text-white font-medium' : 'text-[#2AB1BB] group-hover:text-white'}`}
                  >
                    {item.name}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-6 hidden group-hover:block z-50">
                    <div className="bg-[#21265E] text-white text-sm px-4 py-2 rounded-md whitespace-nowrap shadow-lg border border-[#2E6BB2]/30 font-['Neo_Sans_Arabic']">
                      {item.name}
                    </div>
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 
                      border-8 border-transparent border-r-[#21265E]"/>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-12 bg-[#21265E] rounded-full p-1.5 
        hover:bg-[#2E6BB2]/20 transition-colors duration-200 shadow-lg
        border border-[#2E6BB2]/30`}
      >
        {isCollapsed 
          ? <ChevronRightIcon className="h-4 w-4 text-[#2AB1BB]" aria-hidden={true} />
          : <ChevronLeftIcon className="h-4 w-4 text-[#2AB1BB]" aria-hidden={true} />
        }
      </button>
    </aside>
  );
}
