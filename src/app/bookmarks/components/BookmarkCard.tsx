import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Edit2, Loader2, Tag, Trash2 } from "lucide-react";
import { getProfilePicture, getUrlImage } from "@/utils/getImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookmarkFolder, BookmarkRecord } from "@/types/bookmark";

interface BookmarkCardProps {
  row: BookmarkRecord;
  folders: BookmarkFolder[] | null;
  busy: boolean;
  onEdit: (row: BookmarkRecord) => void;
  onRemove: (row: BookmarkRecord) => void;
  onMove: (bookmarkId: string, folderId: string | null) => void;
}

export function BookmarkCard({ row, folders, busy, onEdit, onRemove, onMove }: BookmarkCardProps) {
  const post = row.post;
  if (!post) return null; // Defensive check
  const href = post.user?.username ? `/${post.user.username}/${post.slug}` : `#/post/${post.id}`;

  return (
    <motion.li
      key={row.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      layout
    >
      <Card className="group overflow-hidden border-border/70 hover:border-primary/25 bg-card/90 transition-all duration-300">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-stretch">
            {post.photo_url ? (
              <Link
                href={href}
                className="block w-full sm:w-44 h-40 sm:h-auto shrink-0 bg-muted overflow-hidden relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getUrlImage(post.photo_url)}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ) : null}
            <div className="flex-1 p-5 flex flex-col gap-3 min-w-0 justify-between">
              <div className="space-y-2.5 text-left">
                <div className="space-y-1">
                  {row.name && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary uppercase tracking-wider">
                      <Tag className="w-3 h-3" />
                      Customized Title
                    </span>
                  )}
                  <Link
                    href={href}
                    className="block font-bold text-lg hover:text-primary transition-colors line-clamp-2 leading-snug"
                  >
                    {row.name || post.title}
                  </Link>
                  {row.name && (
                    <p className="text-xs text-muted-foreground truncate">
                      Original: {post.title}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                  {post.user ? (
                    <Link
                      href={`/${post.user.username}`}
                      className="inline-flex items-center gap-1.5 min-w-0 hover:text-foreground font-medium transition-colors"
                    >
                      <Avatar className="h-5 w-5 border border-border">
                        <AvatarImage
                          src={getProfilePicture(post.user.image || "")}
                          alt=""
                        />
                        <AvatarFallback className="text-[9px] font-bold">
                          {post.user.username ? post.user.username[0]?.toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">
                        {post.user.username}
                      </span>
                    </Link>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 min-w-0 text-muted-foreground">
                      <Avatar className="h-5 w-5 border border-border">
                        <AvatarFallback className="text-[9px] font-bold">A</AvatarFallback>
                      </Avatar>
                      <span>Anonymous</span>
                    </div>
                  )}

                  <span className="h-3 w-px bg-border" aria-hidden />

                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 opacity-70" />
                    {post.created_at ? new Date(post.created_at).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) : "Draft"}
                  </span>
                </div>

                {row.notes && (
                  <div className="mt-3.5 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 relative">
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">
                      <Tag className="w-3 h-3" />
                      <span>My Note:</span>
                    </div>
                    <p className="text-xs text-foreground/90 font-mono italic leading-relaxed whitespace-pre-wrap">
                      &ldquo;{row.notes}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="h-8 text-xs font-semibold cursor-pointer">
                    <Link href={href} className="inline-flex items-center">
                      Read post
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => onEdit(row)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit Note
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    disabled={busy}
                    onClick={() => onRemove(row)}
                  >
                    {busy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                    )}
                    Remove
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    Folder:
                  </span>
                  <Select
                    value={row.folder_id || "none"}
                    onValueChange={(val) =>
                      onMove(row.id, val === "none" ? null : val)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs font-semibold w-[140px] border-border/80">
                      <SelectValue placeholder="Move folder..." />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="none">Uncategorized</SelectItem>
                      {folders?.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.li>
  );
}
