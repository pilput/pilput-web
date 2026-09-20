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
import { guildSchema, type GuildFormData } from "@/lib/validation";
import { GuildFormFields } from "../../components/GuildFormFields";
import type { Guild } from "@/types/guild";

interface EditGuildDialogProps {
  guild: Guild;
  open: boolean;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GuildFormData) => Promise<void>;
}

export function EditGuildDialog({
  guild,
  open,
  saving,
  onOpenChange,
  onSubmit,
}: EditGuildDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GuildFormData>({
    resolver: zodResolver(guildSchema),
    defaultValues: {
      name: guild.name,
      slug: "",
      description: guild.description ?? "",
      avatar_url: guild.avatar_url ?? "",
      is_public: guild.is_public,
    },
  });

  // Re-seed whenever the dialog opens so a cancelled edit never leaks into the
  // next one, and a guild refreshed from the API shows its current values.
  useEffect(() => {
    if (open) {
      reset({
        name: guild.name,
        slug: "",
        description: guild.description ?? "",
        avatar_url: guild.avatar_url ?? "",
        is_public: guild.is_public,
      });
    }
  }, [open, guild, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const isPublic = watch("is_public");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg text-left max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Guild settings</DialogTitle>
          <DialogDescription>
            The guild URL (/guilds/{guild.slug}) is permanent and cannot be
            changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <GuildFormFields
            idPrefix="edit-guild"
            register={register}
            errors={errors}
            isPublic={isPublic}
            onIsPublicChange={(value) =>
              setValue("is_public", value, { shouldDirty: true })
            }
          />

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
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
