import { isHttpError } from "@/utils/fetch";

export interface ChatErrorWithAuth {
  message: string;
  code?: string;
}

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, "");
};

export const validateConversationId = (id: string): boolean => {
  return typeof id === "string" && id.trim().length > 0 && id.length <= 100;
};

export const validateMessage = (
  message: string,
): { isValid: boolean; error?: string } => {
  const trimmed = message.trim();
  if (!trimmed) {
    return { isValid: false, error: "Message cannot be empty" };
  }
  if (trimmed.length > 10000) {
    return {
      isValid: false,
      error: "Message is too long (max 10000 characters)",
    };
  }
  return { isValid: true };
};

/**
 * Extracts error information from an API error response
 * Returns ChatError with isAuthError flag for 401 responses
 */
export const extractError = (
  err: unknown,
  defaultMessage: string,
): ChatErrorWithAuth & { isAuthError?: boolean } => {
  if (!isHttpError(err)) {
    return { message: defaultMessage };
  }
  const status = err.response.status;
  const data = err.response.data as { message?: string } | undefined;
  return {
    message: data?.message || defaultMessage,
    code: status.toString(),
    isAuthError: status === 401,
  };
};

export const isAbortError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === "AbortError";

export function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

/** Merge a fetched page of conversations into the existing list, deduped by id. */
export function mergeConversations<T extends { id: string }>(
  existing: T[],
  incoming: T[],
  isReset: boolean,
): T[] {
  const conversationMap = new Map<string, T>();
  if (!isReset) {
    existing.forEach((conv) => conversationMap.set(conv.id, conv));
  }
  incoming.forEach((conv) => conversationMap.set(conv.id, conv));
  return Array.from(conversationMap.values());
}
