import { getUser } from "@/lib/auth";
import { Navigate } from "react-router";

export default function AuthProtect({ children }) {
  const user = getUser();

  if (user) return <Navigate to={"/"} />;

  return children;
}
