import type { RvgItem } from "~/types/rvg";

export interface Customer {
  name: string;
  dateOfBirth: Date;
}

export interface Doctor {
  firstName: string;
  lastName: string;
}

export interface TimeUnitDescription {
  type: "pre-operative" | "operative";
  timeRange: string; // e.g., "11:11 AM - 1:30 PM"
  units: number;
  durationChunk: string; // e.g., "02:11 HOURS TO 02:20 HOURS"
}

export interface LineItem {
  date: Date;
  description: string;
  amount: number;
  rvgItem?: RvgItem; // Optional RVG item reference
  asaCode?: string; // ASA item number for reference
  mbsCode?: string; // MBS item number for reference
  asaTimeUnits?: number; // For time-based billing (ASA time units)
  mbsTimeUnits?: number; // MBS time units (may differ from ASA)
  timeUnitDescription?: TimeUnitDescription; // Structured description for time units
  modifiers?: string[]; // Modifier codes (P1, P2, M1, etc.)
}

export interface Invoice {
  id: string;
  customer: Customer;
  doctor: Doctor;
  lineItems: LineItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
