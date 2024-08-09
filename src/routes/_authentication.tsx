import {
  createFileRoute,
  Navigate,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useAuthentication } from "../hooks/useAuthentication";

export const AuthRoute: React.FC = () => {
  const { state } = useAuthentication();
  const { pathname } = useLocation();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" search={{ redirect: pathname }} replace />;
  }

  return <Outlet />;
};
export const Route = createFileRoute("/_authentication")({
  component: AuthRoute,
});
