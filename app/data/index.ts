/**
 * RVG Data Module
 *
 * Exports the complete RVG database and utility functions for accessing medical billing codes
 */

export {
  RVG_DATABASE,
  RVG_ITEMS,
  RVG_CODES,
  getRvgItem,
  getRvgItemsBySection,
  getRvgItemsByCategory,
  searchRvgItems,
  getRvgSections,
  getRvgCategories,
  getRvgSubcategories,
  filterRvgItems,
} from "./rvg-data";

export type {
  RvgItem,
  RvgDatabase,
  MbsItem,
  RvgSection,
  RvgCategory,
  RvgSubcategory,
  RvgSearchParams,
  BillingCalculation,
  MedicalBillingLineItem,
} from "~/types/rvg";
