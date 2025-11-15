export default function PatientsIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Patients</h1>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground mb-4">
          View and manage patient records
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold mb-1">John Doe</h3>
            <p className="text-sm text-muted-foreground">DOB: 01/15/1980</p>
            <p className="text-sm text-muted-foreground">ID: PT-001</p>
          </div>

          <div className="p-4 border rounded-md">
            <h3 className="font-semibold mb-1">Jane Smith</h3>
            <p className="text-sm text-muted-foreground">DOB: 03/22/1975</p>
            <p className="text-sm text-muted-foreground">ID: PT-002</p>
          </div>
        </div>
      </div>
    </div>
  );
}
