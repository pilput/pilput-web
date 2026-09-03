"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoreHorizontal, Trash, Edit, AlertTriangle } from "lucide-react";
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
import { apiClient, isHttpError } from "@/utils/fetch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getToken, RemoveToken } from "@/utils/Auth";
import type { Tags } from "@/types/post";
import { tagSchema, type TagFormData } from "@/lib/validation";

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isHttpError(error)) {
    const msg = (error.response?.data as { message?: string })?.message;
    if (msg) return msg;
  }
  return fallback;
}

const TagActionComponent = ({
  tag,
  refetchTags,
}: {
  tag: Tags;
  refetchTags: () => void;
}) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editForm = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag.name,
    },
  });

  useEffect(() => {
    if (showEditDialog) {
      editForm.reset({ name: tag.name });
    }
  }, [showEditDialog, tag, editForm]);

  function handleAuthError(error: unknown): boolean {
    if (isHttpError(error)) {
      if (error.response?.status === 401) {
        RemoveToken();
        router.push("/login");
        return true;
      }
      if (error.response?.status === 403) {
        router.push("/forbidden");
        return true;
      }
    }
    return false;
  }

  const onEditSubmit = async (data: TagFormData) => {
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      await apiClient.put(
        `/api/tags/${tag.id}`,
        { name: data.name },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      toast.success("Tag updated successfully", { id: toastId });
      setShowEditDialog(false);
      refetchTags();
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error(extractErrorMessage(error, "Failed to update tag"), {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting tag...");
    try {
      await apiClient.delete(`/api/tags/${tag.id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success("Tag deleted", { id: toastId });
      setShowDeleteDialog(false);
      refetchTags();
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error(extractErrorMessage(error, "Failed to delete tag"), {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
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
            onClick={() => setShowDeleteDialog(true)}
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
              Delete Tag
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? This action cannot be
              undone and will remove it from any posts using it.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="font-medium">{tag.name}</p>
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
              {isDeleting ? "Deleting..." : "Delete Tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the tag name. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Name</Label>
              <Input
                id="edit-tag-name"
                {...editForm.register("name")}
                placeholder="Tag name"
                maxLength={30}
              />
              {editForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.name.message}
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

export default TagActionComponent;
