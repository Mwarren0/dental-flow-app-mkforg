
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Appointment, Patient, Procedure } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  patient?: Patient;
  procedure?: Procedure;
  onPress: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  patient,
  procedure,
  onPress, 
  onEdit, 
  onCancel 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return colors.primary;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      case 'no-show': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return 'calendar';
      case 'completed': return 'checkmark.circle';
      case 'cancelled': return 'xmark.circle';
      case 'no-show': return 'exclamationmark.triangle';
      default: return 'circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.timeSection}>
          <Text style={styles.date}>{formatDate(appointment.date)}</Text>
          <Text style={styles.time}>{formatTime(appointment.time)}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <IconSymbol 
            name={getStatusIcon(appointment.status) as any} 
            color="white" 
            size={12} 
          />
          <Text style={styles.statusText}>{appointment.status.toUpperCase()}</Text>
        </View>
      </View>
      
      {patient && (
        <View style={styles.patientSection}>
          <IconSymbol name="person.circle" color={colors.primary} size={16} />
          <Text style={styles.patientName}>
            {patient.firstName} {patient.lastName}
          </Text>
        </View>
      )}
      
      {procedure && (
        <View style={styles.procedureSection}>
          <IconSymbol name="medical.thermometer" color={colors.secondary} size={16} />
          <Text style={styles.procedureName}>{procedure.name}</Text>
          <Text style={styles.procedurePrice}>{formatPrice(appointment.totalAmount)}</Text>
        </View>
      )}
      
      {appointment.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notes}>{appointment.notes}</Text>
        </View>
      )}
      
      <View style={styles.actions}>
        {onEdit && appointment.status === 'scheduled' && (
          <Pressable style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
            <IconSymbol name="pencil" color={colors.primary} size={16} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </Pressable>
        )}
        {onCancel && appointment.status === 'scheduled' && (
          <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={onCancel}>
            <IconSymbol name="xmark" color={colors.error} size={16} />
            <Text style={[styles.actionText, { color: colors.error }]}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeSection: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  patientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  procedureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  procedureName: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  procedurePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
  },
  notesSection: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  editButton: {
    backgroundColor: `${colors.primary}20`,
  },
  cancelButton: {
    backgroundColor: `${colors.error}20`,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
