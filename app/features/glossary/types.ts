import type { RvgItem } from "~/types/rvg";

export type GroupedItems = {
  [section: string]: {
    [category: string]: {
      [subcategory: string]: RvgItem[];
    };
  };
};

