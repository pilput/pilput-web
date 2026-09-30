"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { hasSession, getToken } from "@/utils/Auth";
import { apiClient, isHttpError } from "@/utils/fetch";
import { authStore } from "@/stores/userStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { POST_REPORT_REASONS, type PostReportReason } from "@/types/post-report";

const DETAILS_MAX = 1000;

interface ReportPostButtonProps {
  postId: string;
  /** Username of the post author; the button is hidden on your own post. */
  authorUsername?: string | null;
  className?: string;
}

export default function ReportPostButton({ postId, authorUsername, className }: ReportPostButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUsername = authStore((s) => s.data.username);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<PostReportReason | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (authorUsername && currentUsername && authorUsername === currentUsername) {
    return null;
  }

  function openDialog() {
    if (!hasSession()) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setOpen(true);
  }

  function reset() {
    setReason(null);
    setDetails("");
  }

  const detailsRequired = reason === "other";
  const canSubmit = reason !== null && (!detailsRequired || details.trim().length > 0) && !submitting;

  async function submit() {
    if (!reason) return;
    setSubmitting(true);
    try {
      await apiClient.post(
        `/api/posts/${postId}/reports`,
        { reason, details: details.trim() || null },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      toast.success("Thanks — our moderators will review this post.");
      setOpen(false);
      reset();
    } catch (error) {
      const status = isHttpError(error) ? error.response.status : 0;
      const message = isHttpError(error)
        ? (error.response.data as { message?: string } | undefined)?.message
        : undefined;
      if (status === 429) {
        toast.error("You've sent a lot of reports. Please try again later.");
      } else if (status === 401) {
        toast.error("Please log in to report this post.");
      } else {
        toast.error(message || "Couldn't send the report. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={openDialog}
              aria-label="Report post"
              className={cn(
                "inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className,
              )}
            >
              <Flag className="h-4 w-4" aria-hidden />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Report post</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (submitting) return;
          setOpen(next);
          if (!next) reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report this post</DialogTitle>
            <DialogDescription>
              Reports are anonymous to the author. Pick the reason that fits best.
            </DialogDescription>
          </DialogHeader>

          <div role="radiogroup" aria-label="Reason" className="flex flex-col gap-2">
            {POST_REPORT_REASONS.map((r) => {
              const selected = reason === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setReason(r.value)}
                  className={cn(
                    "flex flex-col items-start rounded-md border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/60",
                  )}
                >
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-xs text-muted-foreground">{r.description}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="report-details">
              Details {detailsRequired ? "" : <span className="text-muted-foreground">(optional)</span>}
            </Label>
            <Textarea
              id="report-details"
              value={details}
              maxLength={DETAILS_MAX}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Anything that helps a moderator understand the problem"
              rows={3}
            />
            <span className="self-end text-xs tabular-nums text-muted-foreground">
              {details.length}/{DETAILS_MAX}
            </span>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submit} disabled={!canSubmit}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
