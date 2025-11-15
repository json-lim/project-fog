export default function BillingIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Billing Records</h1>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground mb-4">
          View and manage all billing records
        </p>

        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Record #12345</h3>
                <p className="text-sm text-muted-foreground">
                  Patient: John Doe
                </p>
              </div>
              <span className="text-sm font-medium text-green-600">Paid</span>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Record #12346</h3>
                <p className="text-sm text-muted-foreground">
                  Patient: Jane Smith
                </p>
              </div>
              <span className="text-sm font-medium text-yellow-600">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
