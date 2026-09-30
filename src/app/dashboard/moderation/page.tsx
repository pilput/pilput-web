"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { EyeOff, Flag, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getToken, RemoveToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import {
  reportReasonLabel,
  type PostModerationAction,
  type PostModerationActionType,
  type PostReport,
  type PostReportGroup,
  type PostReportStatus,
} from "@/types/post-report";

const LIMIT = 20;

const ACTION_LABEL: Record<PostModerationActionType, string> = {
  hide: "Hid the post",
  unhide: "Made the post visible again",
  dismiss: "Dismissed the reports",
};

const SUCCESS_MESSAGE: Record<PostModerationActionType, string> = {
  hide: "Post hidden and reports resolved",
  unhide: "Post is visible again",
  dismiss: "Reports dismissed",
};

interface Paged<T> {
  success: boolean;
  data: T[];
  meta?: { total_items: number };
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

function errorMessage(error: unknown, fallback: string): string {
  if (isHttpError(error)) {
    const msg = (error.response?.data as { message?: string } | undefined)?.message;
    if (msg) return msg;
  }
  return fallback;
}

export default function ModerationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<PostReportStatus>("pending");
  const [offset, setOffset] = useState(0);
  const [groups, setGroups] = useState<PostReportGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [selected, setSelected] = useState<PostReportGroup | null>(null);
  const [reports, setReports] = useState<PostReport[]>([]);
  const [history, setHistory] = useState<PostModerationAction[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailKey, setDetailKey] = useState(0);
  const [note, setNote] = useState("");
  const [busyAction, setBusyAction] = useState<PostModerationActionType | null>(null);

  const handleAuthError = useCallback(
    (error: unknown): boolean => {
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
    },
    [router],
  );

