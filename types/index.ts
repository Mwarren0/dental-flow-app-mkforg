
export interface Patient {
  id: string;
  name: string; // Changed from firstName/lastName to single name field
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  allergies: string;
  insuranceInfo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  code: string; // Added code field
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  procedureId: string;
  dateTime: string; // Changed from separate date/time to single dateTime
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Treatment {
  id: string;
  appointmentId: string;
  patientId: string;
  procedureId: string;
  date: string;
  notes: string;
  beforePhotos: string[];
  afterPhotos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'insurance';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalProcedures: number;
  totalAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAppointments: number;
}
