export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">System Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Organization Name</label>
              <p className="text-sm text-muted-foreground">
                Medical Billing Co.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">
                admin@medicalbilling.com
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <p className="text-sm text-muted-foreground">Light</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
