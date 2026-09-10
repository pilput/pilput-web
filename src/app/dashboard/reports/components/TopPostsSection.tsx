import { BarChart3, Eye, FileText, Heart, MessageCircle, Tags as TagsIcon, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tags } from "@/types/post";
import type { PostReport } from "@/types/report";
import { StatCard } from "./StatCard";
import { displayName } from "../utils";

interface TopPostsSectionProps {
  postReport: PostReport | null;
  tags: Tags[];
  tagId: string;
  isLoading: boolean;
  onTagIdChange: (value: string) => void;
}

export function TopPostsSection({
  postReport,
  tags,
  tagId,
  isLoading,
  onTagIdChange,
}: TopPostsSectionProps) {
  return (
    <Card className="glass-card border-glow-hover rounded-2xl overflow-hidden transition-all duration-300">
      <CardHeader className="border-b border-border/50 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Posts
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Posts ranked by views, likes, and comments in the selected range.
            </CardDescription>
          </div>
          {tags.length > 0 && (
            <Select value={tagId} onValueChange={onTagIdChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id ?? tag.name} value={String(tag.id)}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Total Posts"
            value={(postReport?.totalPosts ?? 0).toLocaleString()}
            icon={FileText}
            iconClassName="bg-indigo-500/10 text-indigo-500"
            isLoading={isLoading}
          />
          <StatCard
            title="New Posts"
            value={(postReport?.newPostsThisPeriod ?? 0).toLocaleString()}
            icon={FileText}
            iconClassName="bg-violet-500/10 text-violet-500"
            isLoading={isLoading}
          />
          <StatCard
            title="Views"
            value={(postReport?.totalViews ?? 0).toLocaleString()}
            icon={Eye}
            iconClassName="bg-emerald-500/10 text-emerald-500"
            isLoading={isLoading}
          />
          <StatCard
            title="Likes"
            value={(postReport?.totalLikes ?? 0).toLocaleString()}
            icon={Heart}
            iconClassName="bg-rose-500/10 text-rose-500"
            isLoading={isLoading}
          />
          <StatCard
            title="Comments"
            value={(postReport?.totalComments ?? 0).toLocaleString()}
            icon={MessageCircle}
            iconClassName="bg-amber-500/10 text-amber-500"
            isLoading={isLoading}
          />
          <StatCard
            title="Avg Engagement"
            value={`${(postReport?.avgEngagementRate ?? 0).toFixed(2)}%`}
            icon={TrendingUp}
            iconClassName="bg-primary/10 text-primary"
            isLoading={isLoading}
          />
        </div>

        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-[820px] sm:min-w-0 px-2 sm:px-0">
            <Table>
              <TableCaption>
                {isLoading ? "Loading..." : "Top posts by engagement"}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[220px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : !postReport || postReport.topPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No posts found for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  postReport.topPosts.map((post, index) => (
                    <TableRow key={post.id}>
                      <TableCell className="text-muted-foreground tabular-nums">{index + 1}</TableCell>
                      <TableCell className="font-medium max-w-[280px] truncate">
                        {post.title ?? "Untitled"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{displayName(post.author)}</TableCell>
                      <TableCell className="text-right tabular-nums">{post.views.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{post.likes.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{post.comments.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{post.engagementRate.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isLoading && postReport && postReport.tagPerformance.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
              <TagsIcon className="h-4 w-4" />
              Tag performance
            </div>
            <div className="flex flex-wrap gap-2">
              {postReport.tagPerformance.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs font-normal py-1 px-2.5">
                  {tag.name}
                  <span className="ml-1.5 text-muted-foreground">
                    {tag.postCount} posts &middot; {tag.totalViews.toLocaleString()} views
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
