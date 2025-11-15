/**
 * TypeScript types for RVG (Relative Value Guide) medical billing codes
 * Generated from RVG-final.txt
 */

export interface MbsItem {
  mbs_item_number?: number | string;
  fee?: string;
  units?: number;
}

export interface RvgItem {
  asa_item_number: string;
  section: string;
  category: string;
  subcategory?: string | null;
  units: number | null;
  description: string;
  mbs_items?: MbsItem[] | null;
  time_units_applicable?: boolean;
  modifying_units_applicable?: boolean;
}

export type RvgSection =
  | "Consultations"
  | "Modifiers"
  | "Anaesthesia"
  | "Other"
  | "ICU"
  | "Pain";

export type RvgCategory =
  // Consultations
  | "Consultations and attendances (ASA)"
  | "Emergency attendances"
  | "Telehealth attendances"
  | "Pre-anaesthesia consultations and attendances (MBS)"
  | "Referred consultations (MBS)—other than prior to anaesthesia"
  | "Other consultations and attendances (MBS)"

  // Modifiers
  | "Physical status modifiers"
  | "Other modifiers"

  // Anaesthesia Divisions
  | "Division A: Head"
  | "Division B: Neck"
  | "Division C: Thorax (chest wall and shoulder girdle)"
  | "Division D: Intrathoracic"
  | "Division E: Spine and spinal cord"
  | "Division F: Upper abdomen"
  | "Division G: Lower abdomen"
  | "Division H: Perineum"
  | "Division J: Pelvis (except hip)"
  | "Division K: Upper leg (except knee)"
  | "Division L: Knee and popliteal area"
  | "Division M: Lower leg (below knee)"
  | "Division N: Shoulder and axilla"
  | "Division Q: Upper arm and elbow"
  | "Division R: Forearm, wrist and hand"
  | "Division R: Burns"
  | "Division S: Other procedures"
  | "Division U: Unlisted anaesthetic procedures"
  | "Division V: Therapeutic and diagnostic services"

  // Other
  | "Intensive Care"
  | "Pain Medicine Consultations"
  | "Pain Medicine"
  | "Pain Medicine Case Conferences";

export type RvgSubcategory =
  // Head
  | "General"
  | "Ears"
  | "Eyes"
  | "Nose/sinuses"
  | "Intra-oral"
  | "Facial bones"
  | "Intracranial"
  | "Miscellaneous"

  // Thorax
  | "Skin/soft tissue"
  | "Breast"
  | "Skeletal"
  | "Vascular/microsurgery"

  // Intrathoracic
  | "Oesophagus"
  | "Closed chest"
  | "Thoractomy"
  | "Heart"

  // Spine
  | "Cervical"
  | "Thoracic"
  | "Lumbar"

  // Abdomen
  | "Laparoscopy"
  | "Endoscopy"
  | "Hernias"
  | "Intraperitoneal"
  | "Extraperitoneal/urology"
  | "Obstetrics/gynaecology"

  // Perineum
  | "Male genitalia"
  | "Transurethral"

  // Limbs
  | "Hip"
  | "Femur (upper 2/3)"
  | "Femur (lower 1/3)"
  | "Knee"
  | "Tibia/fibula (Proximal)"
  | "Foot/leg/ankle"
  | "Shoulder"
  | "Upper arm/elbow"
  | "Forearm/wrist/hand"

  // Therapeutic services
  | "Echocardiography"
  | "Spinals/epidurals/caudals"
  | "Pain management"
  | "Neurolysis"
  | "Hyperbaric medicine"
  | "Nerve blocks"
  | "Perfusion/bypass"
  | "Invasive monitoring"
  | "Vascular cannulation"
  | "Airway management"
  | "Transfusion"
  | "Ultrasound"
  | "Radiology"
  | "Neurology"
  | null;

/**
 * Complete RVG database type - a record mapping ASA item numbers to RVG items
 */
export type RvgDatabase = Record<string, RvgItem>;

/**
 * Helper type for searching/filtering RVG items
 */
export interface RvgSearchParams {
  section?: RvgSection;
  category?: string;
  subcategory?: string;
  minUnits?: number;
  maxUnits?: number;
  searchText?: string;
  hasTimeUnits?: boolean;
  hasModifyingUnits?: boolean;
}

/**
 * Type for calculating total billing
 */
export interface BillingCalculation {
  asaItemNumber: string;
  baseUnits: number;
  timeUnits?: number;
  modifyingUnits?: number;
  totalUnits: number;
  description: string;
}

/**
 * Type for invoice line items that reference RVG codes
 */
export interface MedicalBillingLineItem {
  rvgItem: RvgItem;
  timeUnits?: number;
  modifiers?: string[]; // Array of modifier ASA item numbers (P1, P2, M1, etc.)
  totalUnits: number;
  fee: number;
  date: Date;
}
