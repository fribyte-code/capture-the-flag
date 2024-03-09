import { ReactNode } from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedProps {
  scope?: "admin" | "user";
}
export default function Protected({ scope = "user" }: ProtectedProps) {
  const { isLoading, hasFetched, me } = useAuth();

  if (isLoading || !hasFetched) {
    return <p>Loading profile</p>;
  }
  if (!me) {
    return <Navigate to="/login" />;
  }
  if (scope === "admin" && !me.isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
