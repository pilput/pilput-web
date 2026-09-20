"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { GuildFormData } from "@/lib/validation";

/**
 * Fields shared by the create and edit dialogs. The edit form has no `slug`
 * field (the backend keeps the slug immutable), so the props are typed against
 * the create shape and `slug` is rendered only when `showSlug` is set.
 */
interface GuildFormFieldsProps {
  idPrefix: string;
  register: UseFormRegister<GuildFormData>;
  errors: FieldErrors<GuildFormData>;
  isPublic: boolean;
  onIsPublicChange: (value: boolean) => void;
  showSlug?: boolean;
  slugPlaceholder?: string;
}

export function GuildFormFields({
  idPrefix,
  register,
  errors,
  isPublic,
  onIsPublicChange,
  showSlug = false,
  slugPlaceholder,
}: GuildFormFieldsProps) {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input
          id={`${idPrefix}-name`}
          placeholder="e.g. Frontend Guild"
          maxLength={100}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {showSlug && (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-slug`}>URL (optional)</Label>
          <Input
            id={`${idPrefix}-slug`}
            placeholder={slugPlaceholder || "frontend-guild"}
            maxLength={100}
            {...register("slug")}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to generate it from the name. It cannot be changed later.
          </p>
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-description`}>Description (optional)</Label>
        <Textarea
          id={`${idPrefix}-description`}
          placeholder="What this guild is about"
          rows={3}
          maxLength={2000}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-avatar`}>Avatar URL (optional)</Label>
        <Input
          id={`${idPrefix}-avatar`}
          placeholder="https://..."
          maxLength={2048}
          {...register("avatar_url")}
        />
        {errors.avatar_url && (
          <p className="text-xs text-destructive">{errors.avatar_url.message}</p>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg border border-border/70 p-3">
        <div className="space-y-0.5">
          <Label htmlFor={`${idPrefix}-public`}>Public guild</Label>
          <p className="text-xs text-muted-foreground">
            Public guilds appear in the directory and anyone can join. Private
            guilds are visible to members only.
          </p>
        </div>
        <Switch
          id={`${idPrefix}-public`}
          checked={isPublic}
          onCheckedChange={onIsPublicChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
