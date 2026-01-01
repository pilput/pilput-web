import { Button } from "@/components/ui/button";
import { PlusCircle, Copy } from "lucide-react";

export default function HoldingHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Finance Holdings
        </h1>
        <p className="text-muted-foreground">
          Manage your financial holdings and assets.
        </p>
      </div>
    </div>
  );
}