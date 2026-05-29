import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { coachNavItems } from '@/config/navigation';

export default function CoachLayout() {
  const { t } = useTranslation();

  const items = coachNavItems.map((item) => ({
    ...item,
    label: t(item.labelKey, {
      defaultValue: item.label,
    }),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Topbar portalLabel="Coach Portal" />

      <div className="flex flex-1">
        <Sidebar items={items} title="Coach" currentRole="coach" />

        <main className="min-w-0 flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}