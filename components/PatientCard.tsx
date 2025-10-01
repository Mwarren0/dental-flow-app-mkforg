
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
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(patient.firstName, patient.lastName)}
          </Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.name}>
            {patient.firstName} {patient.lastName}
          </Text>
          <Text style={styles.contact}>{patient.phone}</Text>
          <Text style={styles.contact}>{patient.email}</Text>
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
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date of Birth:</Text>
          <Text style={styles.detailValue}>{formatDate(patient.dateOfBirth)}</Text>
        </View>
        {patient.allergies && patient.allergies !== 'None known' && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Allergies:</Text>
            <Text style={[styles.detailValue, styles.allergyText]}>{patient.allergies}</Text>
          </View>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  patientInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '400',
  },
  allergyText: {
    color: colors.warning,
    fontWeight: '600',
  },
});
