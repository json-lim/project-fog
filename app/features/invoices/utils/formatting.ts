/**
 * Date and time formatting utilities for invoices
 */

/**
 * Parse datetime-local string to Date object
 */
export function parseDateTime(dateTimeString: string): Date | null {
  if (!dateTimeString) return null;
  return new Date(dateTimeString);
}

/**
 * Format time for description (e.g., "11:11 AM")
 */
export function formatTimeForDescription(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Extract duration chunk from description
 * Description format: "00:01 HOURS TO 00:15 HOURS from ..."
 */
export function extractDurationChunk(description: string): string {
  const match = description.match(/^([\d:]+ HOURS TO [\d:]+ HOURS)/);
  return match ? match[1] : "";
}