  useEffect(() => {
    let ignore = false;
    async function load() {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<Paged<PostReportGroup>>("/api/posts/reports", {
          params: { status, limit: LIMIT, offset },
          headers: authHeaders(),
        });
        if (ignore) return;
        setGroups(data?.data ?? []);
        setTotal(data?.meta?.total_items ?? 0);
      } catch (error) {
        if (ignore || handleAuthError(error)) return;
        toast.error(errorMessage(error, "Failed to load reported posts"));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [status, offset, reloadKey, handleAuthError]);

  const selectedPostId = selected?.post_id;
  useEffect(() => {
    if (!selectedPostId) return;
    let ignore = false;
    async function loadDetail(postId: string) {
      setIsLoadingDetail(true);
      try {
        const headers = authHeaders();
        const [reportsRes, historyRes] = await Promise.all([
          apiClient.get<Paged<PostReport>>(`/api/posts/${postId}/reports`, {
            params: { status, limit: 100 },
            headers,
          }),
          apiClient.get<Paged<PostModerationAction>>(`/api/posts/${postId}/moderation`, {
            params: { limit: 20 },
            headers,
          }),
        ]);
        if (ignore) return;
        setReports(reportsRes.data?.data ?? []);
        setHistory(historyRes.data?.data ?? []);
      } catch (error) {
        if (ignore || handleAuthError(error)) return;
        toast.error(errorMessage(error, "Failed to load details"));
      } finally {
        if (!ignore) setIsLoadingDetail(false);
      }
    }
    loadDetail(selectedPostId);
    return () => {
      ignore = true;
    };
  }, [selectedPostId, status, detailKey, handleAuthError]);

  function closeReview() {
    if (busyAction) return;
    setSelected(null);
    setReports([]);
    setHistory([]);
    setNote("");
  }

  async function moderate(action: PostModerationActionType) {
    if (!selected) return;
    setBusyAction(action);
    try {
      await apiClient.post(
        `/api/posts/${selected.post_id}/moderation`,
        { action, note: note.trim() || null },
        { headers: authHeaders() },
      );
      toast.success(SUCCESS_MESSAGE[action]);
      setNote("");
      if (action === "unhide") {
        // The dialog stays open on the same post: show the new state and history.
        setSelected((prev) => (prev ? { ...prev, hidden_at: null } : prev));
        setGroups((prev) => prev.map((g) => (g.post_id === selected.post_id ? { ...g, hidden_at: null } : g)));
        setDetailKey((k) => k + 1);
      } else {
        // The post leaves the pending queue, so close the dialog and reload the list.
        setBusyAction(null);
        closeReview();
        setReloadKey((k) => k + 1);
      }
    } catch (error) {
      if (!handleAuthError(error)) toast.error(errorMessage(error, "Failed to apply the action"));
    } finally {
      setBusyAction(null);
    }
  }

  const page = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const spinner = <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />;

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">Moderation</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Posts reported by users. Hiding a post removes it from public pages without deleting it.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-4 w-4" aria-hidden /> Reported posts
            </CardTitle>
            <CardDescription>{total.toLocaleString()} posts</CardDescription>
          </div>
          <Tabs
            value={status}
            onValueChange={(v) => {
              setStatus(v as PostReportStatus);
              setOffset(0);
            }}
          >
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead className="text-right">Reports</TableHead>
                  <TableHead>Top reason</TableHead>
                  <TableHead>Last reported</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : groups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      {status === "pending" ? "Nothing to review." : "No posts here."}
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((g) => (
                    <TableRow key={g.post_id}>
                      <TableCell className="max-w-[320px]">
                        <div className="flex flex-col gap-0.5">
                          {g.author_username && g.post_slug ? (
                            <Link
                              href={`/${g.author_username}/${g.post_slug}`}
                              target="_blank"
                              className="truncate font-medium hover:underline"
                            >
                              {g.post_title || "(untitled)"}
                            </Link>
                          ) : (
                            <span className="truncate font-medium">{g.post_title || "(untitled)"}</span>
                          )}
                          <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            {g.author_username ? `@${g.author_username}` : "deleted author"}
                            {g.hidden_at && (
                              <Badge variant="secondary" className="gap-1">
                                <EyeOff className="h-3 w-3" aria-hidden /> Hidden
                              </Badge>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{g.report_count}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{reportReasonLabel(g.top_reason)}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(g.last_reported_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(g)}>
                          {status === "pending" ? "Review" : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {total > LIMIT && (
            <div className="mt-4 flex items-center justify-end gap-2 text-sm">
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={offset === 0 || isLoading}
                onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={offset + LIMIT >= total || isLoading}
                onClick={() => setOffset((o) => o + LIMIT)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && closeReview()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="pr-6">{selected?.post_title || "(untitled)"}</DialogTitle>
            <DialogDescription>
              {selected?.report_count} {selected?.report_count === 1 ? "report" : "reports"}
              {selected?.author_username ? ` · by @${selected.author_username}` : ""}
              {selected?.hidden_at ? " · currently hidden" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            {isLoadingDetail ? (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="rounded-md border px-3 py-2">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{reportReasonLabel(r.reason)}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.reporter?.username ? `@${r.reporter.username} · ` : ""}
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {r.details && <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{r.details}</p>}
                </div>
              ))
            )}
          </div>

          {!isLoadingDetail && history.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>History</Label>
              <ul className="flex max-h-32 flex-col gap-1.5 overflow-y-auto text-sm">
                {history.map((h) => (
                  <li key={h.id} className="rounded-md bg-muted/50 px-3 py-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        {h.admin?.username ? `@${h.admin.username} ` : "An admin "}
                        <span className="text-muted-foreground">{ACTION_LABEL[h.action].toLowerCase()}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(h.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {h.note && <p className="mt-0.5 text-xs italic text-muted-foreground">{h.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="moderation-note">
              Note <span className="text-muted-foreground">(optional, saved to the history)</span>
            </Label>
            <Textarea
              id="moderation-note"
              rows={2}
              maxLength={1000}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {selected?.hidden_at ? (
              <Button variant="outline" disabled={busyAction !== null} onClick={() => moderate("unhide")}>
                {busyAction === "unhide" && spinner}
                Unhide post
              </Button>
            ) : status === "pending" ? (
              <>
                <Button variant="outline" disabled={busyAction !== null} onClick={() => moderate("dismiss")}>
                  {busyAction === "dismiss" && spinner}
                  Dismiss
                </Button>
                <Button variant="destructive" disabled={busyAction !== null} onClick={() => moderate("hide")}>
                  {busyAction === "hide" && spinner}
                  Hide post
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={closeReview}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
