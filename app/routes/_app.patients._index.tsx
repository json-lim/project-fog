import { useNavigate } from "@remix-run/react";
import { PATIENTS } from "~/data/patients";

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function PatientsIndex() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patients</h1>
        <p className="text-muted-foreground">
          View, search, and manage your patient records
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total patients
            </p>
            <p className="text-2xl font-semibold">{PATIENTS.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/40 text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Date of birth</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {PATIENTS.map((patient) => (
                <tr
                  key={patient.id}
                  className="cursor-pointer border-b transition hover:bg-muted/50"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/patients/${patient.id}`);
                    }
                  }}
                  role="button"
                  aria-label={`View details for ${patient.name}`}
                >
                  <td className="px-6 py-4 font-medium">{patient.id}</td>
                  <td className="px-6 py-4">{patient.name}</td>
                  <td className="px-6 py-4">
                    {formatDate(patient.dateOfBirth)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
