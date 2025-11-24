import React from "react";
import Link from "next/link";
import { MoreHorizontal, Eye, Trash, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { axiosInstence } from "@/utils/fetch";
import toast from "react-hot-toast";
import type { User } from "@/types/user";

const UserActionComponent = ({
  user,
  auth,
  refetchUsers
}: {
  user: User;
  auth: User | undefined;
  refetchUsers: () => void;
}) => {
  const onDelete = async () => {
    const toastid = toast.loading("Loading...");
    const response = await axiosInstence.delete("/v1/users/" + user.id);
    if (response.status === 200) {
      toast.success("User Deleted", { id: toastid });
      refetchUsers();
    } else if (response.status === 403) {
      toast.error("Forbidden action", { id: toastid });
    } else {
      toast.error("Failed", { id: toastid });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link
            href={`/${user.username}`}
            className="flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        {auth?.issuperadmin && (
          <>
            <DropdownMenuItem>
              <Link href={`/dashboard/users/edit/${user.id}`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={onDelete}
              disabled={user.id === auth.id}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionComponent;