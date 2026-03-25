"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { postsStore } from "@/stores/posts-store";
import { useEffect, useState, useMemo } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import Link from "next/link";
import ActionComponent from "@/components/post/dashboard/action";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paginate } from "@/components/common/Paginate";

export default function Posts() {
  const limit = 15;
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [status, setStatus] = useState("all");
  const poststore = postsStore();
  const currentPage = Math.floor(offset / limit) + 1;

  useEffect(() => {
    poststore.fetch(limit, offset);
  }, [offset]);

  function changeOffset(newOffset: number) {
    if (newOffset >= 0 && newOffset < poststore.total) {
      setOffset(newOffset);
    }
  }

  const refetchPosts = () => {
    poststore.fetch(limit, offset);
  };

  const filteredPosts = useMemo(() => {
    return poststore.posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesStatus =
        status === "all" ||
        (status === "published" && post.published) ||
        (status === "draft" && !post.published);
      return matchesSearch && matchesStatus;
    });
  }, [poststore.posts, debouncedSearch, status]);

  return (
    <div className="mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
      <Card className="">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-xl sm:text-2xl font-bold">Posts</CardTitle>
            <Link href="/dashboard/posts/create" className="w-full sm:w-auto">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add new post
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <div className="overflow-x-auto -mx-2 sm:-mx-4 md:-mx-6">
            <div className="min-w-[800px] px-2 sm:px-4 md:px-6">
              <TooltipProvider>
              <Table>
                <TableCaption>Total {poststore.total} posts found</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    <TableHead className="text-center">Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        {poststore.posts.indexOf(post) + 1 + offset}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="max-w-[200px] sm:max-w-[300px] md:max-w-[400px] truncate font-medium">
                              {post.title}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[320px] wrap-break-word">{post.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {post.published ? (
                          <Badge
                            variant="default"
                            className="border-0 bg-emerald-600 text-white shadow-sm dark:bg-emerald-500"
                          >
                            Published
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-amber-500/50 bg-amber-500/10 text-amber-800 dark:border-amber-400/50 dark:bg-amber-500/15 dark:text-amber-200"
                          >
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <code className="block max-w-[150px] lg:max-w-[280px] truncate rounded bg-muted px-1.5 py-0.5 text-xs">
                              /{post.slug}
                            </code>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[320px] break-all">/{post.slug}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm hidden lg:table-cell">
                        {format(post.created_at, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm hidden lg:table-cell">
                        {format(post.updated_at, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {post.view_count ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionComponent post={post} refetchPosts={refetchPosts} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </TooltipProvider>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {offset + 1} to{" "}
              {Math.min(offset + limit, poststore.total)} of {poststore.total}{" "}
              posts
            </div>
            <Paginate
              prev={() => changeOffset(offset - limit)}
              next={() => changeOffset(offset + limit)}
              goToPage={(page: number) => changeOffset(page * limit)}
              limit={limit}
              offset={offset}
              total={poststore.total}
              length={poststore.posts.length}
              currentPage={currentPage - 1}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
