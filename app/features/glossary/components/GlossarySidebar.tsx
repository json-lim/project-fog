import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";

interface GlossarySidebarProps {
  sections: string[];
  sectionCounts: { [section: string]: number };
  getSectionCategories: (section: string) => string[];
  activeSection: string;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
  onScrollToSection: (section: string) => void;
  onScrollToCategory: (section: string, category: string) => void;
}

export function GlossarySidebar({
  sections,
  sectionCounts,
  getSectionCategories,
  activeSection,
  expandedSections,
  onToggleSection,
  onScrollToSection,
  onScrollToCategory,
}: GlossarySidebarProps) {
  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
        <div className="bg-white pr-4 border-r border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Navigation
          </h3>
          {sections.length === 0 && (
            <p className="text-gray-500">No sections found</p>
          )}
          {sections.length > 0 && (
            <nav className="space-y-1">
              {sections.map((section) => {
                const isExpanded = expandedSections.has(section);
                const categories = getSectionCategories(section);
                const count = sectionCounts[section] || 0;

                return (
                  <div key={section} className="space-y-1">
                    <button
                      onClick={() => {
                        if (categories.length > 0) {
                          onToggleSection(section);
                        } else {
                          onScrollToSection(section);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors",
                        activeSection === section
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="truncate">{section}</span>
                        <span className="text-xs text-gray-500 shrink-0">
                          ({count})
                        </span>
                      </div>
                      {categories.length > 0 && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-500 shrink-0 transition-transform",
                            isExpanded && "transform rotate-180"
                          )}
                        />
                      )}
                    </button>

                    {isExpanded && categories.length > 0 && (
                      <div className="ml-4 space-y-0.5 border-l border-gray-200 pl-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() =>
                              onScrollToCategory(section, category)
                            }
                            className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded transition-colors"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
