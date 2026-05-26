import { PublicFooter } from '@/components/layout/public-footer';
import PublicHeader from '@/components/layout/public-header';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
