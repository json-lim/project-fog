export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string; // ISO date string
  email: string;
  phone: string;
  primaryDoctor: string;
  lastVisit: string; // ISO date string
};

export const PATIENTS: Patient[] = [
  {
    id: "PT-001",
    name: "John Doe",
    dateOfBirth: "1980-01-15",
    email: "john.doe@example.com",
    phone: "+1 415 555 0111",
    primaryDoctor: "Dr. Jane Smith",
    lastVisit: "2024-08-12",
  },
  {
    id: "PT-002",
    name: "Jane Smith",
    dateOfBirth: "1975-03-22",
    email: "jane.smith@example.com",
    phone: "+1 415 555 0175",
    primaryDoctor: "Dr. Alex Nguyen",
    lastVisit: "2024-09-01",
  },
  {
    id: "PT-003",
    name: "Michael Johnson",
    dateOfBirth: "1990-07-08",
    email: "michael.johnson@example.com",
    phone: "+1 415 555 0190",
    primaryDoctor: "Dr. Priya Patel",
    lastVisit: "2024-07-30",
  },
  {
    id: "PT-004",
    name: "Emily Chen",
    dateOfBirth: "1988-11-18",
    email: "emily.chen@example.com",
    phone: "+1 415 555 0133",
    primaryDoctor: "Dr. Carlos Rivera",
    lastVisit: "2024-05-14",
  },
  {
    id: "PT-005",
    name: "David Lee",
    dateOfBirth: "1995-02-03",
    email: "david.lee@example.com",
    phone: "+1 415 555 0159",
    primaryDoctor: "Dr. Sarah Parker",
    lastVisit: "2024-03-21",
  },
  {
    id: "PT-006",
    name: "Sophia Martinez",
    dateOfBirth: "1979-09-27",
    email: "sophia.martinez@example.com",
    phone: "+1 415 555 0184",
    primaryDoctor: "Dr. Jane Smith",
    lastVisit: "2024-01-09",
  },
];
