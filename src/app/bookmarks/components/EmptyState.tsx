import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  searching: boolean;
  folderName: string;
  onClearSearch: () => void;
}

export function EmptyState({ searching, folderName, onClearSearch }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-dashed border-2 border-border bg-card/45 backdrop-blur-xs">
        <CardContent className="py-16 text-center text-muted-foreground space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              {searching ? "No search results match" : "No saved posts here"}
            </p>
            <p className="text-sm max-w-sm mx-auto">
              {searching
                ? "Try clearing your search query or trying other search keywords."
                : `Organize posts into '${folderName}' by editing saved items or saving new posts.`}
            </p>
          </div>
          {searching && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSearch}
              className="cursor-pointer"
            >
              Clear search
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
