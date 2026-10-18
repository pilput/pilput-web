import { toast } from "sonner";
import { isHttpError } from "./fetch";

type FieldError = { field?: string; message?: string; tag?: string };

/**
 * The reason a write was rejected by the backend anti-spam guard, or null for
 * any other error. Both backends answer `422` with the reason in `errors[]`
 * tagged `"spam"` (banned gambling/fraud keyword, link shortener, gambling
 * site link or too many links).
 */
export function getSpamRejectionReason(error: unknown): string | null {
  if (!isHttpError(error) || error.response.status !== 422) {
    return null;
  }
  const errors = (error.response.data as { errors?: unknown } | undefined)
    ?.errors;
  if (!Array.isArray(errors)) {
    return null;
  }
  const spam = (errors as FieldError[]).find((e) => e?.tag === "spam");
  return spam?.message || null;
}

/**
 * Shows the anti-spam rejection reason as an error toast, replacing the
 * loading toast `toastId` when given. Returns false when `error` is not an
 * anti-spam rejection so the caller can fall back to its own message.
 */
export function toastSpamRejection(
  error: unknown,
  toastId?: string | number,
): boolean {
  const reason = getSpamRejectionReason(error);
  if (!reason) {
    return false;
  }
  toast.error("Rejected by the anti-spam filter", {
    id: toastId,
    description: reason,
    // The reason explains which rule tripped; give people time to read it.
    duration: 10000,
  });
  return true;
}
