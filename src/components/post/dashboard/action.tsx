import React from "react";
import { MoreHorizontal, Eye, Trash, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { axiosIntence2 } from "@/utils/fetch";
import toast from "react-hot-toast";

const ActionComponent = ({ post }: { post: Post }) => {
  const onPublish = async () => {
    const id = toast.loading("Updating publish...");
    try {
      const response = await axiosIntence2.patch(`/posts/${post.id}`, {
        published: !post.published,
      });
      toast.success("Update publish", { id });
    } catch (error) {
      console.log(error);
      toast.error("Error update publish", { id });
    }
  };

  const onDelete = async () => {
    const id = toast.loading("Deleting...");
    try {
      const response = await axiosIntence2.delete(`/posts/${post.id}`);
      toast.success("Delete post", { id });
    } catch (error) {
      console.log(error);
      toast.error("Error delete post", { id });
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
          <a href={`/blogs/${post.slug}`} target="_blank" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            <span>View</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onPublish}>
          <Send className="mr-2 h-4 w-4" />
          {post.published ? <span>Publish</span> : <span>Unpublish</span>}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionComponent;
