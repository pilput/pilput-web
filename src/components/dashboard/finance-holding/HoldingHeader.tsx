import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface HoldingHeaderProps {
  onAddClick: () => void;
}

export default function HoldingHeader({ onAddClick }: HoldingHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Finance Holding
        </h1>
        <p className="text-muted-foreground">
          Manage your financial holdings and assets.
        </p>
      </div>
      <Button
        className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
        onClick={onAddClick}
      >
        <PlusCircle className="w-4 h-4" />
        Add Holding
      </Button>
    </div>
  );
}