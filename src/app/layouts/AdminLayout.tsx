import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import {
  Sidebar,
  type SidebarItem,
  type SidebarRole,
} from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { adminNavItems } from '@/config/navigation';
import { useAuthStore } from '@/store';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { currentUser } = useAuthStore();

  const currentRole = currentUser?.role as SidebarRole | undefined;

  const items: SidebarItem[] = adminNavItems.map((item) => ({
    label: item.labelKey.replace('nav.', ''),
    path: item.path,
    allowedRoles:
      'allowedRoles' in item
        ? ([...item.allowedRoles] as SidebarRole[])
        : undefined,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar
        portalLabel={t('topbar.adminPortal', {
          defaultValue: 'Admin Portal',
        })}
        logoSrc="/logo.png"
      />

      <div className="flex min-h-[calc(100vh-5rem)]">
        <Sidebar
          items={items}
          title={t('sidebar.title', {
            defaultValue: 'Admin Panel',
          })}
          currentRole={currentRole}
        />

        <main className="min-w-0 flex-1 overflow-auto bg-gradient-to-br from-background via-background to-secondary/30">
          <div className="mx-auto w-full max-w-[1600px] p-4 lg:p-6 xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}