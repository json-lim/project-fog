import { useState } from "react";
import { RVG_ITEMS } from "~/data/rvg-data";
import { useGlossaryData } from "~/hooks/useGlossaryData";
import { useGlossaryNavigation } from "~/hooks/useGlossaryNavigation";
import { GlossarySidebar } from "~/features/glossary/components/GlossarySidebar";
import { GlossarySearch } from "~/features/glossary/components/GlossarySearch";
import { GlossarySection } from "~/features/glossary/components/GlossarySection";

export default function GlossaryIndex() {
  const [searchQuery, setSearchQuery] = useState("");

  // Data logic
  const {
    filteredItems,
    groupedItems,
    sections,
    sectionCounts,
    getSectionCategories,
    debouncedSearch,
  } = useGlossaryData(searchQuery);

  // Navigation logic
  const {
    activeSection,
    expandedSections,
    sectionRefs,
    categoryRefs,
    toggleSection,
    scrollToSection,
    scrollToCategory,
  } = useGlossaryNavigation(groupedItems, sections, debouncedSearch);

  // Helper function to create category ref callback
  const createCategoryRef = (section: string, category: string) => {
    return (el: HTMLDivElement | null) => {
      if (!categoryRefs.current[section]) {
        categoryRefs.current[section] = {};
      }
      categoryRefs.current[section][category] = el;
    };
  };

  // Helper function to create section ref callback
  const createSectionRef = (section: string) => {
    return (el: HTMLDivElement | null) => {
      sectionRefs.current[section] = el;
    };
  };

  return (
    <div className="flex gap-6 w-full">
      {/* Navigation Sidebar */}
      <GlossarySidebar
        sections={sections}
        sectionCounts={sectionCounts}
        getSectionCategories={getSectionCategories}
        activeSection={activeSection}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        onScrollToSection={scrollToSection}
        onScrollToCategory={scrollToCategory}
      />

      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        <div>
          <h1 className="text-4xl font-bold mb-2">RVG Glossary</h1>
          <p className="text-gray-600">
            Search and browse all {RVG_ITEMS.length} RVG (Relative Value Guide)
            items
          </p>
        </div>

        <GlossarySearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredItems.length}
          showResults={!!debouncedSearch}
        />

        {/* Grouped Items */}
        <div className="space-y-2">
          {Object.entries(groupedItems)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([section, categories]) => (
              <GlossarySection
                key={section}
                section={section}
                categories={categories}
                defaultOpen={!debouncedSearch}
                sectionRef={createSectionRef(section)}
                categoryRef={createCategoryRef}
              />
            ))}
        </div>

        {filteredItems.length === 0 && debouncedSearch && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">
              No items found matching "{debouncedSearch}"
            </p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
