import { useState, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import { RVG_ITEMS } from "~/data";
import type { RvgItem } from "~/types/rvg";

interface RvgCodePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asaCode: string) => void;
  currentCode?: string;
}

export function RvgCodePicker({
  open,
  onOpenChange,
  onSelect,
  currentCode,
}: RvgCodePickerProps) {
  const [search, setSearch] = useState("");

  // Group items by section
  const groupedItems = useMemo(() => {
    const groups: Record<string, RvgItem[]> = {};
    
    RVG_ITEMS.forEach((item) => {
      if (!groups[item.section]) {
        groups[item.section] = [];
      }
      groups[item.section].push(item);
    });
    
    return groups;
  }, []);

  const handleSelect = (asaCode: string) => {
    onSelect(asaCode);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search by code or description..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No RVG codes found.</CommandEmpty>
        
        {/* Group items by section */}
        {Object.entries(groupedItems).map(([section, items]) => (
          <CommandGroup key={section} heading={section}>
            {items.slice(0, 20).map((item) => (
              <CommandItem
                key={item.asa_item_number}
                value={`${item.asa_item_number} ${item.description} ${item.category}`}
                onSelect={() => handleSelect(item.asa_item_number)}
                className="flex flex-col items-start gap-1"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-mono font-bold text-sm">
                    {item.asa_item_number}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.units} units
                  </span>
                  {item.time_units_applicable && (
                    <span className="text-xs text-blue-600">⏱️</span>
                  )}
                </div>
                <div className="text-xs text-gray-600 line-clamp-1">
                  {item.description.split("\n")[0]}
                </div>
                <div className="text-xs text-gray-400">{item.category}</div>
              </CommandItem>
            ))}
            {items.length > 20 && (
              <div className="px-2 py-1 text-xs text-gray-400 italic">
                + {items.length - 20} more items (refine search to see)
              </div>
            )}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

