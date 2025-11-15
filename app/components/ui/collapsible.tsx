import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("border rounded overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
      >
        <span className="font-medium text-left">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform shrink-0",
            isOpen && "transform rotate-180"
          )}
        />
      </button>
      {isOpen && <div className="px-3 py-2 bg-white border-t">{children}</div>}
    </div>
  );
}
