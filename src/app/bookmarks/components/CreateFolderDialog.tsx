import { FolderPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateFolderDialogProps {
  open: boolean;
  name: string;
  description: string;
  creating: boolean;
  onOpenChange: (open: boolean) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
}

export function CreateFolderDialog({
  open,
  name,
  description,
  creating,
  onOpenChange,
  onNameChange,
  onDescriptionChange,
  onSubmit,
}: CreateFolderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="shrink-0 cursor-pointer font-semibold gap-1.5 self-start md:self-auto">
          <FolderPlus className="w-4 h-4" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-left">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Create folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Artificial Intelligence, Marketing"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder-desc">Description (optional)</Label>
            <Input
              id="folder-desc"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="What this folder is about"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={creating}
            onClick={onSubmit}
            className="cursor-pointer"
          >
            {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Create folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
