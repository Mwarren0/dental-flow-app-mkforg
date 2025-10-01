
import { useState, useEffect } from 'react';
import { Patient, Procedure, Appointment, Treatment, Payment, DashboardStats } from '@/types';
import { supabase } from '@/app/integrations/supabase/client';
import { debugLog } from '@/config/debug';
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
      debugLog('info', 'Fetching patients...');
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        debugLog('error', 'Error fetching patients:', error);
        return;
      }

      debugLog('debug', 'Raw patient data:', data);

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

      debugLog('info', `Transformed ${transformedPatients.length} patients`);
      setPatients(transformedPatients);
    } catch (error) {
      debugLog('error', 'Error in fetchPatients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      debugLog('info', 'Adding patient:', patient);
      
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
        debugLog('error', 'Error adding patient:', error);
        throw error;
      }

      debugLog('info', 'Patient added successfully:', data);
      await fetchPatients(); // Refresh the list
    } catch (error) {
      debugLog('error', 'Error in addPatient:', error);
      throw error;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      debugLog('info', 'Updating patient:', { id, updates });
      
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
        debugLog('error', 'Error updating patient:', error);
        throw error;
      }

      debugLog('info', 'Patient updated successfully:', id);
      await fetchPatients(); // Refresh the list
    } catch (error) {
      debugLog('error', 'Error in updatePatient:', error);
      throw error;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      debugLog('info', 'Attempting to delete patient:', id);
      
      // First check if patient exists
      const { data: existingPatient, error: fetchError } = await supabase
        .from('patients')
        .select('id, name')
        .eq('id', id)
        .single();

      if (fetchError) {
        debugLog('error', 'Error fetching patient before delete:', fetchError);
        throw new Error(`Patient not found: ${fetchError.message}`);
      }

      if (!existingPatient) {
        debugLog('error', 'Patient not found for deletion:', id);
        throw new Error('Patient not found');
      }

      debugLog('info', 'Found patient to delete:', existingPatient);

      // Perform the delete
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (deleteError) {
        debugLog('error', 'Error deleting patient:', deleteError);
        throw new Error(`Failed to delete patient: ${deleteError.message}`);
      }

      debugLog('info', 'Patient deleted successfully:', id);
      await fetchPatients(); // Refresh the list
      
      return { success: true };
    } catch (error) {
      debugLog('error', 'Error in deletePatient:', error);
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
      debugLog('info', 'Fetching procedures...');
      
      const { data, error } = await supabase
        .from('procedures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        debugLog('error', 'Error fetching procedures:', error);
        return;
      }

      debugLog('debug', 'Raw procedure data:', data);

      // Transform database data to match our Procedure type
      const transformedProcedures: Procedure[] = data.map(procedure => ({
        id: procedure.id,
        name: procedure.name,
        description: procedure.description || '',
        duration: procedure.duration || 0,
        price: parseFloat(procedure.price) || 0,
        category: procedure.category || '',
        code: procedure.code || '',
        createdAt: procedure.created_at,
        updatedAt: procedure.updated_at,
      }));

      debugLog('info', `Transformed ${transformedProcedures.length} procedures`);
      setProcedures(transformedProcedures);
    } catch (error) {
      debugLog('error', 'Error in fetchProcedures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  const addProcedure = async (procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      debugLog('info', 'Adding procedure:', procedure);
      
      const { data, error } = await supabase
        .from('procedures')
        .insert({
          name: procedure.name,
          description: procedure.description || null,
          duration: procedure.duration || null,
          price: procedure.price || null,
          category: procedure.category || null,
          code: procedure.code || null,
        })
        .select()
        .single();

      if (error) {
        debugLog('error', 'Error adding procedure:', error);
        throw error;
      }

      debugLog('info', 'Procedure added successfully:', data);
      await fetchProcedures(); // Refresh the list
    } catch (error) {
      debugLog('error', 'Error in addProcedure:', error);
      throw error;
    }
  };

  const updateProcedure = async (id: string, updates: Partial<Procedure>) => {
    try {
      debugLog('info', 'Updating procedure:', { id, updates });
      
      const { error } = await supabase
        .from('procedures')
        .update({
          name: updates.name,
          description: updates.description || null,
          duration: updates.duration || null,
          price: updates.price || null,
          category: updates.category || null,
          code: updates.code || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        debugLog('error', 'Error updating procedure:', error);
        throw error;
      }

      debugLog('info', 'Procedure updated successfully:', id);
      await fetchProcedures(); // Refresh the list
    } catch (error) {
      debugLog('error', 'Error in updateProcedure:', error);
      throw error;
    }
  };

  const deleteProcedure = async (id: string) => {
    try {
      debugLog('info', 'Attempting to delete procedure:', id);
      
      // First check if procedure exists
      const { data: existingProcedure, error: fetchError } = await supabase
        .from('procedures')
        .select('id, name')
        .eq('id', id)
        .single();

      if (fetchError) {
        debugLog('error', 'Error fetching procedure before delete:', fetchError);
        throw new Error(`Procedure not found: ${fetchError.message}`);
      }

      if (!existingProcedure) {
        debugLog('error', 'Procedure not found for deletion:', id);
        throw new Error('Procedure not found');
      }

      debugLog('info', 'Found procedure to delete:', existingProcedure);

      // Perform the delete
      const { error: deleteError } = await supabase
        .from('procedures')
        .delete()
        .eq('id', id);

      if (deleteError) {
        debugLog('error', 'Error deleting procedure:', deleteError);
        throw new Error(`Failed to delete procedure: ${deleteError.message}`);
      }

      debugLog('info', 'Procedure deleted successfully:', id);
      await fetchProcedures(); // Refresh the list
      
      return { success: true };
    } catch (error) {
      debugLog('error', 'Error in deleteProcedure:', error);
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
      debugLog('info', 'Fetching appointments...');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date_time', { ascending: true });

      if (error) {
        debugLog('error', 'Error fetching appointments:', error);
        return;
      }

      debugLog('debug', 'Raw appointment data:', data);

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

      debugLog('info', `Transformed ${transformedAppointments.length} appointments`);
      setAppointments(transformedAppointments);
    } catch (error) {
      debugLog('error', 'Error in fetchAppointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      debugLog('info', 'Adding appointment:', appointment);
      
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
        debugLog('error', 'Error adding appointment:', error);
        throw error;
      }

      debugLog('info', 'Appointment added successfully:', data);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      debugLog('error', 'Error in addAppointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      debugLog('info', 'Updating appointment:', { id, updates });
      
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
        debugLog('error', 'Error updating appointment:', error);
        throw error;
      }

      debugLog('info', 'Appointment updated successfully:', id);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      debugLog('error', 'Error in updateAppointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      debugLog('info', 'Attempting to delete appointment:', id);
      
      // First check if appointment exists
      const { data: existingAppointment, error: fetchError } = await supabase
        .from('appointments')
        .select('id, date_time, status')
        .eq('id', id)
        .single();

      if (fetchError) {
        debugLog('error', 'Error fetching appointment before delete:', fetchError);
        throw new Error(`Appointment not found: ${fetchError.message}`);
      }

      if (!existingAppointment) {
        debugLog('error', 'Appointment not found for deletion:', id);
        throw new Error('Appointment not found');
      }

      debugLog('info', 'Found appointment to delete:', existingAppointment);

      // Perform the delete
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (deleteError) {
        debugLog('error', 'Error deleting appointment:', deleteError);
        throw new Error(`Failed to delete appointment: ${deleteError.message}`);
      }

      debugLog('info', 'Appointment deleted successfully:', id);
      await fetchAppointments(); // Refresh the list
      
      return { success: true };
    } catch (error) {
      debugLog('error', 'Error in deleteAppointment:', error);
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
      debugLog('info', 'Fetching dashboard stats...');

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

      debugLog('info', 'Dashboard stats fetched:', dashboardStats);
      setStats(dashboardStats);
    } catch (error) {
      debugLog('error', 'Error fetching dashboard stats:', error);
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
</write file>

Now let me also update the profile screens to provide better error feedback to the user:

<write file="app/patient/[id].tsx">
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { usePatients } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';
import { Patient } from '@/types';

export default function PatientProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { patients, deletePatient } = usePatients();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const foundPatient = patients.find(p => p.id === id);
    setPatient(foundPatient || null);
  }, [id, patients]);

  const handleEdit = () => {
    router.push(`/edit-patient/${id}`);
  };

  const handleDelete = () => {
    if (isDeleting) return; // Prevent multiple delete attempts
    
    Alert.alert(
      t('common.confirmDelete'),
      t('patients.confirmDeleteMessage', { name: patient?.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              console.log('Starting delete operation for patient:', id);
              
              const result = await deletePatient(id!);
              console.log('Delete operation result:', result);
              
              Alert.alert(
                t('common.success'),
                t('patients.deleteSuccess'),
                [{ 
                  text: t('common.ok'), 
                  onPress: () => {
                    console.log('Navigating back after successful delete');
                    router.back();
                  }
                }]
              );
            } catch (error) {
              console.error('Error deleting patient:', error);
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              Alert.alert(
                t('common.error'), 
                `${t('patients.deleteError')}\n\nDetails: ${errorMessage}`
              );
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (!patient) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>{t('patients.notFound')}</Text>
        <Button variant="primary" onPress={() => router.back()}>
          {t('common.goBack')}
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: patient.name,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton} onPress={handleEdit}>
                <IconSymbol name="pencil" color={colors.primary} size={20} />
              </Pressable>
              <Pressable 
                style={[styles.headerButton, isDeleting && styles.disabledButton]} 
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <IconSymbol name="trash" color={isDeleting ? colors.textSecondary : colors.error} size={20} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(patient.name)}
              </Text>
            </View>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientId}>ID: {patient.id.slice(0, 8)}</Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('patients.contactInfo')}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="envelope" color={colors.primary} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.email')}</Text>
                </View>
                <Text style={styles.infoValue}>{patient.email || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="phone" color={colors.primary} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.phone')}</Text>
                </View>
                <Text style={styles.infoValue}>{patient.phone || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="location" color={colors.primary} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.address')}</Text>
                </View>
                <Text style={styles.infoValue}>{patient.address || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('patients.personalInfo')}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="calendar" color={colors.secondary} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.dateOfBirth')}</Text>
                </View>
                <Text style={styles.infoValue}>{formatDate(patient.dateOfBirth)}</Text>
              </View>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('patients.emergencyContact')}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="person.circle" color={colors.warning} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.emergencyContactName')}</Text>
                </View>
                <Text style={styles.infoValue}>{patient.emergencyContact || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="phone" color={colors.warning} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.emergencyPhone')}</Text>
                </View>
                <Text style={styles.infoValue}>{patient.emergencyPhone || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Medical Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('patients.medicalInfo')}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="medical.thermometer" color={colors.error} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.allergies')}</Text>
                </View>
                <Text style={[styles.infoValue, patient.allergies && patient.allergies !== 'None known' && styles.allergyText]}>
                  {patient.allergies || 'None known'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="doc.text" color={colors.accent} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.medicalHistory')}</Text>
                </View>
                <Text style={styles.infoValue}>{patient.medicalHistory || 'N/A'}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <View style={styles.infoRow}>
                  <IconSymbol name="creditcard" color={colors.success} size={16} />
                  <Text style={styles.infoLabel}>{t('patients.insuranceInfo')}</Text>
                </View>
                <Text style={styles.infoValue}>{patient.insuranceInfo || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              variant="primary"
              onPress={handleEdit}
              style={styles.actionButton}
            >
              <IconSymbol name="pencil" color="white" size={16} />
              {t('common.edit')}
            </Button>
            <Button
              variant="secondary"
              onPress={handleDelete}
              style={[styles.actionButton, isDeleting && styles.disabledActionButton]}
              disabled={isDeleting}
            >
              <IconSymbol name="trash" color={isDeleting ? colors.textSecondary : colors.error} size={16} />
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
  },
  patientName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  patientId: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  allergyText: {
    color: colors.error,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledActionButton: {
    opacity: 0.5,
  },
});
</write file>

<write file="app/procedure/[id].tsx">
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useProcedures } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';
import { Procedure } from '@/types';

export default function ProcedureProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { procedures, deleteProcedure } = useProcedures();
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const foundProcedure = procedures.find(p => p.id === id);
    setProcedure(foundProcedure || null);
  }, [id, procedures]);

  const handleEdit = () => {
    router.push(`/edit-procedure/${id}`);
  };

  const handleDelete = () => {
    if (isDeleting) return; // Prevent multiple delete attempts
    
    Alert.alert(
      t('common.confirmDelete'),
      t('procedures.confirmDeleteMessage', { name: procedure?.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              console.log('Starting delete operation for procedure:', id);
              
              const result = await deleteProcedure(id!);
              console.log('Delete operation result:', result);
              
              Alert.alert(
                t('common.success'),
                t('procedures.deleteSuccess'),
                [{ 
                  text: t('common.ok'), 
                  onPress: () => {
                    console.log('Navigating back after successful delete');
                    router.back();
                  }
                }]
              );
            } catch (error) {
              console.error('Error deleting procedure:', error);
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              Alert.alert(
                t('common.error'), 
                `${t('procedures.deleteError')}\n\nDetails: ${errorMessage}`
              );
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'preventive': return colors.success;
      case 'restorative': return colors.primary;
      case 'endodontic': return colors.warning;
      case 'cosmetic': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'preventive': return 'shield.checkered';
      case 'restorative': return 'wrench.and.screwdriver';
      case 'endodontic': return 'medical.thermometer';
      case 'cosmetic': return 'sparkles';
      default: return 'medical.thermometer';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!procedure) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>{t('procedures.notFound')}</Text>
        <Button variant="primary" onPress={() => router.back()}>
          {t('common.goBack')}
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: procedure.name,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton} onPress={handleEdit}>
                <IconSymbol name="pencil" color={colors.primary} size={20} />
              </Pressable>
              <Pressable 
                style={[styles.headerButton, isDeleting && styles.disabledButton]} 
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <IconSymbol name="trash" color={isDeleting ? colors.textSecondary : colors.error} size={20} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Procedure Header */}
          <View style={styles.procedureHeader}>
            <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(procedure.category) }]}>
              <IconSymbol 
                name={getCategoryIcon(procedure.category) as any} 
                color="white" 
                size={32} 
              />
            </View>
            <Text style={styles.procedureName}>{procedure.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(procedure.category) }]}>
              <Text style={styles.categoryText}>{procedure.category}</Text>
            </View>
            <Text style={styles.procedureId}>Code: {procedure.code}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('procedures.description')}</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{procedure.description}</Text>
            </View>
          </View>

          {/* Procedure Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('procedures.procedureDetails')}</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="dollarsign.circle" color={colors.success} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.price')}</Text>
                </View>
                <Text style={[styles.detailValue, styles.priceText]}>
                  {formatPrice(procedure.price)}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="clock" color={colors.primary} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.duration')}</Text>
                </View>
                <Text style={styles.detailValue}>
                  {formatDuration(procedure.duration)}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="tag" color={getCategoryColor(procedure.category)} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.category')}</Text>
                </View>
                <Text style={[styles.detailValue, { color: getCategoryColor(procedure.category) }]}>
                  {t(`procedures.${procedure.category}`)}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="number" color={colors.textSecondary} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.code')}</Text>
                </View>
                <Text style={[styles.detailValue, styles.codeText]}>
                  {procedure.code}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              variant="primary"
              onPress={handleEdit}
              style={styles.actionButton}
            >
              <IconSymbol name="pencil" color="white" size={16} />
              {t('common.edit')}
            </Button>
            <Button
              variant="secondary"
              onPress={handleDelete}
              style={[styles.actionButton, isDeleting && styles.disabledActionButton]}
              disabled={isDeleting}
            >
              <IconSymbol name="trash" color={isDeleting ? colors.textSecondary : colors.error} size={16} />
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  procedureHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  procedureName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  procedureId: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  descriptionCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  priceText: {
    color: colors.success,
    fontSize: 20,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledActionButton: {
    opacity: 0.5,
  },
});
</write file>

<write file="app/appointment/[id].tsx">
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAppointments, usePatients, useProcedures } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';
import { Appointment } from '@/types';

export default function AppointmentProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appointments, deleteAppointment } = useAppointments();
  const { patients } = usePatients();
  const { procedures } = useProcedures();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const foundAppointment = appointments.find(a => a.id === id);
    setAppointment(foundAppointment || null);
  }, [id, appointments]);

  const patient = appointment ? patients.find(p => p.id === appointment.patientId) : null;
  const procedure = appointment ? procedures.find(p => p.id === appointment.procedureId) : null;

  const handleEdit = () => {
    router.push(`/edit-appointment/${id}`);
  };

  const handleDelete = () => {
    if (isDeleting) return; // Prevent multiple delete attempts
    
    Alert.alert(
      t('common.confirmDelete'),
      t('appointments.confirmDeleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              console.log('Starting delete operation for appointment:', id);
              
              const result = await deleteAppointment(id!);
              console.log('Delete operation result:', result);
              
              Alert.alert(
                t('common.success'),
                t('appointments.deleteSuccess'),
                [{ 
                  text: t('common.ok'), 
                  onPress: () => {
                    console.log('Navigating back after successful delete');
                    router.back();
                  }
                }]
              );
            } catch (error) {
              console.error('Error deleting appointment:', error);
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
              Alert.alert(
                t('common.error'), 
                `${t('appointments.deleteError')}\n\nDetails: ${errorMessage}`
              );
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return colors.primary;
      case 'confirmed': return colors.secondary;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return 'calendar';
      case 'confirmed': return 'checkmark.circle';
      case 'completed': return 'checkmark.circle.fill';
      case 'cancelled': return 'xmark.circle';
      default: return 'circle';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return { dateStr, timeStr };
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (!appointment) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>{t('appointments.notFound')}</Text>
        <Button variant="primary" onPress={() => router.back()}>
          {t('common.goBack')}
        </Button>
      </View>
    );
  }

  const { dateStr, timeStr } = formatDateTime(appointment.dateTime);

  return (
    <>
      <Stack.Screen
        options={{
          title: t('appointments.appointmentDetails'),
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton} onPress={handleEdit}>
                <IconSymbol name="pencil" color={colors.primary} size={20} />
              </Pressable>
              <Pressable 
                style={[styles.headerButton, isDeleting && styles.disabledButton]} 
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <IconSymbol name="trash" color={isDeleting ? colors.textSecondary : colors.error} size={20} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Appointment Header */}
          <View style={styles.appointmentHeader}>
            <View style={[styles.statusIcon, { backgroundColor: getStatusColor(appointment.status) }]}>
              <IconSymbol 
                name={getStatusIcon(appointment.status) as any} 
                color="white" 
                size={32} 
              />
            </View>
            <Text style={styles.appointmentDate}>{dateStr}</Text>
            <Text style={styles.appointmentTime}>{timeStr}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
              <Text style={styles.statusText}>{appointment.status.toUpperCase()}</Text>
            </View>
          </View>

          {/* Patient Information */}
          {patient && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('appointments.patient')}</Text>
              <Pressable 
                style={styles.infoCard}
                onPress={() => router.push(`/patient/${patient.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {patient.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{patient.name}</Text>
                    <Text style={styles.cardSubtitle}>{patient.phone}</Text>
                    <Text style={styles.cardSubtitle}>{patient.email}</Text>
                  </View>
                  <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
                </View>
              </Pressable>
            </View>
          )}

          {/* Procedure Information */}
          {procedure && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('appointments.procedure')}</Text>
              <Pressable 
                style={styles.infoCard}
                onPress={() => router.push(`/procedure/${procedure.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.procedureIcon}>
                    <IconSymbol name="medical.thermometer" color={colors.primary} size={24} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{procedure.name}</Text>
                    <Text style={styles.cardSubtitle}>{procedure.category}</Text>
                    <Text style={[styles.cardSubtitle, styles.priceText]}>
                      {formatPrice(procedure.price)}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
                </View>
              </Pressable>
            </View>
          )}

          {/* Appointment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('appointments.appointmentDetails')}</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="calendar" color={colors.primary} size={20} />
                  <Text style={styles.detailLabel}>{t('appointments.date')}</Text>
                </View>
                <Text style={styles.detailValue}>{dateStr}</Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="clock" color={colors.secondary} size={20} />
                  <Text style={styles.detailLabel}>{t('appointments.time')}</Text>
                </View>
                <Text style={styles.detailValue}>{timeStr}</Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="flag" color={getStatusColor(appointment.status)} size={20} />
                  <Text style={styles.detailLabel}>{t('appointments.status')}</Text>
                </View>
                <Text style={[styles.detailValue, { color: getStatusColor(appointment.status) }]}>
                  {t(`appointments.${appointment.status}`)}
                </Text>
              </View>

              {procedure && (
                <View style={styles.detailCard}>
                  <View style={styles.detailHeader}>
                    <IconSymbol name="dollarsign.circle" color={colors.success} size={20} />
                    <Text style={styles.detailLabel}>{t('procedures.price')}</Text>
                  </View>
                  <Text style={[styles.detailValue, styles.priceText]}>
                    {formatPrice(procedure.price)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Notes */}
          {appointment.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('appointments.notes')}</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>{appointment.notes}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              variant="primary"
              onPress={handleEdit}
              style={styles.actionButton}
            >
              <IconSymbol name="pencil" color="white" size={16} />
              {t('common.edit')}
            </Button>
            <Button
              variant="secondary"
              onPress={handleDelete}
              style={[styles.actionButton, isDeleting && styles.disabledActionButton]}
              disabled={isDeleting}
            >
              <IconSymbol name="trash" color={isDeleting ? colors.textSecondary : colors.error} size={16} />
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  appointmentHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentDate: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  appointmentTime: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  procedureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  priceText: {
    color: colors.success,
    fontWeight: '600',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  notesCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledActionButton: {
    opacity: 0.5,
  },
});
</write file>

