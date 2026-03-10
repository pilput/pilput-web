import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Eye, Trash, Edit, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance, axiosInstance3 } from "@/utils/fetch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getToken } from "@/utils/Auth";
import type { User } from "@/types/user";
import { editUserSchema, type EditUserFormData } from "@/lib/validation";

const UserActionComponent = ({
  user,
  auth,
  refetchUsers,
}: {
  user: User;
  auth?: User;
  refetchUsers: (offset?: number) => void;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editForm = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
    },
  });

  useEffect(() => {
    if (showEditDialog) {
      editForm.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
      });
    }
  }, [showEditDialog, user, editForm]);

  const onEditSubmit = async (data: EditUserFormData) => {
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      await axiosInstance3.put(
        `/v1/users/${user.id}`,
        { ...data, is_super_admin: user.is_super_admin },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      toast.success("User updated successfully", { id: toastId });
      setShowEditDialog(false);
      refetchUsers();
    } catch (error) {
      toast.error("Failed to update user", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    const toastid = toast.loading("Deleting user...");
    try {
      const response = await axiosInstance.delete("/v1/users/" + user.id);
      if (response.status === 200) {
        toast.success("User Deleted", { id: toastid });
        setShowDeleteDialog(false);
        refetchUsers();
      } else if (response.status === 403) {
        toast.error("Forbidden action", { id: toastid });
      } else {
        toast.error("Failed", { id: toastid });
      }
    } catch (error) {
      toast.error("Failed to delete user", { id: toastid });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  return (
    <>
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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600"
            onClick={handleDeleteClick}
            disabled={user.id === auth?.id}
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-first_name">First name</Label>
                <Input
                  id="edit-first_name"
                  {...editForm.register("first_name")}
                  placeholder="First name"
                />
                {editForm.formState.errors.first_name && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last_name">Last name</Label>
                <Input
                  id="edit-last_name"
                  {...editForm.register("last_name")}
                  placeholder="Last name"
                />
                {editForm.formState.errors.last_name && (
                  <p className="text-sm text-destructive">
                    {editForm.formState.errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                {...editForm.register("username")}
                placeholder="Username"
              />
              {editForm.formState.errors.username && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                {...editForm.register("email")}
                placeholder="Email"
              />
              {editForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserActionComponent;
