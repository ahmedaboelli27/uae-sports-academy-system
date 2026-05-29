import { PublicFooter } from '@/components/layout/public-footer';
import PublicHeader from '@/components/layout/public-header';
import { useSiteSettings } from '@/features/settings/hooks/use-site-settings';
import { Outlet, useLocation } from 'react-router-dom';

export default function PublicLayout() {
  const location = useLocation();
  const { settings } = useSiteSettings();

  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {settings.system.maintenanceMode ? (
        <div className="bg-amber-500 px-4 py-2 text-center text-sm font-bold text-black">
          The public website is currently in maintenance mode. Some actions may be temporarily unavailable.
        </div>
      ) : null}
      <PublicHeader />

      <main className="flex-1">
        {isHomePage ? (
          <Outlet />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}