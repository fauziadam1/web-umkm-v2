import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router";
import { toast } from "sonner";

export function ProtectPage({ children }) {
  const { user } = useAuth();

  if (!user) {
    toast.info("Login terlebih dahulu");
    return <Navigate to={"/login"} />;
  }

  return children;
}
