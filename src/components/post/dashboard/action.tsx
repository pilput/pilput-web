import Link from "next/link";
import { MoreHorizontal, Eye, Trash, Send, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { axiosInstance2 } from "@/utils/fetch";
import { toast } from "sonner";
import { getToken } from "@/utils/Auth";
import type { Post } from "@/types/post";

const ActionComponent = ({
  post,
  refetchPosts,
}: {
  post: Post;
  refetchPosts: () => void;
}) => {
  const onPublish = async () => {
    const id = toast.loading("Updating publish...");
    try {
      const response = await axiosInstance2.patch(
        `/v1/posts/${post.id}`,
        {
          published: !post.published,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      refetchPosts();
      toast.success("Update publish", { id });
    } catch (error) {
      console.log(error);
      toast.error("Error update publish", { id });
    }
  };

  const onDelete = async () => {
    const id = toast.loading("Deleting...");
    try {
      const response = await axiosInstance2.delete(`/v1/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
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
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            className="flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>View</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/dashboard/posts/edit/${post.id}`}
            className="flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onPublish}>
          <Send className="mr-2 h-4 w-4" />
          {post.published ? <span>Unpublish</span> : <span>Publish</span>}
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
