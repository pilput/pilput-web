import React from "react";
import { MoreHorizontal, Copy, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { axiosInstence2 } from "@/utils/fetch";
import toast from "react-hot-toast";
import { getToken } from "@/utils/Auth";
import { useHoldingsStore } from "@/stores/holdingsStore";
import type { Holding } from "@/types/holding";

const HoldingActionComponent = ({
  holding,
  onEdit,
}: {
  holding: Holding;
  onEdit: (holding: Holding) => void;
}) => {
  const deleteHolding = useHoldingsStore((state) => state.deleteHolding);

  const onDuplicate = () => {
    // Create a duplicate holding without the ID and timestamps
    const duplicatedHolding: Holding = {
      ...holding,
      id: BigInt(0), // Will be set by the backend
      name: `${holding.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onEdit(duplicatedHolding);
  };
  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this holding?")) return;

    try {
      await deleteHolding(holding.id);
    } catch (error) {
      // Error handling is done in the store
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(holding)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HoldingActionComponent;