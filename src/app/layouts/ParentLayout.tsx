import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Topbar } from '@/components/layout/topbar';
import { Sidebar } from '@/components/layout/sidebar';
import { parentNavItems } from '@/config/navigation';

export default function ParentLayout() {
  const { t } = useTranslation();
  const items = parentNavItems.map((item) => ({
    label: t(item.labelKey),
    path: item.path,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar portalLabel="Parent Portal" />
      <div className="flex flex-1">
        <Sidebar items={items} title="Parent" className="hidden md:flex" />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
