
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { AppointmentCard } from '@/components/AppointmentCard';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAppointments, usePatients, useProcedures } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';

export default function AppointmentsScreen() {
  const { t } = useTranslation();
  const { appointments, loading: appointmentsLoading, deleteAppointment } = useAppointments();
  const { patients } = usePatients();
  const { procedures } = useProcedures();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statuses = [
    { key: 'all', label: t('common.all') },
    { key: 'scheduled', label: t('appointments.scheduled') },
    { key: 'confirmed', label: t('appointments.confirmed') },
    { key: 'completed', label: t('appointments.completed') },
    { key: 'cancelled', label: t('appointments.cancelled') },
  ];

  const filteredAppointments = appointments.filter(appointment => 
    selectedStatus === 'all' || appointment.status === selectedStatus
  );

  const getPatientById = (id: string) => patients.find(p => p.id === id);
  const getProcedureById = (id: string) => procedures.find(p => p.id === id);

  const handleDeleteAppointment = (appointmentId: string) => {
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
              await deleteAppointment(appointmentId);
              Alert.alert(t('common.success'), t('appointments.deleteSuccess'));
            } catch (error) {
              Alert.alert(t('common.error'), t('appointments.deleteError'));
              console.log('Error deleting appointment:', error);
            }
          }
        }
      ]
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/add-appointment')}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  if (appointmentsLoading) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: t('appointments.title'),
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <View style={commonStyles.container}>
        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {statuses.map((status) => (
              <Pressable
                key={status.key}
                style={[
                  styles.filterButton,
                  selectedStatus === status.key && styles.filterButtonActive
                ]}
                onPress={() => setSelectedStatus(status.key)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedStatus === status.key && styles.filterButtonTextActive
                ]}>
                  {status.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Appointments List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="calendar" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>
                {selectedStatus !== 'all' 
                  ? t('appointments.noAppointmentsFound', { status: statuses.find(s => s.key === selectedStatus)?.label.toLowerCase() })
                  : t('appointments.noAppointments')
                }
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedStatus !== 'all'
                  ? t('appointments.tryDifferentFilter')
                  : t('appointments.scheduleFirst')
                }
              </Text>
              {selectedStatus === 'all' && (
                <Button
                  variant="primary"
                  onPress={() => router.push('/add-appointment')}
                  style={styles.addButton}
                >
                  {t('appointments.scheduleFirstButton')}
                </Button>
              )}
            </View>
          ) : (
            <View style={styles.appointmentsList}>
              <Text style={styles.resultsCount}>
                {filteredAppointments.length} {filteredAppointments.length === 1 ? t('appointments.appointment') : t('appointments.appointments_plural')}
              </Text>
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  patient={getPatientById(appointment.patientId)}
                  procedure={getProcedureById(appointment.procedureId)}
                  onPress={() => router.push(`/appointment/${appointment.id}`)}
                  onEdit={() => router.push(`/edit-appointment/${appointment.id}`)}
                  onCancel={() => handleDeleteAppointment(appointment.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: colors.backgroundAlt,
  },
  filterContent: {
    gap: 8,
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  addButton: {
    width: 250,
  },
  appointmentsList: {
    paddingBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
  headerButton: {
    padding: 8,
  },
});
