import { useAuthStore } from "@/features/auth/pages/auth.store";
import type { UserRole } from "@/types/role.types";
import { hasPermission, ROLE_REDIRECT_PATHS } from "@/types/role.types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  requiredPermission?: string;
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  requiredPermission,
  children,
}: ProtectedRouteProps) {
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  if (!isAuthenticated || !role) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  /**
   * Admin has full access to everything.
   */
  if (role === "admin") {
    return children ? <>{children}</> : <Outlet />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_REDIRECT_PATHS[role]} replace />;
  }

  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    return <Navigate to={ROLE_REDIRECT_PATHS[role]} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}