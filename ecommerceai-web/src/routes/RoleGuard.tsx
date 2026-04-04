import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "../types/domain";
import { useAuth } from "../auth/AuthContext";
import { getRoleHomePath } from "../auth/roleHome";

interface RoleGuardProps {
  roles?: UserRole[];
}

export function RoleGuard({ roles }: RoleGuardProps) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to={getRoleHomePath(role)} replace />;
  }

  return <Outlet />;
}

