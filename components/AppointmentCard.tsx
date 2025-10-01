
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
      weekday: 'short',
      month: 'short',
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

  const handleEdit = (e: any) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleCancel = (e: any) => {
    e.stopPropagation();
    onCancel?.();
  };

  const { dateStr, timeStr } = formatDateTime(appointment.dateTime);

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.timeSection}>
          <Text style={styles.date} numberOfLines={1}>{dateStr}</Text>
          <Text style={styles.time} numberOfLines={1}>{timeStr}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <IconSymbol 
            name={getStatusIcon(appointment.status) as any} 
            color="white" 
            size={12} 
          />
          <Text style={styles.statusText} numberOfLines={1}>
            {appointment.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      {patient && (
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <IconSymbol name="person.circle" color={colors.primary} size={16} />
            <Text style={styles.infoText} numberOfLines={1}>
              {patient.name}
            </Text>
          </View>
        </View>
      )}
      
      {procedure && (
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <IconSymbol name="medical.thermometer" color={colors.secondary} size={16} />
            <Text style={styles.infoText} numberOfLines={1}>
              {procedure.name}
            </Text>
            <Text style={styles.priceText}>
              {formatPrice(procedure.price)}
            </Text>
          </View>
        </View>
      )}
      
      {appointment.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notes} numberOfLines={3}>
            {appointment.notes}
          </Text>
        </View>
      )}
      
      <View style={styles.actions}>
        {onEdit && (appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
          <Pressable style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
            <IconSymbol name="pencil" color={colors.primary} size={16} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </Pressable>
        )}
        {onCancel && (appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
          <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={handleCancel}>
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
    marginBottom: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeSection: {
    flex: 1,
    paddingRight: 12,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    minWidth: 80,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  infoSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 20,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  notesSection: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: `${colors.primary}20`,
  },
  cancelButton: {
    backgroundColor: `${colors.error}20`,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
