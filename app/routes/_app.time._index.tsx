import { useState } from "react";
import { Input } from "~/components/ui/input";
import { useDollarsPerUnit, useTimeUnits } from "~/features/invoices/hooks";

export default function TimeIndex() {
  const [opStartTime, setOpStartTime] = useState<string>("");
  const [opEndTime, setOpEndTime] = useState<string>("");
  const {
    dollarsPerUnitInput,
    dollarsPerUnit,
    setDollarsPerUnitInput,
    handleBlur,
  } = useDollarsPerUnit();

  const opResults = useTimeUnits(
    opStartTime,
    opEndTime,
    "operative",
    dollarsPerUnit
  );

  return (
    <div className="flex-1 space-y-6 min-w-0">
      <div>
        <h1 className="text-4xl font-bold mb-2">Time Units Calculator</h1>
        <p className="text-gray-600">
          Debugging tool for ASA and MBS time units calculations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Dollars per Unit ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={dollarsPerUnitInput}
              onChange={(e) => setDollarsPerUnitInput(e.target.value)}
              onBlur={handleBlur}
              placeholder="0.00"
            />
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <h3 className="text-md font-medium">Operative</h3>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Start Time
              </label>
              <Input
                type="datetime-local"
                value={opStartTime}
                onChange={(e) => {
                  setOpStartTime(e.target.value);
                  if (opEndTime < e.target.value || !opEndTime) {
                    setOpEndTime(e.target.value);
                  }
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">End Time</label>
              <Input
                type="datetime-local"
                value={opEndTime}
                onChange={(e) => setOpEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {!opResults && (
            <div className="p-4 border rounded-lg text-center text-gray-500">
              <p>Enter time ranges to see calculated results</p>
            </div>
          )}
          {opResults && (
            <div className="p-4 border rounded-lg space-y-3">
              <h3 className="text-lg font-semibold">Operative Results</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[auto_1fr] gap-x-20 gap-y-2">
                  <span className="font-medium">Time Range:</span>
                  <span>{opResults.timeUnitDescription.timeRange}</span>
                  <span className="font-medium">Duration:</span>
                  <span>{opResults.timeUnitDescription.durationChunk}</span>
                  <span className="font-medium">ASA Code:</span>
                  <span>{opResults.asaItem.itemNumber}</span>
                  <span className="font-medium">ASA Time Units:</span>
                  <span>{opResults.asaItem.timeUnits}</span>
                  <span className="font-medium">MBS Code:</span>
                  <span>{opResults.mbsItem.itemNumber}</span>
                  <span className="font-medium">MBS Time Units:</span>
                  <span>{opResults.mbsItem.timeUnits}</span>
                </div>
                {dollarsPerUnit && (
                  <div className="pt-2 border-t grid grid-cols-[auto_1fr] gap-x-4">
                    <span className="font-medium">Amount:</span>
                    <span className="text-lg font-semibold">
                      ${opResults.amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
