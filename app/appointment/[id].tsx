
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
              await deleteAppointment(id!);
              Alert.alert(
                t('common.success'),
                t('appointments.deleteSuccess'),
                [{ text: t('common.ok'), onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert(t('common.error'), t('appointments.deleteError'));
              console.log('Error deleting appointment:', error);
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
              <Pressable style={styles.headerButton} onPress={handleDelete}>
                <IconSymbol name="trash" color={colors.error} size={20} />
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
              style={styles.actionButton}
            >
              <IconSymbol name="trash" color={colors.error} size={16} />
              {t('common.delete')}
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
});
