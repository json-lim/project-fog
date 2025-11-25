import { useState } from "react";

/**
 * Hook for managing dollars per unit input with validation
 * Keeps raw input separate from validated numeric value
 */
export function useDollarsPerUnit() {
  const [dollarsPerUnitInput, setDollarsPerUnitInput] = useState<string>("");
  const [dollarsPerUnit, setDollarsPerUnit] = useState<number | undefined>(
    undefined
  );

  const handleBlur = () => {
    const raw = dollarsPerUnitInput.trim();

    if (raw === "") {
      setDollarsPerUnit(undefined);
      setDollarsPerUnitInput("");
      return;
    }

    const numericValue = Number(raw);
    if (Number.isNaN(numericValue)) {
      setDollarsPerUnit(undefined);
      setDollarsPerUnitInput("");
      return;
    }

    const nonNegative = Math.max(numericValue, 0);
    const rounded = Math.round(nonNegative * 100) / 100;

    setDollarsPerUnit(rounded);
    setDollarsPerUnitInput(rounded.toString());
  };

  return {
    dollarsPerUnitInput,
    dollarsPerUnit,
    setDollarsPerUnitInput,
    handleBlur,
  };
}
