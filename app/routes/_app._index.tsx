import { useState } from "react";
import { Input } from "~/components/ui/input";
import InvoicePreview from "~/features/invoices/components/InvoicePreview";
import { Invoice } from "~/features/invoices/types";
import { useDebounce } from "~/hooks/useDebounce";

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
