export interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribingDoctor: string;
  tags: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthIssue {
  id: string;
  title: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  isResolved: boolean;
  linkedPrescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  prescriptionId: string;
  time: string;
  isTaken: boolean;
  date: string;
}

export interface AppData {
  prescriptions: Prescription[];
  healthIssues: HealthIssue[];
  reminders: Reminder[];
}

export type Severity = 'low' | 'medium' | 'high';
