import { useMemo } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import { RVG_ITEMS } from "~/data/rvg-data";
import type { RvgItem } from "~/types/rvg";
import type { GroupedItems } from "~/features/glossary/types";

export function useGlossaryData(searchQuery: string) {
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return RVG_ITEMS;
    }
    const lowerSearch = debouncedSearch.toLowerCase();
    return RVG_ITEMS.filter(
      (item) =>
        (item.description?.toLowerCase() || "").includes(lowerSearch) ||
        (item.asa_item_number?.toLowerCase() || "").includes(lowerSearch) ||
        (item.category?.toLowerCase() || "").includes(lowerSearch) ||
        (item.section?.toLowerCase() || "").includes(lowerSearch) ||
        (item.subcategory?.toLowerCase() || "").includes(lowerSearch)
    );
  }, [debouncedSearch]);

  // Group items by section → category → subcategory
  const groupedItems = useMemo(() => {
    const grouped: GroupedItems = {};

    filteredItems.forEach((item) => {
      const section = item.section || "Other";
      const category = item.category || "Uncategorized";
      const subcategory = item.subcategory || "General";

      if (!grouped[section]) {
        grouped[section] = {};
      }
      if (!grouped[section][category]) {
        grouped[section][category] = {};
      }
      if (!grouped[section][category][subcategory]) {
        grouped[section][category][subcategory] = [];
      }

      grouped[section][category][subcategory].push(item);
    });

    return grouped;
  }, [filteredItems]);

  // Get all sections for sidebar navigation
  const sections = useMemo(() => {
    return Object.keys(groupedItems).sort((a, b) => a.localeCompare(b));
  }, [groupedItems]);

  // Calculate item counts per section
  const sectionCounts = useMemo(() => {
    const counts: { [section: string]: number } = {};
    Object.entries(groupedItems).forEach(([section, categories]) => {
      let count = 0;
      Object.values(categories).forEach((subcategories) => {
        Object.values(subcategories).forEach((items) => {
          count += items.length;
        });
      });
      counts[section] = count;
    });
    return counts;
  }, [groupedItems]);

  // Get categories for a section
  const getSectionCategories = (section: string) => {
    return Object.keys(groupedItems[section] || {}).sort((a, b) =>
      a.localeCompare(b)
    );
  };

  return {
    filteredItems,
    groupedItems,
    sections,
    sectionCounts,
    getSectionCategories,
    debouncedSearch,
  };
}

