import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogOutIcon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";

export function AvaterUser() {
  const { user } = useAuth();
  const { logout } = useAuth();

  const handlelogout = async () => {
    logout();

    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <Avatar>
            <AvatarFallback>
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-translate-x-5">
          <DropdownMenuItem asChild>
            <Link to={"/profile"}>
              <User2Icon />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handlelogout()}
          >
            <LogOutIcon className="text-destructive" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
