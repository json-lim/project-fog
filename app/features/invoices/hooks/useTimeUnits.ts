import { useMemo } from "react";
import type { TimeUnitDescription } from "~/features/invoices/types";
import {
  getTimeLineItem,
  parseDateTime,
  formatTimeForDescription,
  extractDurationChunk,
} from "~/features/invoices/utils";

export interface TimeUnitResult {
  asaItem: ReturnType<typeof getTimeLineItem>;
  mbsItem: ReturnType<typeof getTimeLineItem>;
  amount: number;
  timeUnitDescription: TimeUnitDescription;
  description: string; // e.g., "Time units (operative)"
}

/**
 * Create structured time units description
 */
function createTimeUnitsDescription(
  type: "pre-operative" | "operative",
  startTime: Date,
  endTime: Date,
  asaItemDescription: string,
  timeUnits: number
): { description: string; timeUnitDescription: TimeUnitDescription } {
  const timeRange = `${formatTimeForDescription(startTime)} - ${formatTimeForDescription(endTime)}`;
  const durationChunk = extractDurationChunk(asaItemDescription);
  return {
    description: `Time units (${type})`,
    timeUnitDescription: {
      type,
      timeRange,
      units: timeUnits,
      durationChunk,
    },
  };
}

/**
 * Hook for calculating time units from start and end times
 */
export function useTimeUnits(
  startTime: string,
  endTime: string,
  type: "pre-operative" | "operative",
  dollarsPerUnit: number | undefined
): TimeUnitResult | null {
  return useMemo(() => {
    const start = parseDateTime(startTime);
    const end = parseDateTime(endTime);

    if (!start || !end || end <= start) {
      return null;
    }

    try {
      const asaItem = getTimeLineItem(start, end, "ASA");
      const mbsItem = getTimeLineItem(start, end, "MBS");
      const amount = dollarsPerUnit ? dollarsPerUnit * asaItem.timeUnits : 0;
      const { description, timeUnitDescription } = createTimeUnitsDescription(
        type,
        start,
        end,
        asaItem.description,
        asaItem.timeUnits
      );

      return {
        asaItem,
        mbsItem,
        amount,
        timeUnitDescription,
        description,
      };
    } catch (error) {
      console.error(`Error generating ${type} time units:`, error);
      return null;
    }
  }, [startTime, endTime, type, dollarsPerUnit]);
}
