import { ROLE_HOME_PATH, ROUTE_PATHS } from '@/app/router/route-paths';
import { useAuthStore } from '@/store';
import { Navigate } from 'react-router-dom';

export function RoleBasedRedirect() {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated || role === 'guest') {
    return <Navigate to={ROUTE_PATHS.auth.login} replace />;
  }

  const home = ROLE_HOME_PATH[role];
  return <Navigate to={home} replace />;
}