Now let me add the missing translation keys for the "deleting" state:

<write file="i18n/locales/en.json">
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "deleting": "Deleting...",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "filter": "Filter",
    "all": "All",
    "ok": "OK",
    "goBack": "Go Back",
    "confirmDelete": "Confirm Delete",
    "yes": "Yes",
    "no": "No"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome to DentalCare",
    "totalPatients": "Total Patients",
    "totalProcedures": "Total Procedures",
    "totalAppointments": "Total Appointments",
    "totalRevenue": "Total Revenue",
    "monthlyRevenue": "Monthly Revenue",
    "pendingAppointments": "Pending Appointments",
    "recentActivity": "Recent Activity",
    "quickActions": "Quick Actions",
    "viewAllPatients": "View All Patients",
    "viewAllProcedures": "View All Procedures",
    "viewAllAppointments": "View All Appointments",
    "addNewPatient": "Add New Patient",
    "scheduleAppointment": "Schedule Appointment",
    "connectionStatus": "Connection Status",
    "connected": "Connected",
    "disconnected": "Disconnected",
    "checkingConnection": "Checking connection..."
  },
  "patients": {
    "title": "Patients",
    "patient": "patient",
    "patients_plural": "patients",
    "addPatient": "Add Patient",
    "editPatient": "Edit Patient",
    "patientProfile": "Patient Profile",
    "searchPlaceholder": "Search patients...",
    "noPatients": "No patients yet",
    "noPatientsFound": "No patients found",
    "addFirstPatient": "Add your first patient to get started",
    "addFirstPatientButton": "Add First Patient",
    "tryAdjustingSearch": "Try adjusting your search terms",
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "dateOfBirth": "Date of Birth",
    "address": "Address",
    "emergencyContact": "Emergency Contact",
    "emergencyContactName": "Emergency Contact Name",
    "emergencyPhone": "Emergency Phone",
    "medicalHistory": "Medical History",
    "allergies": "Allergies",
    "insuranceInfo": "Insurance Information",
    "contactInfo": "Contact Information",
    "personalInfo": "Personal Information",
    "medicalInfo": "Medical Information",
    "required": "Required",
    "optional": "Optional",
    "addSuccess": "Patient added successfully",
    "addError": "Failed to add patient",
    "updateSuccess": "Patient updated successfully",
    "updateError": "Failed to update patient",
    "deleteSuccess": "Patient deleted successfully",
    "deleteError": "Failed to delete patient",
    "confirmDeleteMessage": "Are you sure you want to delete {{name}}? This action cannot be undone.",
    "notFound": "Patient not found"
  },
  "procedures": {
    "title": "Procedures",
    "procedure": "procedure",
    "procedures_plural": "procedures",
    "addProcedure": "Add Procedure",
    "editProcedure": "Edit Procedure",
    "procedureProfile": "Procedure Profile",
    "searchPlaceholder": "Search procedures...",
    "noProcedures": "No procedures yet",
    "noProceduresFound": "No procedures found",
    "addFirstProcedure": "Add your first procedure to get started",
    "addFirstProcedureButton": "Add First Procedure",
    "tryAdjustingFilter": "Try adjusting your search or filter",
    "name": "Name",
    "description": "Description",
    "duration": "Duration",
    "price": "Price",
    "category": "Category",
    "code": "Code",
    "procedureDetails": "Procedure Details",
    "preventive": "Preventive",
    "restorative": "Restorative",
    "endodontic": "Endodontic",
    "cosmetic": "Cosmetic",
    "required": "Required",
    "optional": "Optional",
    "minutes": "minutes",
    "generateCode": "Generate Code",
    "addSuccess": "Procedure added successfully",
    "addError": "Failed to add procedure",
    "updateSuccess": "Procedure updated successfully",
    "updateError": "Failed to update procedure",
    "deleteSuccess": "Procedure deleted successfully",
    "deleteError": "Failed to delete procedure",
    "confirmDeleteMessage": "Are you sure you want to delete {{name}}? This action cannot be undone.",
    "notFound": "Procedure not found"
  },
  "appointments": {
    "title": "Appointments",
    "appointment": "appointment",
    "appointments_plural": "appointments",
    "addAppointment": "Schedule Appointment",
    "editAppointment": "Edit Appointment",
    "appointmentDetails": "Appointment Details",
    "noAppointments": "No appointments yet",
    "noAppointmentsFound": "No {{status}} appointments found",
    "scheduleFirst": "Schedule your first appointment to get started",
    "scheduleFirstButton": "Schedule First Appointment",
    "tryDifferentFilter": "Try selecting a different status filter",
    "patient": "Patient",
    "procedure": "Procedure",
    "date": "Date",
    "time": "Time",
    "status": "Status",
    "notes": "Notes",
    "scheduled": "Scheduled",
    "confirmed": "Confirmed",
    "completed": "Completed",
    "cancelled": "Cancelled",
    "selectPatient": "Select Patient",
    "selectProcedure": "Select Procedure",
    "selectDate": "Select Date",
    "selectTime": "Select Time",
    "today": "Today",
    "now": "Now",
    "required": "Required",
    "optional": "Optional",
    "addSuccess": "Appointment scheduled successfully",
    "addError": "Failed to schedule appointment",
    "updateSuccess": "Appointment updated successfully",
    "updateError": "Failed to update appointment",
    "deleteSuccess": "Appointment deleted successfully",
    "deleteError": "Failed to delete appointment",
    "confirmDeleteMessage": "Are you sure you want to delete this appointment? This action cannot be undone.",
    "notFound": "Appointment not found"
  },
  "payments": {
    "title": "Payments",
    "addPayment": "Add Payment",
    "noPayments": "No payments yet",
    "amount": "Amount",
    "method": "Method",
    "status": "Status",
    "date": "Date",
    "cash": "Cash",
    "card": "Card",
    "transfer": "Transfer",
    "insurance": "Insurance",
    "pending": "Pending",
    "completed": "Completed",
    "failed": "Failed",
    "refunded": "Refunded"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "english": "English",
    "spanish": "Español",
    "database": "Database",
    "connectionStatus": "Connection Status",
    "connected": "Connected",
    "disconnected": "Disconnected",
    "statistics": "Statistics",
    "totalTables": "Total Tables",
    "about": "About",
    "version": "Version",
    "developer": "Developer"
  }
}
