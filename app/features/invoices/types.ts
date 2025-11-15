import type { RvgItem } from "~/types/rvg";

export interface Customer {
  name: string;
  dateOfBirth: Date;
}

export interface Doctor {
  firstName: string;
  lastName: string;
}

export interface LineItem {
  date: Date;
  description: string;
  amount: number;
  rvgItem?: RvgItem; // Optional RVG item reference
  asaCode?: string; // ASA item number for reference
  timeUnits?: number; // For time-based billing
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
