import { HandCoins } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth";
import { AvaterUser } from "./AvatarUser";

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="fixed w-full flex items-center justify-between border-b bg-white px-5 py-3">
      <Link to={"/"} className="flex items-center gap-2">
        <div className="w-7 h-7">
          <HandCoins className="bg-primary p-1.5 w-full h-full rounded-md text-white" />
        </div>
        <h1 className="font-semibold">Danaku</h1>
      </Link>
      <div>
        {user ? (
          <AvaterUser />
        ) : (
          <div className="flex items-center gap-2">
            <Link to={"/register"}>
              <Button variant="outline">Register</Button>
            </Link>
            <Link to={"/login"}>
              <Button>Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
