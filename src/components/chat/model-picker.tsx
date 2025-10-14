"use client";

import { useChatStore } from "@/stores/chat-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

export function ModelPicker({ showModelPicker = true }: { showModelPicker?: boolean } = {}) {
  const { selectedModel, availableModels, setSelectedModel } = useChatStore();

  if (!showModelPicker) return null;

  return (
    <div className="flex items-center">
      <Select
        value={selectedModel}
        onValueChange={setSelectedModel}
      >
        <SelectTrigger className="h-9 gap-1 text-xs w-[160px] border border-border bg-background hover:bg-muted focus:ring-1 focus:ring-ring rounded-lg transition-colors">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}