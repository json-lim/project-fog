import { GlossaryCategory } from "./GlossaryCategory";
import type { GroupedItems } from "../types";

interface GlossarySectionProps {
  section: string;
  categories: { [category: string]: { [subcategory: string]: any[] } };
  defaultOpen: boolean;
  sectionRef: (el: HTMLDivElement | null) => void;
  categoryRef: (
    section: string,
    category: string
  ) => (el: HTMLDivElement | null) => void;
}

export function GlossarySection({
  section,
  categories,
  defaultOpen,
  sectionRef,
  categoryRef,
}: GlossarySectionProps) {
  return (
    <div
      ref={sectionRef}
      id={`section-${section}`}
      className="space-y-1.5 scroll-mt-20"
    >
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">
        {section}
      </h2>

      {Object.entries(categories)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, subcategories]) => (
          <GlossaryCategory
            key={category}
            section={section}
            category={category}
            subcategories={subcategories}
            defaultOpen={defaultOpen}
            categoryRef={categoryRef(section, category)}
          />
        ))}
    </div>
  );
}

