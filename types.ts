
export enum Role {
  DOCTOR = 'Doctor',
  PATIENT = 'Patient',
  PHARMACY = 'Pharmacy',
}

export interface User {
  id: string;
  email: string;
  password: string; 
  name: string;
  role: Role;
}

export interface Prescription {
  id: string; // Reference ID
  patientName: string;
  patientAge: number;
  disease: string;
  medicine: string;
  dosage: number; // in mg
  frequency: number; // times per day
  duration: number; // in days
  doctorId: string;
  doctorName: string;
  status: 'Issued' | 'Dispensed';
  adherenceCount: number;
}
