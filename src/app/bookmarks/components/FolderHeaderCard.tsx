import { Edit2, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { BookmarkFolder } from "@/types/bookmark";

interface FolderHeaderCardProps {
  title: string;
  description: string;
  currentFolder: BookmarkFolder | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onEditFolder: (folder: BookmarkFolder) => void;
  onDeleteFolder: (folder: BookmarkFolder) => void;
}

export function FolderHeaderCard({
  title,
  description,
  currentFolder,
  searchQuery,
  onSearchChange,
  onEditFolder,
  onDeleteFolder,
}: FolderHeaderCardProps) {
  return (
    <Card className="border border-border/70 p-5 bg-card/90">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        </div>

        {currentFolder && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={() => onEditFolder(currentFolder)}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              Rename
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => onDeleteFolder(currentFolder)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, custom name, author, or notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9.5 text-sm"
        />
      </div>
    </Card>
  );
}
