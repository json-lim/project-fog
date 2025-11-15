# RVG Data

This directory contains the complete RVG (Relative Value Guide) database for medical billing codes.

## Files

- **`rvg-data.json`** - Raw JSON data containing 534 RVG items parsed from the source
- **`rvg-data.ts`** - TypeScript module with typed access to the RVG database
- **`index.ts`** - Re-exports for convenient imports

## Data Structure

Each RVG item contains:

```typescript
{
  asa_item_number: string;      // e.g., "CA002"
  section: string;               // e.g., "Consultations"
  category: string;              // e.g., "Consultations and attendances (ASA)"
  subcategory?: string | null;  // e.g., "General", "Eyes", etc.
  units: number | null;          // Base units for billing
  description: string;           // Full description of the procedure
  mbs_items?: Array<{            // Associated MBS items
    mbs_item_number: number;
    fee: string;
    units?: number;
  }>;
  time_units_applicable?: boolean;
  modifying_units_applicable?: boolean;
}
```

## Usage Examples

### Basic Access

```typescript
import { RVG_DATABASE, getRvgItem } from "~/data";

// Get a specific item by code
const consultation = getRvgItem("CA002");
console.log(consultation.description);
console.log(consultation.units); // 2

// Access directly
const item = RVG_DATABASE["CA004"];
```

### Search and Filter

```typescript
import {
  searchRvgItems,
  getRvgItemsBySection,
  filterRvgItems,
} from "~/data";

// Search by text
const eyeProcs = searchRvgItems("eye");

// Get all items in a section
const consultations = getRvgItemsBySection("Consultations");

// Advanced filtering
const filtered = filterRvgItems({
  section: "Anaesthesia",
  category: "Division A: Head",
  subcategory: "Eyes",
  minUnits: 5,
  hasTimeUnits: true,
});
```

### Get Metadata

```typescript
import {
  getRvgSections,
  getRvgCategories,
  getRvgSubcategories,
} from "~/data";

// Get all available sections
const sections = getRvgSections();
// ["Consultations", "Modifiers", "Anaesthesia", "Other", "ICU", "Pain"]

// Get all categories
const categories = getRvgCategories();

// Get all subcategories
const subcategories = getRvgSubcategories();
```

### Iterate All Items

```typescript
import { RVG_ITEMS, RVG_CODES } from "~/data";

// Array of all items
RVG_ITEMS.forEach((item) => {
  console.log(`${item.asa_item_number}: ${item.description}`);
});

// Array of all codes
console.log(`Total codes: ${RVG_CODES.length}`); // 534
```

## Statistics

- **Total Items**: 534
- **Sections**: 6 (Consultations, Modifiers, Anaesthesia, Other, ICU, Pain)
- **Categories**: Multiple divisions covering all medical procedures
- **Subcategories**: Organized by body region and procedure type

## Source

Data parsed from: `assets/primary_source/RVG-final.txt`

Last updated: 2025-11-13

