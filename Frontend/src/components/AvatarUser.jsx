import { getUser } from "@/lib/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { logout } from "@/lib/auth";
import { LogOutIcon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AvaterUser() {
  const user = getUser();

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
          <DropdownMenuItem>
            <User2Icon />
            Profile
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
