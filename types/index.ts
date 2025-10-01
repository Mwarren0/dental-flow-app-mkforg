
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string;
  allergies: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Procedure {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  procedureId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  totalAmount: number;
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
  method: 'cash' | 'card' | 'insurance' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  todayAppointments: number;
  weeklyRevenue: number;
  totalPatients: number;
  completedTreatments: number;
  pendingPayments: number;
}
