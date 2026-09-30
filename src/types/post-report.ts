/**
 * Mirrors echobackend/internal/dto/post_report.go.
 * Served by POST/GET /api/posts/:id/reports, GET /api/posts/reports and
 * POST/GET /api/posts/:id/moderation.
 */
import type { UserBrief } from "@/types/post";

export const POST_REPORT_REASONS = [
  { value: "spam", label: "Spam", description: "Ads, scams or repetitive content" },
  { value: "harassment", label: "Harassment", description: "Targets or bullies a person" },
  { value: "hate", label: "Hate speech", description: "Attacks a group based on identity" },
  { value: "nsfw", label: "Sexual or violent content", description: "Explicit or graphic material" },
  { value: "misinformation", label: "Misinformation", description: "Deliberately false or misleading" },
  { value: "other", label: "Something else", description: "Tell us what is wrong" },
] as const;

export type PostReportReason = (typeof POST_REPORT_REASONS)[number]["value"];
export type PostReportStatus = "pending" | "resolved" | "dismissed";
export type PostModerationActionType = "hide" | "unhide" | "dismiss";

export interface PostReportGroup {
  post_id: string;
  post_title: string | null;
  post_slug: string | null;
  author_username: string | null;
  hidden_at: string | null;
  report_count: number;
  top_reason: PostReportReason;
  last_reported_at: string;
}

export interface PostModerationAction {
  id: string;
  post_id: string | null;
  action: PostModerationActionType;
  note: string | null;
  created_at: string;
  admin?: UserBrief | null;
}

export interface PostReport {
  id: string;
  post_id: string;
  reason: PostReportReason;
  details: string | null;
  status: PostReportStatus;
  created_at: string;
  reporter?: UserBrief | null;
  /** The admin decision that closed this report; absent while pending. */
  resolution?: PostModerationAction | null;
}

export function reportReasonLabel(reason: string): string {
  return POST_REPORT_REASONS.find((r) => r.value === reason)?.label ?? reason;
}
