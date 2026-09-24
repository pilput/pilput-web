"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { guildChannelSchema, type GuildChannelFormData } from "@/lib/validation";
import type { GuildChannel } from "@/types/guild";

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

  const isEdit = channel !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? `Edit #${channel.name}` : "Create channel"}
          </DialogTitle>
          <DialogDescription>
            Names are saved lowercase with dashes — &quot;General Chat&quot;
            becomes #general-chat.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="channel-name">Name</Label>
            <Input
              id="channel-name"
              placeholder="announcements"
              autoComplete="off"
              aria-invalid={errors.name ? true : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="channel-topic">
              Topic <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="channel-topic"
              rows={3}
              placeholder="What is this channel about?"
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
              variant="secondary"
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
