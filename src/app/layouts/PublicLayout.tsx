import { PublicFooter } from '@/components/layout/public-footer';
import PublicHeader from '@/components/layout/public-header';
import { Outlet, useLocation } from 'react-router-dom';

export default function PublicLayout() {
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
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