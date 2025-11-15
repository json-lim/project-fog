import { useState, useEffect, useRef } from "react";
import type { GroupedItems } from "~/features/glossary/types";

export function useGlossaryNavigation(
  groupedItems: GroupedItems,
  sections: string[],
  debouncedSearch: string
) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoryRefs = useRef<{
    [section: string]: { [category: string]: HTMLDivElement | null };
  }>({});

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Scroll to section handler
  const scrollToSection = (section: string) => {
    const element = sectionRefs.current[section];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(section);
    }
  };

  // Scroll to category handler
  const scrollToCategory = (section: string, category: string) => {
    const element = categoryRefs.current[section]?.[category];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(section);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    if (debouncedSearch) {
      // Don't track active section when searching
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Track active section
      for (const section of sections) {
        const element = sectionRefs.current[section];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, debouncedSearch]);

  return {
    activeSection,
    expandedSections,
    sectionRefs,
    categoryRefs,
    toggleSection,
    scrollToSection,
    scrollToCategory,
  };
}

