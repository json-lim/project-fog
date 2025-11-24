/**
 * Time unit calculation utilities for invoice billing
 *
 * Time units are calculated based on duration chunks:
 * - 0-2 hours: 15-minute chunks (1 unit per 15 minutes)
 * - 2-4 hours: 10-minute chunks (1 unit per 10 minutes)
 * - 4+ hours: 5-minute chunks for ASA, 10-minute chunks for MBS
 */

export type TimeUnitType = "ASA" | "MBS";

export interface TimeLineItem {
  timeUnits: number;
  itemNumber: string;
  description: string;
}

/**
 * Format duration in minutes to HH:MM format
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Format time range for description
 */
function formatTimeRange(
  startTime: Date,
  endTime: Date,
  startDuration: string,
  endDuration: string
): string {
  const formatTime = (date: Date): string => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const durationMinutes = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60)
  );
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const durationText =
    hours > 0
      ? `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
      : `${minutes} minute${minutes !== 1 ? "s" : ""}`;

  return `${startDuration} HOURS TO ${endDuration} HOURS from ${formatTime(startTime)} to ${formatTime(endTime)} (${durationText})`;
}

/**
 * ASA item number codes for 0-2 hours (15-minute chunks)
 */
const ASA_0_2_HOURS: Array<{
  code: string;
  units: number;
  startMinutes: number;
  endMinutes: number;
}> = [
  { code: "T0015", units: 1, startMinutes: 1, endMinutes: 15 },
  { code: "T0030", units: 2, startMinutes: 16, endMinutes: 30 },
  { code: "T0045", units: 3, startMinutes: 31, endMinutes: 45 },
  { code: "T0100", units: 4, startMinutes: 46, endMinutes: 60 },
  { code: "T0115", units: 5, startMinutes: 61, endMinutes: 75 },
  { code: "T0130", units: 6, startMinutes: 76, endMinutes: 90 },
  { code: "T0145", units: 7, startMinutes: 91, endMinutes: 105 },
  { code: "T0200", units: 8, startMinutes: 106, endMinutes: 120 },
];

/**
 * ASA item number codes for 2-4 hours (10-minute chunks)
 */
const ASA_2_4_HOURS: Array<{
  code: string;
  units: number;
  startMinutes: number;
  endMinutes: number;
}> = [
  { code: "T0210", units: 9, startMinutes: 121, endMinutes: 130 },
  { code: "T0220", units: 10, startMinutes: 131, endMinutes: 140 },
  { code: "T0230", units: 11, startMinutes: 141, endMinutes: 150 },
  { code: "T0240", units: 12, startMinutes: 151, endMinutes: 160 },
  { code: "T0250", units: 13, startMinutes: 161, endMinutes: 170 },
  { code: "T0300", units: 14, startMinutes: 171, endMinutes: 180 },
  { code: "T0310", units: 15, startMinutes: 181, endMinutes: 190 },
  { code: "T0320", units: 16, startMinutes: 191, endMinutes: 200 },
  { code: "T0330", units: 17, startMinutes: 201, endMinutes: 210 },
  { code: "T0340", units: 18, startMinutes: 211, endMinutes: 220 },
  { code: "T0350", units: 19, startMinutes: 221, endMinutes: 230 },
  { code: "T0400", units: 20, startMinutes: 231, endMinutes: 240 },
];

/**
 * Generate ASA item number codes for 4+ hours (5-minute chunks)
 * This continues up to 24 hours
 */
function generateASA_4PlusHours(): Array<{
  code: string;
  units: number;
  startMinutes: number;
  endMinutes: number;
}> {
  const chunks: Array<{
    code: string;
    units: number;
    startMinutes: number;
    endMinutes: number;
  }> = [];
  let currentMinutes = 241; // Start at 4:01
  let units = 21; // Starting units at 4 hours

  // Generate up to 24 hours (1440 minutes)
  while (currentMinutes < 1440) {
    const endMinutes = Math.min(currentMinutes + 4, 1440); // 5-minute chunks

    // Code is based on the END of the chunk, not the start
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const code = `T${String(endHours).padStart(2, "0")}${String(endMins).padStart(2, "0")}`;

    chunks.push({
      code,
      units,
      startMinutes: currentMinutes,
      endMinutes,
    });

    if (endMinutes === 1440) {
      break;
    }

    currentMinutes = endMinutes + 1;
    units++;
  }

  return chunks;
}

const ASA_4_PLUS_HOURS = generateASA_4PlusHours();

/**
 * MBS item number codes for 0-2 hours (15-minute chunks)
 */
const MBS_0_2_HOURS: Array<{
  code: string;
  units: number;
  startMinutes: number;
  endMinutes: number;
}> = [
  { code: "23010", units: 1, startMinutes: 1, endMinutes: 15 },
  { code: "23025", units: 2, startMinutes: 16, endMinutes: 30 },
  { code: "23035", units: 3, startMinutes: 31, endMinutes: 45 },
  { code: "23045", units: 4, startMinutes: 46, endMinutes: 60 },
  { code: "23055", units: 5, startMinutes: 61, endMinutes: 75 },
  { code: "23065", units: 6, startMinutes: 76, endMinutes: 90 },
  { code: "23075", units: 7, startMinutes: 91, endMinutes: 105 },
  { code: "23085", units: 8, startMinutes: 106, endMinutes: 120 },
];

/**
 * MBS item number codes for 2-4 hours (10-minute chunks)
 */
const MBS_2_4_HOURS: Array<{
  code: string;
  units: number;
  startMinutes: number;
  endMinutes: number;
}> = [
  { code: "23091", units: 9, startMinutes: 121, endMinutes: 130 },
  { code: "23101", units: 10, startMinutes: 131, endMinutes: 140 },
  { code: "23111", units: 11, startMinutes: 141, endMinutes: 150 },
  { code: "23112", units: 12, startMinutes: 151, endMinutes: 160 },
  { code: "23113", units: 13, startMinutes: 161, endMinutes: 170 },
  { code: "23114", units: 14, startMinutes: 171, endMinutes: 180 },
  { code: "23115", units: 15, startMinutes: 181, endMinutes: 190 },
  { code: "23116", units: 16, startMinutes: 191, endMinutes: 200 },
  { code: "23117", units: 17, startMinutes: 201, endMinutes: 210 },
  { code: "23118", units: 18, startMinutes: 211, endMinutes: 220 },
  { code: "23119", units: 19, startMinutes: 221, endMinutes: 230 },
  { code: "23121", units: 20, startMinutes: 231, endMinutes: 240 },
];

/**
 * MBS item number codes for 4+ hours (10-minute chunks, different from ASA)
 * Based on spec: 23170, 23180, 23190, 23200, etc.
 */
function generateMBS_4PlusHours(): Array<{
  code: string;
  units: number;
  startMinutes: number;
  endMinutes: number;
}> {
  const chunks: Array<{
    code: string;
    units: number;
    startMinutes: number;
    endMinutes: number;
  }> = [];
  let currentMinutes = 241; // Start at 4:01
  let units = 21; // Starting units at 4 hours
  let codeBase = 23170; // Starting code at 4 hours

  // Generate up to 24 hours (1440 minutes)
  while (currentMinutes < 1440) {
    const endMinutes = Math.min(currentMinutes + 9, 1440); // 10-minute chunks

    const code = String(codeBase);

    chunks.push({
      code,
      units,
      startMinutes: currentMinutes,
      endMinutes: endMinutes,
    });

    if (endMinutes === 1440) {
      break;
    }

    currentMinutes = endMinutes + 1;
    units++;
    codeBase += 10; // Increment by 10 for each chunk
  }

  return chunks;
}

const MBS_4_PLUS_HOURS = generateMBS_4PlusHours();

/**
 * Find the appropriate time chunk for a given duration in minutes
 */
function findTimeChunk(
  durationMinutes: number,
  type: TimeUnitType
): {
  code: string;
  units: number;
  startMinutes: number;
  endMinutes: number;
} | null {
  // Minimum 1 minute
  if (durationMinutes < 1) {
    return null;
  }

  let chunks: Array<{
    code: string;
    units: number;
    startMinutes: number;
    endMinutes: number;
  }>;

  if (type === "ASA") {
    if (durationMinutes <= 120) {
      chunks = ASA_0_2_HOURS;
    } else if (durationMinutes <= 240) {
      chunks = ASA_2_4_HOURS;
    } else {
      chunks = ASA_4_PLUS_HOURS;
    }
  } else {
    // MBS
    if (durationMinutes <= 120) {
      chunks = MBS_0_2_HOURS;
    } else if (durationMinutes <= 240) {
      chunks = MBS_2_4_HOURS;
    } else {
      chunks = MBS_4_PLUS_HOURS;
    }
  }

  // Find the chunk that contains this duration
  // We use "part thereof" logic - if duration is 13 minutes, it falls in the 1-15 minute chunk
  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    if (durationMinutes >= chunk.startMinutes) {
      return chunk;
    }
  }

  // Fallback to first chunk if duration is very small
  return chunks[0];
}

/**
 * Get time line item for invoice billing
 *
 * @param startTime - Start time of the procedure
 * @param endTime - End time of the procedure
 * @param type - Either "ASA" or "MBS" billing system
 * @returns Time line item with time units, item number, and description
 */
export function getTimeLineItem(
  startTime: Date,
  endTime: Date,
  type: TimeUnitType
): TimeLineItem {
  // Calculate duration in minutes
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMinutes = Math.max(1, Math.ceil(durationMs / (1000 * 60)));

  // Find the appropriate chunk
  const chunk = findTimeChunk(durationMinutes, type);

  if (!chunk) {
    throw new Error(`Invalid duration: ${durationMinutes} minutes`);
  }

  // Format duration strings for description
  const startDuration = formatDuration(chunk.startMinutes);
  const endDuration = formatDuration(chunk.endMinutes);

  // Generate description
  const description = formatTimeRange(
    startTime,
    endTime,
    startDuration,
    endDuration
  );

  return {
    timeUnits: chunk.units,
    itemNumber: chunk.code,
    description,
  };
}
