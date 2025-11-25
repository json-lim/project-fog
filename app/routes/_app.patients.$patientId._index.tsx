import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PATIENTS } from "~/data/patients";

export async function loader({ params }: LoaderFunctionArgs) {
  const { patientId } = params;
  const patient = PATIENTS.find((item) => item.id === patientId);

  if (!patient) {
    throw new Response("Patient not found", { status: 404 });
  }

  return json({ patient });
}

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function PatientDetail() {
  const { patient } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Patient ID {patient.id}
          </p>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
        </div>
        <Link
          to="/app/patients"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          &larr; Back to patients
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Patient details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Full name</dt>
              <dd className="font-medium">{patient.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Date of birth</dt>
              <dd className="font-medium">{formatDate(patient.dateOfBirth)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{patient.email}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{patient.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Care team</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Primary doctor</dt>
              <dd className="font-medium">{patient.primaryDoctor}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Last visit</dt>
              <dd className="font-medium">{formatDate(patient.lastVisit)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
