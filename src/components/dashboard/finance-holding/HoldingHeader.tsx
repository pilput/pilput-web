import { Button } from "@/components/ui/button";
import { PlusCircle, Copy } from "lucide-react";

interface HoldingHeaderProps {
  onAddClick: () => void;
  onDuplicateClick: () => void;
}

export default function HoldingHeader({
  onAddClick,
  onDuplicateClick,
}: HoldingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Finance Holding
        </h1>
        <p className="text-muted-foreground">
          Manage your financial holdings and assets.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
          onClick={onDuplicateClick}
        >
          <Copy className="w-4 h-4" />
          Duplicate Month
        </Button>
        <Button
          className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
          onClick={onAddClick}
        >
          <PlusCircle className="w-4 h-4" />
          Add Holding
        </Button>
      </div>
    </div>
  );
}