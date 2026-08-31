"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, Heart, Plus, Search, Tag as TagIcon, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import type { Tags } from "@/types/post";
import TagActionComponent from "@/components/tag/action";
import { tagSchema, type TagFormData } from "@/lib/validation";

interface TrendingTag {
  id: number;
  name: string;
  total_views: number;
  total_likes: number;
  trending_score: number;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isHttpError(error)) {
    const msg = (error.response?.data as { message?: string })?.message;
    if (msg) return msg;
  }
  return fallback;
}

export default function ManageTags() {
  const [tags, setTags] = useState<Tags[]>([]);
  const [trending, setTrending] = useState<TrendingTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const createForm = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "" },
  });

  const filteredTags = useMemo(() => {
    if (!search) return tags;
    const q = search.toLowerCase();
    return tags.filter((tag) => tag.name.toLowerCase().includes(q));
  }, [tags, search]);

  function handleAuthError(error: unknown): boolean {
    if (isHttpError(error)) {
      if (error.response?.status === 401) {
        RemoveToken();
        window.location.href = "/login";
        return true;
      }
      if (error.response?.status === 403) {
        window.location.href = "/forbidden";
        return true;
      }
    }
    return false;
  }

  async function fetchTags() {
    setIsLoading(true);
    try {
      const { data: response } = await apiClient.get<{
        success: boolean;
        data?: Tags[];
      }>("/api/tags");
      if (response.success && Array.isArray(response.data)) {
        setTags(response.data);
      } else {
        toast.error("Cannot connect to server");
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTrending() {
    try {
      const { data: response } = await apiClient.get<{
        success: boolean;
        data?: TrendingTag[];
      }>("/api/tags/trending");
      if (response.success && Array.isArray(response.data)) {
        setTrending(response.data);
      }
    } catch {
      // Trending stats are a nice-to-have; silently ignore failures.
    }
  }

  useEffect(() => {
    fetchTags();
    fetchTrending();
  }, []);

  function closeModal() {
    setModalOpen(false);
    createForm.reset();
  }

  async function submitCreateTag(data: TagFormData) {
    setIsCreating(true);
    const toastId = toast.loading("Creating tag...");
    try {
      await apiClient.post(
        "/api/tags",
        { name: data.name },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      toast.success("Tag created successfully", { id: toastId });
      closeModal();
      fetchTags();
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error(extractErrorMessage(error, "Failed to create tag"), {
        id: toastId,
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Tag Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage the tags used to categorize posts across the platform.
          </p>
        </div>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto font-semibold shrink-0">
              <Plus className="h-4 w-4" />
              Create tag
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create tag</DialogTitle>
              <DialogDescription>
                Add a new tag that authors can attach to their posts.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={createForm.handleSubmit(submitCreateTag)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="tag-name">Name</Label>
                <Input
                  id="tag-name"
                  {...createForm.register("name")}
                  placeholder="e.g. technology"
                  maxLength={30}
                  autoFocus
                />
                {createForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeModal}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create tag"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card border-glow-hover rounded-2xl transition-all duration-300 group flex items-center justify-between p-5">
          <div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Total Tags
            </span>
            {isLoading ? (
              <Skeleton className="h-7 w-16 mt-1.5" />
            ) : (
              <div className="text-2xl font-bold tracking-tight text-foreground mt-1.5">
                {tags.length}
              </div>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 ring-1 ring-border/40 group-hover:scale-105 transition-transform">
            <TagIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="glass-card border-glow-hover rounded-2xl transition-all duration-300 group flex items-center justify-between p-5">
          <div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Trending Tags
            </span>
            <div className="text-2xl font-bold tracking-tight text-foreground mt-1.5">
              {trending.length}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-border/40 group-hover:scale-105 transition-transform">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Trending tags */}
      {trending.length > 0 && (
        <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
          <CardHeader className="border-b border-border/50 py-5">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending Tags
            </CardTitle>
            <CardDescription className="text-sm">
              Tags with the most engagement right now.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-2">
              {trending.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs font-normal py-1.5 px-2.5 flex items-center gap-2"
                >
                  {tag.name}
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {tag.total_views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="h-3 w-3" />
                    {tag.total_likes.toLocaleString()}
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags table */}
      <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
        <CardHeader className="p-5 border-b border-border/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6">
          <div className="overflow-x-auto -mx-2 sm:-mx-4 md:-mx-6">
            <div className="min-w-[480px] px-2 sm:px-4 md:px-6">
              <Table>
                <TableCaption>
                  {isLoading
                    ? "Loading..."
                    : `Total ${filteredTags.length} tag${filteredTags.length === 1 ? "" : "s"} found`}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-6" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[140px]" />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Skeleton className="h-4 w-10" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredTags.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {tags.length === 0
                          ? "No tags yet. Create the first one."
                          : "No tags match your search."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTags.map((tag, index) => (
                      <TableRow key={tag.id ?? tag.name}>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {tag.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden sm:table-cell tabular-nums">
                          {tag.id ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {tag.id !== undefined && (
                            <TagActionComponent tag={tag} refetchTags={fetchTags} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
