import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router";

export function AdminProtectPage({ children }) {
  const { user } = useAuth();

  if (user.role !== "admin") {
    return <Navigate to={"/"} />;
  }

  return children;
}
