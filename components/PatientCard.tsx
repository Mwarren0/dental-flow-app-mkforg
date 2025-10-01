
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Patient } from '@/types';

interface PatientCardProps {
  patient: Patient;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ 
  patient, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
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

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(patient.name)}
          </Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {patient.name}
          </Text>
          {patient.phone && (
            <Text style={styles.contact} numberOfLines={1}>
              {patient.phone}
            </Text>
          )}
          {patient.email && (
            <Text style={styles.contact} numberOfLines={1}>
              {patient.email}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <Pressable style={styles.actionButton} onPress={onEdit}>
              <IconSymbol name="pencil" color={colors.primary} size={18} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable style={styles.actionButton} onPress={onDelete}>
              <IconSymbol name="trash" color={colors.error} size={18} />
            </Pressable>
          )}
        </View>
      </View>
      
      <View style={styles.details}>
        {patient.dateOfBirth && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date of Birth:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {formatDate(patient.dateOfBirth)}
            </Text>
          </View>
        )}
        {patient.allergies && patient.allergies !== 'None known' && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Allergies:</Text>
            <Text style={[styles.detailValue, styles.allergyText]} numberOfLines={2}>
              {patient.allergies}
            </Text>
          </View>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  patientInfo: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  contact: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 3,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  details: {
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '400',
    flex: 2,
    textAlign: 'right',
  },
  allergyText: {
    color: colors.warning,
    fontWeight: '600',
  },
});
