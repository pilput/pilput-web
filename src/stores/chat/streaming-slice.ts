import type { StateCreator } from "zustand";
import { getToken } from "@/utils/Auth";
import { Config } from "@/utils/getConfig";
import type { ChatState, Conversation } from "./types";
import { asRecord } from "./utils";

export type StreamingSlice = Pick<
  ChatState,
  "streamMessage" | "abortActiveStream"
>;

const STREAM_TIMEOUT_MS = 60000;
/** Throttle store writes while tokens arrive (~60fps). */
const BATCH_FLUSH_MS = 16;

export const createStreamingSlice: StateCreator<
  ChatState,
  [],
  [],
  StreamingSlice
> = (set, get) => ({
  abortActiveStream: () => {
    const { activeStreamController } = get();
    if (activeStreamController) {
      activeStreamController.abort();
    }
    set({ activeStreamController: null });
  },

  streamMessage: async (
    conversationId,
    content,
    assistantMessageId,
    onConversationCreated,
  ) => {
    const controller = new AbortController();
    set({ activeStreamController: controller });
    const timeoutId = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);
    let updateTimeout: number | null = null;

    try {
      const url = conversationId
        ? `${Config.apibaseurl}/api/chat/conversations/${conversationId}/messages/stream`
        : `${Config.apibaseurl}/api/chat/conversations/stream`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content,
          model: get().selectedModel,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body reader available");
      }

      let accumulatedContent = "";
      let buffer = "";
      let currentEvent = "";

      const batchedUpdate = () => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg,
          ),
        }));
      };

      const scheduleUpdate = () => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        updateTimeout = window.setTimeout(batchedUpdate, BATCH_FLUSH_MS);
      };

      const appendChunk = (chunkText: string) => {
        if (!chunkText) return;
        accumulatedContent += chunkText;
        scheduleUpdate();
      };

      const handleConversationCreated = (parsedRecord: Record<string, unknown> | null) => {
        const nestedData = asRecord(parsedRecord?.data);
        const id =
          (parsedRecord?.conversation_id as string | undefined) ??
          (nestedData?.conversation_id as string | undefined);
        if (!id) return;
        set({ isNewConversation: true });
        onConversationCreated?.(id);

        // Update sidebar conversation list locally for instant UI update
        const newConv: Conversation = {
          id,
          title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          user_id: "",
          is_pinned: false,
          pinned_at: null,
          message_count: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [newConv, ...state.conversations],
        }));
      };

      const handleAiComplete = (parsedRecord: Record<string, unknown> | null) => {
        // Done streaming the message
        const completeMsg = asRecord(parsedRecord?.data) ?? parsedRecord;
        if (completeMsg && typeof completeMsg.content === "string") {
          accumulatedContent = completeMsg.content;
          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }
          batchedUpdate();
        }
      };

      const extractChunkText = (
        parsed: unknown,
        parsedRecord: Record<string, unknown> | null,
      ): string => {
        if (typeof parsed === "string") return parsed;
        if (typeof parsedRecord?.data === "string") return parsedRecord.data;
        return (parsedRecord?.content as string | undefined) || "";
      };

      const finishStream = () => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
          updateTimeout = null;
        }
        batchedUpdate();
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false }
              : msg,
          ),
        }));
      };

      const handleEvent = (
        eventType: string,
        parsed: unknown,
        parsedRecord: Record<string, unknown> | null,
      ) => {
        if (eventType === "conversation_created") {
          handleConversationCreated(parsedRecord);
        } else if (eventType === "ai_chunk") {
          appendChunk(extractChunkText(parsed, parsedRecord));
        } else if (eventType === "ai_complete") {
          handleAiComplete(parsedRecord);
        } else if (eventType === "error") {
          const errMsg =
            typeof parsed === "string"
              ? parsed
              : (parsedRecord?.message as string | undefined) ||
                "An error occurred during streaming";
          throw new Error(errMsg);
        } else {
          // Fallback for generic or old style SSE
          const chunkText =
            typeof parsed === "string"
              ? parsed
              : parsedRecord?.type === "ai_chunk" &&
                  typeof parsedRecord?.data === "string"
                ? parsedRecord.data
                : (parsedRecord?.content as string | undefined) || "";
          appendChunk(chunkText);
        }
      };

      let finished = false;
      while (!finished) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("event: ")) {
            currentEvent = trimmed.slice(7).trim();
            continue;
          }

          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6).trim();

            if (data === "[DONE]") {
              finishStream();
              finished = true;
              break;
            }

            try {
              let parsed: unknown = null;
              try {
                parsed = JSON.parse(data);
              } catch {
                parsed = data; // Keep as string
              }
              const parsedRecord = asRecord(parsed);

              // Determine actual event type
              const eventType =
                currentEvent ||
                (parsedRecord?.type as string | undefined) ||
                "";

              handleEvent(eventType, parsed, parsedRecord);
            } catch (parseError) {
              console.warn("Failed to parse streaming data:", parseError);
            }
          }
        }
      }

      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      clearTimeout(timeoutId);
    } catch (error) {
      throw error;
    } finally {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      clearTimeout(timeoutId);
      set((state) => ({
        isNewConversation: false,
        activeStreamController:
          state.activeStreamController === controller
            ? null
            : state.activeStreamController,
      }));
    }
  },
});
