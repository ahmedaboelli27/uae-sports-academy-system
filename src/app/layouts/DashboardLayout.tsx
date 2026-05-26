import { Outlet } from 'react-router-dom';
import { Topbar } from '@/components/layout/topbar';
import type { SidebarItem } from '@/components/layout/sidebar';
import { Sidebar } from '@/components/layout/sidebar';

interface DashboardLayoutProps {
  portalLabel: string;
  sidebarItems: SidebarItem[];
  sidebarTitle?: string;
}

export function DashboardLayout({
  portalLabel,
  sidebarItems,
  sidebarTitle,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar portalLabel={portalLabel} />
      <div className="flex flex-1">
        <Sidebar items={sidebarItems} title={sidebarTitle} className="hidden md:flex" />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
