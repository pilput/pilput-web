import { Bookmark, Edit2, Folder, FolderOpen, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BookmarkFolder } from "@/types/bookmark";
import type { FolderSelection } from "./types";

interface FolderSidebarProps {
  folders: BookmarkFolder[] | null;
  totalCount: number;
  uncategorizedCount: number;
  selectedFolderId: FolderSelection;
  loadingFolders: boolean;
  onSelect: (id: FolderSelection) => void;
  onEdit: (folder: BookmarkFolder) => void;
  onDelete: (folder: BookmarkFolder) => void;
}

function SidebarItem({
  active,
  icon,
  label,
  count,
  onClick,
  actions,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all border text-sm",
        active
          ? "bg-primary/10 border-primary/20 text-primary font-bold "
          : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
          active
            ? "bg-primary/20 border-primary/30 text-primary"
            : "bg-muted border-border text-muted-foreground"
        )}>
          {count}
        </span>
        {actions}
      </div>
    </div>
  );
}

export function FolderSidebar({
  folders,
  totalCount,
  uncategorizedCount,
  selectedFolderId,
  loadingFolders,
  onSelect,
  onEdit,
  onDelete,
}: FolderSidebarProps) {
  return (
    <Card className="col-span-1 border border-border/70 bg-card/90 p-4 shrink-0">
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-border/50">
        <h3 className="font-bold text-sm tracking-wide text-foreground/80 uppercase">
          Folders
        </h3>
        {loadingFolders && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
      </div>

      <div className="flex flex-col gap-1.5">
        <SidebarItem
          active={selectedFolderId === "all"}
          onClick={() => onSelect("all")}
          label="All Bookmarks"
          count={totalCount}
          icon={
            <Bookmark className={cn("w-4 h-4 shrink-0", selectedFolderId === "all" ? "text-primary fill-primary/10" : "text-muted-foreground/85")} />
          }
        />

        <SidebarItem
          active={selectedFolderId === "uncategorized"}
          onClick={() => onSelect("uncategorized")}
          label="Uncategorized"
          count={uncategorizedCount}
          icon={
            <FolderOpen className={cn("w-4 h-4 shrink-0", selectedFolderId === "uncategorized" ? "text-primary fill-primary/10" : "text-muted-foreground/85")} />
          }
        />

        {folders && folders.length > 0 && (
          <div className="mt-2 border-t border-border/40 pt-2 flex flex-col gap-1">
            {folders.map((f) => (
              <SidebarItem
                key={f.id}
                active={selectedFolderId === f.id}
                onClick={() => onSelect(f.id)}
                label={f.name}
                count={f.bookmark_count ?? 0}
                icon={
                  <Folder className={cn("w-4 h-4 shrink-0", selectedFolderId === f.id ? "text-primary fill-primary/10" : "text-muted-foreground/80")} />
                }
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-muted/80 rounded-md cursor-pointer transition-opacity"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 text-left">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(f);
                        }}
                        className="cursor-pointer gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(f);
                        }}
                        className="cursor-pointer gap-2 text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Folder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
