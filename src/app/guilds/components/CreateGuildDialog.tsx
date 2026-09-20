"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { guildSchema, type GuildFormData } from "@/lib/validation";
import { convertToSlug } from "@/utils/slug";
import { GuildFormFields } from "./GuildFormFields";

const EMPTY_GUILD: GuildFormData = {
  name: "",
  slug: "",
  description: "",
  avatar_url: "",
  is_public: true,
};

interface CreateGuildDialogProps {
  open: boolean;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GuildFormData) => Promise<void>;
}

export function CreateGuildDialog({
  open,
  saving,
  onOpenChange,
  onSubmit,
}: CreateGuildDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GuildFormData>({
    resolver: zodResolver(guildSchema),
    defaultValues: EMPTY_GUILD,
  });

  useEffect(() => {
    if (open) {
      reset(EMPTY_GUILD);
    }
  }, [open, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const name = watch("name");
  const isPublic = watch("is_public");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="shrink-0 cursor-pointer font-semibold gap-1.5 self-start md:self-auto">
          <Plus className="w-4 h-4" />
          New guild
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg text-left max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create a guild</DialogTitle>
          <DialogDescription>
            You become its owner, and can invite others by sharing the link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <GuildFormFields
            idPrefix="create-guild"
            register={register}
            errors={errors}
            isPublic={isPublic}
            onIsPublicChange={(value) =>
              setValue("is_public", value, { shouldDirty: true })
            }
            showSlug
            slugPlaceholder={convertToSlug(name || "") || "frontend-guild"}
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
              Create guild
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
