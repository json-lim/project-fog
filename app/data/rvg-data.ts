/**
 * RVG (Relative Value Guide) Database
 * Complete dataset of medical billing codes and their associated information
 *
 * This file contains 534 RVG items parsed from the source data.
 * Each item includes ASA codes, MBS items, descriptions, and unit values.
 */

import type { RvgDatabase } from "~/types/rvg";
import rvgDataJson from "./rvg-data.json";

/**
 * Complete RVG database containing all medical billing codes
 *
 * Access items by ASA code:
 * @example
 * const item = RVG_DATABASE["CA002"];
 * console.log(item.description); // "ANAESTHETIST CONSULTATION..."
 */
export const RVG_DATABASE: RvgDatabase = rvgDataJson as RvgDatabase;

/**
 * Array of all RVG items for iteration/filtering
 */
export const RVG_ITEMS = Object.values(RVG_DATABASE);

/**
 * Array of all ASA item numbers
 */
export const RVG_CODES = Object.keys(RVG_DATABASE);

/**
 * Get an RVG item by its ASA code
 */
export function getRvgItem(asaCode: string) {
  return RVG_DATABASE[asaCode];
}

/**
 * Search RVG items by section
 */
export function getRvgItemsBySection(section: string) {
  return RVG_ITEMS.filter((item) => item.section === section);
}

/**
 * Search RVG items by category
 */
export function getRvgItemsByCategory(category: string) {
  return RVG_ITEMS.filter((item) => item.category === category);
}

/**
 * Search RVG items by description text
 */
export function searchRvgItems(searchText: string) {
  const lowerSearch = searchText.toLowerCase();
  return RVG_ITEMS.filter(
    (item) =>
      item.description.toLowerCase().includes(lowerSearch) ||
      item.asa_item_number.toLowerCase().includes(lowerSearch) ||
      item.category.toLowerCase().includes(lowerSearch)
  );
}

/**
 * Get all unique sections
 */
export function getRvgSections() {
  return Array.from(new Set(RVG_ITEMS.map((item) => item.section)));
}

/**
 * Get all unique categories
 */
export function getRvgCategories() {
  return Array.from(new Set(RVG_ITEMS.map((item) => item.category)));
}

/**
 * Get all unique subcategories (excluding null)
 */
export function getRvgSubcategories() {
  return Array.from(
    new Set(
      RVG_ITEMS.map((item) => item.subcategory).filter(
        (sub) => sub !== null && sub !== undefined
      )
    )
  );
}

/**
 * Filter RVG items by multiple criteria
 */
export function filterRvgItems(filters: {
  section?: string;
  category?: string;
  subcategory?: string;
  minUnits?: number;
  maxUnits?: number;
  hasTimeUnits?: boolean;
  hasModifyingUnits?: boolean;
}) {
  return RVG_ITEMS.filter((item) => {
    if (filters.section && item.section !== filters.section) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.subcategory && item.subcategory !== filters.subcategory)
      return false;
    if (
      filters.minUnits !== undefined &&
      item.units !== null &&
      item.units < filters.minUnits
    )
      return false;
    if (
      filters.maxUnits !== undefined &&
      item.units !== null &&
      item.units > filters.maxUnits
    )
      return false;
    if (
      filters.hasTimeUnits !== undefined &&
      item.time_units_applicable !== filters.hasTimeUnits
    )
      return false;
    if (
      filters.hasModifyingUnits !== undefined &&
      item.modifying_units_applicable !== filters.hasModifyingUnits
    )
      return false;
    return true;
  });
}
