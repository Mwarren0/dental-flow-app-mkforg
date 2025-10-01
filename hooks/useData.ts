
import { useState, useEffect } from 'react';
import { Patient, Procedure, Appointment, Treatment, Payment, DashboardStats } from '@/types';
import { 
  mockPatients, 
  mockProcedures, 
  mockAppointments, 
  mockTreatments, 
  mockPayments, 
  mockDashboardStats 
} from '@/data/mockData';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
    }, 500);
  }, []);

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
    console.log('Patient added:', newPatient);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === id 
        ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
        : patient
    ));
    console.log('Patient updated:', id, updates);
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
    console.log('Patient deleted:', id);
  };

  return { patients, loading, addPatient, updatePatient, deletePatient };
};

export const useProcedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProcedures(mockProcedures);
      setLoading(false);
    }, 500);
  }, []);

  const addProcedure = (procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProcedure: Procedure = {
      ...procedure,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProcedures(prev => [...prev, newProcedure]);
    console.log('Procedure added:', newProcedure);
  };

  const updateProcedure = (id: string, updates: Partial<Procedure>) => {
    setProcedures(prev => prev.map(procedure => 
      procedure.id === id 
        ? { ...procedure, ...updates, updatedAt: new Date().toISOString() }
        : procedure
    ));
    console.log('Procedure updated:', id, updates);
  };

  const deleteProcedure = (id: string) => {
    setProcedures(prev => prev.filter(procedure => procedure.id !== id));
    console.log('Procedure deleted:', id);
  };

  return { procedures, loading, addProcedure, updateProcedure, deleteProcedure };
};

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 500);
  }, []);

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    console.log('Appointment added:', newAppointment);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id 
        ? { ...appointment, ...updates, updatedAt: new Date().toISOString() }
        : appointment
    ));
    console.log('Appointment updated:', id, updates);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    console.log('Appointment deleted:', id);
  };

  return { appointments, loading, addAppointment, updateAppointment, deleteAppointment };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats(mockDashboardStats);
      setLoading(false);
    }, 500);
  }, []);

  return { stats, loading };
};
