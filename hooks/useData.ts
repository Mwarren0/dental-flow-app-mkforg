
import { useState, useEffect } from 'react';
import { Patient, Procedure, Appointment, Treatment, Payment, DashboardStats } from '@/types';
import { supabase } from '@/app/integrations/supabase/client';
import { 
  mockTreatments, 
  mockPayments, 
  mockDashboardStats 
} from '@/data/mockData';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log('Fetching patients...');
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        return;
      }

      console.log('Raw patient data:', data);

      // Transform database data to match our Patient type
      const transformedPatients: Patient[] = data.map(patient => ({
        id: patient.id,
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        dateOfBirth: patient.date_of_birth || '',
        address: patient.address || '',
        emergencyContact: patient.emergency_contact || '',
        emergencyPhone: patient.emergency_phone || '',
        medicalHistory: patient.medical_history || '',
        allergies: patient.allergies || '',
        insuranceInfo: patient.insurance_info || '',
        createdAt: patient.created_at,
        updatedAt: patient.updated_at,
      }));

      console.log('Transformed patients:', transformedPatients);
      setPatients(transformedPatients);
    } catch (error) {
      console.error('Error in fetchPatients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding patient:', patient);
      
      const { data, error } = await supabase
        .from('patients')
        .insert({
          name: patient.name,
          email: patient.email || null,
          phone: patient.phone || null,
          date_of_birth: patient.dateOfBirth || null,
          address: patient.address || null,
          emergency_contact: patient.emergencyContact || null,
          emergency_phone: patient.emergencyPhone || null,
          medical_history: patient.medicalHistory || null,
          allergies: patient.allergies || null,
          insurance_info: patient.insuranceInfo || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding patient:', error);
        throw error;
      }

      console.log('Patient added successfully:', data);
      await fetchPatients(); // Refresh the list
    } catch (error) {
      console.error('Error in addPatient:', error);
      throw error;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          name: updates.name,
          email: updates.email || null,
          phone: updates.phone || null,
          date_of_birth: updates.dateOfBirth || null,
          address: updates.address || null,
          emergency_contact: updates.emergencyContact || null,
          emergency_phone: updates.emergencyPhone || null,
          medical_history: updates.medicalHistory || null,
          allergies: updates.allergies || null,
          insurance_info: updates.insuranceInfo || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating patient:', error);
        throw error;
      }

      console.log('Patient updated successfully:', id);
      await fetchPatients(); // Refresh the list
    } catch (error) {
      console.error('Error in updatePatient:', error);
      throw error;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting patient:', error);
        throw error;
      }

      console.log('Patient deleted successfully:', id);
      await fetchPatients(); // Refresh the list
    } catch (error) {
      console.error('Error in deletePatient:', error);
      throw error;
    }
  };

  return { patients, loading, addPatient, updatePatient, deletePatient };
};

export const useProcedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      console.log('Fetching procedures...');
      
      const { data, error } = await supabase
        .from('procedures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching procedures:', error);
        return;
      }

      console.log('Raw procedure data:', data);

      // Transform database data to match our Procedure type
      const transformedProcedures: Procedure[] = data.map(procedure => ({
        id: procedure.id,
        name: procedure.name,
        description: procedure.description || '',
        duration: procedure.duration || 0,
        price: parseFloat(procedure.price) || 0,
        category: procedure.category || '',
        createdAt: procedure.created_at,
        updatedAt: procedure.updated_at,
      }));

      console.log('Transformed procedures:', transformedProcedures);
      setProcedures(transformedProcedures);
    } catch (error) {
      console.error('Error in fetchProcedures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const addProcedure = async (procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding procedure:', procedure);
      
      const { data, error } = await supabase
        .from('procedures')
        .insert({
          name: procedure.name,
          description: procedure.description || null,
          duration: procedure.duration || null,
          price: procedure.price || null,
          category: procedure.category || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding procedure:', error);
        throw error;
      }

      console.log('Procedure added successfully:', data);
      await fetchProcedures(); // Refresh the list
    } catch (error) {
      console.error('Error in addProcedure:', error);
      throw error;
    }
  };

  const updateProcedure = async (id: string, updates: Partial<Procedure>) => {
    try {
      const { error } = await supabase
        .from('procedures')
        .update({
          name: updates.name,
          description: updates.description || null,
          duration: updates.duration || null,
          price: updates.price || null,
          category: updates.category || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating procedure:', error);
        throw error;
      }

      console.log('Procedure updated successfully:', id);
      await fetchProcedures(); // Refresh the list
    } catch (error) {
      console.error('Error in updateProcedure:', error);
      throw error;
    }
  };

  const deleteProcedure = async (id: string) => {
    try {
      const { error } = await supabase
        .from('procedures')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting procedure:', error);
        throw error;
      }

      console.log('Procedure deleted successfully:', id);
      await fetchProcedures(); // Refresh the list
    } catch (error) {
      console.error('Error in deleteProcedure:', error);
      throw error;
    }
  };

  return { procedures, loading, addProcedure, updateProcedure, deleteProcedure };
};

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date_time', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      console.log('Raw appointment data:', data);

      // Transform database data to match our Appointment type
      const transformedAppointments: Appointment[] = data.map(appointment => ({
        id: appointment.id,
        patientId: appointment.patient_id || '',
        procedureId: appointment.procedure_id || '',
        dateTime: appointment.date_time,
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
        createdAt: appointment.created_at,
        updatedAt: appointment.updated_at,
      }));

      console.log('Transformed appointments:', transformedAppointments);
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error in fetchAppointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Adding appointment:', appointment);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: appointment.patientId || null,
          procedure_id: appointment.procedureId || null,
          date_time: appointment.dateTime,
          status: appointment.status || 'scheduled',
          notes: appointment.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        throw error;
      }

      console.log('Appointment added successfully:', data);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error in addAppointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          patient_id: updates.patientId || null,
          procedure_id: updates.procedureId || null,
          date_time: updates.dateTime,
          status: updates.status || 'scheduled',
          notes: updates.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating appointment:', error);
        throw error;
      }

      console.log('Appointment updated successfully:', id);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }

      console.log('Appointment deleted successfully:', id);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
      throw error;
    }
  };

  return { appointments, loading, addAppointment, updateAppointment, deleteAppointment };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard stats...');

      // Fetch counts from each table
      const [patientsResult, proceduresResult, appointmentsResult, paymentsResult] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact', head: true }),
        supabase.from('procedures').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('amount', { count: 'exact' })
      ]);

      // Calculate total revenue from payments
      let totalRevenue = 0;
      if (paymentsResult.data) {
        totalRevenue = paymentsResult.data.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
      }

      const dashboardStats: DashboardStats = {
        totalPatients: patientsResult.count || 0,
        totalProcedures: proceduresResult.count || 0,
        totalAppointments: appointmentsResult.count || 0,
        totalRevenue: totalRevenue,
        monthlyRevenue: totalRevenue, // For now, showing total as monthly
        pendingAppointments: appointmentsResult.count || 0, // For now, showing all as pending
      };

      console.log('Dashboard stats fetched:', dashboardStats);
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data if there's an error
      setStats(mockDashboardStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading };
};

// Keep the existing treatments and payments hooks for now
export const useTreatments = () => {
  return { treatments: mockTreatments, loading: false };
};

export const usePayments = () => {
  return { payments: mockPayments, loading: false };
};
