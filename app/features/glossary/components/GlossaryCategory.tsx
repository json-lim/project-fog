import { Collapsible } from "~/components/ui/collapsible";
import { GlossaryItemCard } from "./GlossaryItemCard";
import type { RvgItem } from "~/types/rvg";

interface GlossaryCategoryProps {
  section: string;
  category: string;
  subcategories: { [subcategory: string]: RvgItem[] };
  defaultOpen: boolean;
  categoryRef: (el: HTMLDivElement | null) => void;
}

export function GlossaryCategory({
  section,
  category,
  subcategories,
  defaultOpen,
  categoryRef,
}: GlossaryCategoryProps) {
  return (
    <div
      ref={categoryRef}
      id={`category-${section}-${category}`}
      className="scroll-mt-20"
    >
      <Collapsible title={category} defaultOpen={defaultOpen} className="ml-2">
        <div className="space-y-2">
          {Object.entries(subcategories)
            .sort(([a], [b]) => {
              // Sort "General" first, then alphabetically
              if (a === "General") return -1;
              if (b === "General") return 1;
              return a.localeCompare(b);
            })
            .map(([subcategory, items]) => (
              <div key={subcategory} className="space-y-1">
                {subcategory !== "General" && (
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-0.5">
                    {subcategory}
                  </h4>
                )}
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <GlossaryItemCard
                      key={item.asa_item_number}
                      item={item}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </Collapsible>
    </div>
  );
}

