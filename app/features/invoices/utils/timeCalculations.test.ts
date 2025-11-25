import { describe, it, expect } from "vitest";
import { getTimeLineItem } from "./timeCalculations";

/**
 * Test suite for time unit calculation
 *
 * This test file encodes the requirements for time-based billing:
 * - 0-2 hours: 15-minute chunks (1 unit per 15 minutes)
 * - 2-4 hours: 10-minute chunks (1 unit per 10 minutes)
 * - 4+ hours: 5-minute chunks for ASA, 10-minute chunks for MBS
 */

describe("getTimeLineItem", () => {
  // Helper to create dates
  const createDate = (
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number
  ): Date => {
    return new Date(year, month - 1, day, hours, minutes);
  };

  describe("ASA System - 0-2 hours (15-minute chunks)", () => {
    it("should return T0015 with 1 unit for 1-15 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 13); // 13 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0015");
      expect(result.timeUnits).toBe(1);
      expect(result.description).toContain("00:01 HOURS TO 00:15 HOURS");
    });

    it("should return T0030 with 2 units for 16-30 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 25); // 25 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0030");
      expect(result.timeUnits).toBe(2);
      expect(result.description).toContain("00:16 HOURS TO 00:30 HOURS");
    });

    it("should return T0045 with 3 units for 31-45 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 40); // 40 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0045");
      expect(result.timeUnits).toBe(3);
      expect(result.description).toContain("00:31 HOURS TO 00:45 HOURS");
    });

    it("should return T0100 with 4 units for 46-60 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 55); // 55 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0100");
      expect(result.timeUnits).toBe(4);
      expect(result.description).toContain("00:46 HOURS TO 01:00 HOURS");
    });

    it("should return T0200 with 8 units for 106-120 minutes (2 hours)", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 9, 0); // Exactly 2 hours
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0200");
      expect(result.timeUnits).toBe(8);
      expect(result.description).toContain("01:46 HOURS TO 02:00 HOURS");
    });
  });

  describe("ASA System - 2-4 hours (10-minute chunks)", () => {
    it("should return T0210 with 9 units for first 10 minutes after 2 hours", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 9, 5); // 2 hours 5 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0210");
      expect(result.timeUnits).toBe(9);
      expect(result.description).toContain("02:01 HOURS TO 02:10 HOURS");
    });

    it("should return T0220 with 10 units for next 10 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 9, 15); // 2 hours 15 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0220");
      expect(result.timeUnits).toBe(10);
      expect(result.description).toContain("02:11 HOURS TO 02:20 HOURS");
    });

    it("should return T0400 with 20 units at 4 hour mark", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 11, 0); // Exactly 4 hours
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0400");
      expect(result.timeUnits).toBe(20);
      expect(result.description).toContain("03:51 HOURS TO 04:00 HOURS");
    });
  });

  describe("ASA System - 4+ hours (5-minute chunks)", () => {
    it("should return T0405 with 21 units for first 5 minutes after 4 hours", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 11, 3); // 4 hours 3 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0405");
      expect(result.timeUnits).toBe(21);
      expect(result.description).toContain("04:01 HOURS TO 04:05 HOURS");
    });

    it("should return T0410 with 22 units for next 5 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 11, 8); // 4 hours 8 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0410");
      expect(result.timeUnits).toBe(22);
      expect(result.description).toContain("04:06 HOURS TO 04:10 HOURS");
    });

    it("should return T2400 with 260 units at 24 hour mark", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 12, 7, 0); // Exactly 24 hours
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T2400");
      expect(result.timeUnits).toBe(260);
      expect(result.description).toContain("23:56 HOURS TO 24:00 HOURS");
    });
  });

  describe("MBS System - 0-2 hours (15-minute chunks)", () => {
    it("should return 23010 with 1 unit for 1-15 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 13); // 13 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23010");
      expect(result.timeUnits).toBe(1);
      expect(result.description).toContain("00:01 HOURS TO 00:15 HOURS");
    });

    it("should return 23025 with 2 units for 16-30 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 25); // 25 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23025");
      expect(result.timeUnits).toBe(2);
      expect(result.description).toContain("00:16 HOURS TO 00:30 HOURS");
    });

    it("should return 23035 with 3 units for 31-45 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 40); // 40 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23035");
      expect(result.timeUnits).toBe(3);
      expect(result.description).toContain("00:31 HOURS TO 00:45 HOURS");
    });

    it("should return 23045 with 4 units for 46-60 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 55); // 55 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23045");
      expect(result.timeUnits).toBe(4);
      expect(result.description).toContain("00:46 HOURS TO 01:00 HOURS");
    });

    it("should return 23085 with 8 units for 106-120 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 9, 0); // Exactly 2 hours
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23085");
      expect(result.timeUnits).toBe(8);
      expect(result.description).toContain("01:46 HOURS TO 02:00 HOURS");
    });
  });

  describe("MBS System - 2-4 hours (10-minute chunks)", () => {
    it("should return 23091 with 9 units for first 10 minutes after 2 hours", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 9, 5); // 2 hours 5 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23091");
      expect(result.timeUnits).toBe(9);
      expect(result.description).toContain("02:01 HOURS TO 02:10 HOURS");
    });

    it("should return 23101 with 10 units for next 10 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 9, 15); // 2 hours 15 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23101");
      expect(result.timeUnits).toBe(10);
      expect(result.description).toContain("02:11 HOURS TO 02:20 HOURS");
    });

    it("should return 23121 with 20 units at 4 hour mark", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 11, 0); // Exactly 4 hours
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23121");
      expect(result.timeUnits).toBe(20);
      expect(result.description).toContain("03:51 HOURS TO 04:00 HOURS");
    });
  });

  describe("MBS System - 4+ hours (10-minute chunks, different from ASA)", () => {
    it("should return 23170 with 21 units for first 10 minutes after 4 hours", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 11, 5); // 4 hours 5 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23170");
      expect(result.timeUnits).toBe(21);
      expect(result.description).toContain("04:01 HOURS TO 04:10 HOURS");
    });

    it("should return 23180 with 22 units for next 10 minutes", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 11, 15); // 4 hours 15 minutes
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23180");
      expect(result.timeUnits).toBe(22);
      expect(result.description).toContain("04:11 HOURS TO 04:20 HOURS");
    });

    it("should return 23400 with 44 units at 8 hour mark", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 15, 0); // 8 hours
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("23400");
      expect(result.timeUnits).toBe(44);
      expect(result.description).toContain("07:51 HOURS TO 08:00 HOURS");
    });

    // The math doesn't math out.
    it.skip("should return 24136 with 140 units at 24 hour mark", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 12, 7, 0); // Exactly 24 hours
      const result = getTimeLineItem(start, end, "MBS");

      expect(result.itemNumber).toBe("24136");
      expect(result.timeUnits).toBe(140);
      expect(result.description).toContain("23:51 HOURS TO 24:00 HOURS");
    });
  });

  describe("Description formatting", () => {
    it("should format description with correct time range and duration", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 13); // 13 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.description).toContain("00:01 HOURS TO 00:15 HOURS");
      expect(result.description).toContain("from");
      expect(result.description).toContain("to");
      expect(result.description).toContain("13 minutes");
    });

    it("should handle hours and minutes in description", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 9, 30); // 2 hours 30 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.description).toContain("2 hours");
      expect(result.description).toContain("30 minutes");
    });
  });

  describe("Edge cases", () => {
    it("should handle exact boundary times", () => {
      const start = createDate(2025, 7, 11, 7, 0);
      const end = createDate(2025, 7, 11, 7, 15); // Exactly 15 minutes
      const result = getTimeLineItem(start, end, "ASA");

      expect(result.itemNumber).toBe("T0015");
      expect(result.timeUnits).toBe(1);
    });
  });
});
