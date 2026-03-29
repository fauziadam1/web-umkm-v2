import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router";

export function ManagerProtectPage({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "manager") {
    return <Navigate to={"/"} />;
  }

  return children;
}
