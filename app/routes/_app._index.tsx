import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import InvoicePreview from "~/features/invoices/components/InvoicePreview";
import { Invoice, type TimeUnitDescription } from "~/features/invoices/types";
import { useDebounce } from "~/hooks/useDebounce";
import { getTimeLineItem } from "~/features/invoices/utils";

const Index = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    id: "INV-001",
    customer: {
      name: "John Doe",
      dateOfBirth: new Date("1980-01-15"),
    },
    doctor: {
      firstName: "Jane",
      lastName: "Smith",
    },
    lineItems: [
      {
        date: new Date("2024-11-01"),
        description: "Initial Consultation",
        amount: 150.0,
      },
    ],
    totalAmount: 150.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Time unit fields
  const [preOpStartTime, setPreOpStartTime] = useState<string>("");
  const [preOpEndTime, setPreOpEndTime] = useState<string>("");
  const [opStartTime, setOpStartTime] = useState<string>("");
  const [opEndTime, setOpEndTime] = useState<string>("");

  // Keep the raw text separate from the numeric value so users can type freely,
  // then normalize/validate only once they leave the field.
  const [dollarsPerUnitInput, setDollarsPerUnitInput] = useState<string>("");
  const [dollarsPerUnit, setDollarsPerUnit] = useState<number | undefined>(
    undefined
  );

  const debouncedInvoice = useDebounce(invoice, 500); // Wait 500ms after typing stops

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const updateCustomer = (updates: Partial<typeof invoice.customer>) => {
    setInvoice((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...updates },
      updatedAt: new Date(),
    }));
  };

  const updateDoctor = (updates: Partial<typeof invoice.doctor>) => {
    setInvoice((prev) => ({
      ...prev,
      doctor: { ...prev.doctor, ...updates },
      updatedAt: new Date(),
    }));
  };

  const updateLineItem = (
    index: number,
    updates: Partial<(typeof invoice.lineItems)[0]>
  ) => {
    setInvoice((prev) => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index] = { ...newLineItems[index], ...updates };
      const newTotal = newLineItems.reduce((sum, item) => sum + item.amount, 0);
      return {
        ...prev,
        lineItems: newLineItems,
        totalAmount: newTotal,
        updatedAt: new Date(),
      };
    });
  };

  const addLineItem = () => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          date: new Date(),
          description: "",
          amount: 0,
        },
      ],
      updatedAt: new Date(),
    }));
  };

  const removeLineItem = (index: number) => {
    setInvoice((prev) => {
      const newLineItems = prev.lineItems.filter((_, i) => i !== index);
      const newTotal = newLineItems.reduce((sum, item) => sum + item.amount, 0);
      return {
        ...prev,
        lineItems: newLineItems,
        totalAmount: newTotal,
        updatedAt: new Date(),
      };
    });
  };

  // Helper to convert datetime-local string to Date
  const parseDateTime = (dateTimeString: string): Date | null => {
    if (!dateTimeString) return null;
    return new Date(dateTimeString);
  };

  // Helper to format time for description
  const formatTimeForDescription = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper to extract duration chunk from description
  const extractDurationChunk = (description: string): string => {
    // Description format: "00:01 HOURS TO 00:15 HOURS from ..."
    const match = description.match(/^([\d:]+ HOURS TO [\d:]+ HOURS)/);
    return match ? match[1] : "";
  };

  // Helper to create structured time units description
  const createTimeUnitsDescription = (
    type: "pre-operative" | "operative",
    startTime: Date,
    endTime: Date,
    asaItemDescription: string,
    timeUnits: number
  ): { description: string; timeUnitDescription: TimeUnitDescription } => {
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
  };

  // Generate time line items when times are filled
  useEffect(() => {
    setInvoice((prev) => {
      // Filter out existing time unit line items (they start with "Time units")
      const nonTimeItems = prev.lineItems.filter(
        (item) => !item.description.startsWith("Time units")
      );

      const newLineItems = [...nonTimeItems];

      // Pre-operative time units
      const preOpStart = parseDateTime(preOpStartTime);
      const preOpEnd = parseDateTime(preOpEndTime);
      if (preOpStart && preOpEnd && preOpEnd > preOpStart) {
        try {
          const asaItem = getTimeLineItem(preOpStart, preOpEnd, "ASA");
          const mbsItem = getTimeLineItem(preOpStart, preOpEnd, "MBS");
          const amount = dollarsPerUnit
            ? dollarsPerUnit * asaItem.timeUnits
            : 0;
          const preOpDescription = createTimeUnitsDescription(
            "pre-operative",
            preOpStart,
            preOpEnd,
            asaItem.description,
            asaItem.timeUnits
          );
          newLineItems.push({
            date: preOpStart,
            description: preOpDescription.description,
            timeUnitDescription: preOpDescription.timeUnitDescription,
            amount,
            asaCode: asaItem.itemNumber,
            mbsCode: mbsItem.itemNumber,
            asaTimeUnits: asaItem.timeUnits,
            mbsTimeUnits: mbsItem.timeUnits,
          });
        } catch (error) {
          console.error("Error generating pre-operative time units:", error);
        }
      }

      // Operative time units
      const opStart = parseDateTime(opStartTime);
      const opEnd = parseDateTime(opEndTime);
      if (opStart && opEnd && opEnd > opStart) {
        try {
          const asaItem = getTimeLineItem(opStart, opEnd, "ASA");
          const mbsItem = getTimeLineItem(opStart, opEnd, "MBS");
          const amount = dollarsPerUnit
            ? dollarsPerUnit * asaItem.timeUnits
            : 0;

          const opDescription = createTimeUnitsDescription(
            "operative",
            opStart,
            opEnd,
            asaItem.description,
            asaItem.timeUnits
          );
          newLineItems.push({
            date: opStart,
            description: opDescription.description,
            timeUnitDescription: opDescription.timeUnitDescription,
            amount,
            asaCode: asaItem.itemNumber,
            mbsCode: mbsItem.itemNumber,
            asaTimeUnits: asaItem.timeUnits,
            mbsTimeUnits: mbsItem.timeUnits,
          });
        } catch (error) {
          console.error("Error generating operative time units:", error);
        }
      }

      const newTotal = newLineItems.reduce((sum, item) => sum + item.amount, 0);
      return {
        ...prev,
        lineItems: newLineItems,
        totalAmount: newTotal,
        updatedAt: new Date(),
      };
    });
  }, [preOpStartTime, preOpEndTime, opStartTime, opEndTime, dollarsPerUnit]);

  return (
    <div className="w-full h-full">
      <h1 className="text-4xl font-bold mb-6">Invoice Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Column - Input Form */}
        <div className="space-y-6">
          {/* Invoice ID */}
          <div>
            <label className="text-sm font-medium mb-2 block">Invoice ID</label>
            <Input
              type="text"
              value={invoice.id}
              onChange={(e) => updateInvoice({ id: e.target.value })}
              placeholder="INV-001"
            />
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Customer Information</h2>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Customer Name
              </label>
              <Input
                type="text"
                value={invoice.customer.name}
                onChange={(e) => updateCustomer({ name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Date of Birth
              </label>
              <Input
                type="date"
                value={invoice.customer.dateOfBirth.toISOString().split("T")[0]}
                onChange={(e) =>
                  updateCustomer({ dateOfBirth: new Date(e.target.value) })
                }
              />
            </div>
          </div>

          {/* Doctor Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Doctor Information</h2>
            <div>
              <label className="text-sm font-medium mb-2 block">
                First Name
              </label>
              <Input
                type="text"
                value={invoice.doctor.firstName}
                onChange={(e) => updateDoctor({ firstName: e.target.value })}
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Last Name
              </label>
              <Input
                type="text"
                value={invoice.doctor.lastName}
                onChange={(e) => updateDoctor({ lastName: e.target.value })}
                placeholder="Smith"
              />
            </div>
          </div>

          {/* Time Units */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Time Units</h2>

            {/* Dollars per Unit */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Dollars per Unit ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={dollarsPerUnitInput}
                onChange={(e) => {
                  setDollarsPerUnitInput(e.target.value);
                }}
                onBlur={() => {
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
                }}
                placeholder="0.00"
              />
            </div>

            {/* Pre-operative Time */}
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="text-md font-medium">Pre-operative</h3>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Start Time
                </label>
                <Input
                  type="datetime-local"
                  value={preOpStartTime}
                  onChange={(e) => {
                    setPreOpStartTime(e.target.value);
                    if (preOpEndTime < e.target.value || !preOpEndTime) {
                      setPreOpEndTime(e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  End Time
                </label>
                <Input
                  type="datetime-local"
                  value={preOpEndTime}
                  onChange={(e) => setPreOpEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Operative Time */}
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
                <label className="text-sm font-medium mb-1 block">
                  End Time
                </label>
                <Input
                  type="datetime-local"
                  value={opEndTime}
                  onChange={(e) => setOpEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Line Items</h2>
              <button
                onClick={addLineItem}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Item
              </button>
            </div>
            {invoice.lineItems.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-2 relative"
              >
                <button
                  onClick={() => removeLineItem(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={item.date.toISOString().split("T")[0]}
                    onChange={(e) =>
                      updateLineItem(index, { date: new Date(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Description
                  </label>
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(index, { description: e.target.value })
                    }
                    placeholder="Service description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Amount ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) =>
                      updateLineItem(index, {
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount (Read-only, auto-calculated) */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Total Amount
            </label>
            <Input
              type="text"
              value={`$${invoice.totalAmount.toFixed(2)}`}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Right Column - Invoice Preview */}
        <div className="w-full h-full">
          <InvoicePreview invoice={debouncedInvoice} />
        </div>
      </div>
    </div>
  );
};

export default Index;
