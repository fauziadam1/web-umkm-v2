import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router";

export default function AuthProtect({ children }) {
  const { user } = useAuth();

  if (user) return <Navigate to={"/"} />;

  return children;
}
