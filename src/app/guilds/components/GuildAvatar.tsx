import { Users } from "lucide-react";
import { getUrlImage } from "@/utils/getImage";
import { cn } from "@/lib/utils";

interface GuildAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  iconClassName?: string;
}

/**
 * Square guild badge. Falls back to the initials of the guild name, and then
 * to a generic icon when the name has no usable letters.
 */
export function GuildAvatar({
  name,
  avatarUrl,
  className,
  iconClassName,
}: GuildAvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center font-bold text-muted-foreground",
        className,
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getUrlImage(avatarUrl)}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <Users className={cn("w-1/2 h-1/2", iconClassName)} />
      )}
    </div>
  );
}
