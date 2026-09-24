"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import { guildChannelSchema, type GuildChannelFormData } from "@/lib/validation";
import type { GuildChannel } from "@/types/guild";

const TOPIC_MAX = 1024;

/**
 * Preview of the name the backend will store (pkg/slug Make): lowercase, runs
 * of anything but letters/digits (any script) collapsed to one dash, trimmed.
 */
function previewChannelName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return Array.from(slug).slice(0, 100).join("").replace(/-+$/, "");
}

interface ChannelDialogProps {
  /** The channel being edited; absent when creating one. */
  channel: GuildChannel | null;
  open: boolean;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GuildChannelFormData) => Promise<void>;
}

export function ChannelDialog({
  channel,
  open,
  saving,
  onOpenChange,
  onSubmit,
}: ChannelDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GuildChannelFormData>({
    resolver: zodResolver(guildChannelSchema),
    defaultValues: { name: "", topic: "" },
  });

  // Re-seed on open so a cancelled edit never leaks into the next one.
  useEffect(() => {
    if (open) {
      reset({ name: channel?.name ?? "", topic: channel?.topic ?? "" });
    }
  }, [open, channel, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const name = watch("name") ?? "";
  const topic = watch("topic") ?? "";
  const preview = previewChannelName(name);
  const isEdit = channel !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader>
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Hash className="w-5 h-5" />
          </div>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Edit channel" : "Create channel"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Rename the channel or change what it is about."
              : "Channels are where members talk about one topic."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="channel-name">Channel name</Label>
            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="channel-name"
                placeholder="new-channel"
                autoComplete="off"
                autoFocus
                className="pl-9"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby="channel-name-hint"
                {...register("name")}
              />
            </div>
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : (
              <p id="channel-name-hint" className="text-xs text-muted-foreground">
                {preview && preview !== name.trim() ? (
                  <>
                    Will be saved as{" "}
                    <span className="font-medium text-foreground">#{preview}</span>
                  </>
                ) : (
                  "Lowercase letters, numbers and dashes."
                )}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="channel-topic">
                Topic <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <span
                className={cn(
                  "text-[11px] tabular-nums text-muted-foreground",
                  topic.length > TOPIC_MAX && "text-destructive",
                )}
              >
                {topic.length}/{TOPIC_MAX}
              </span>
            </div>
            <Textarea
              id="channel-topic"
              rows={3}
              placeholder="Let members know what this channel is for"
              className="resize-none"
              aria-invalid={errors.topic ? true : undefined}
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-xs text-destructive">{errors.topic.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="cursor-pointer">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {isEdit ? "Save changes" : "Create channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
