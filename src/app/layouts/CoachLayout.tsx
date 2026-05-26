import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Topbar } from '@/components/layout/topbar';
import { Sidebar } from '@/components/layout/sidebar';
import { coachNavItems } from '@/config/navigation';

export default function CoachLayout() {
  const { t } = useTranslation();
  const items = coachNavItems.map((item) => ({
    label: t(item.labelKey),
    path: item.path,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar portalLabel="Coach Portal" />
      <div className="flex flex-1">
        <Sidebar items={items} title="Coach" className="hidden md:flex" />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
