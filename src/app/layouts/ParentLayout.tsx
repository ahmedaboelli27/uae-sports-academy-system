import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { parentNavItems } from '@/config/navigation';

export default function ParentLayout() {
  const { t } = useTranslation();

  const items = parentNavItems.map((item) => ({
    ...item,
    label: t(item.labelKey, {
      defaultValue: item.label,
    }),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Topbar portalLabel="Parent Portal" />

      <div className="flex flex-1">
        <Sidebar items={items} title="Parent" currentRole="parent" />

        <main className="min-w-0 flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}