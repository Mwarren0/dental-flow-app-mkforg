
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

  useEffect(() => {
    const foundPatient = patients.find(p => p.id === id);
    setPatient(foundPatient || null);
  }, [id, patients]);

  const handleEdit = () => {
    router.push(`/edit-patient/${id}`);
  };

  const handleDelete = () => {
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
              await deletePatient(id!);
              Alert.alert(
                t('common.success'),
                t('patients.deleteSuccess'),
                [{ text: t('common.ok'), onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert(t('common.error'), t('patients.deleteError'));
              console.log('Error deleting patient:', error);
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
              <Pressable style={styles.headerButton} onPress={handleDelete}>
                <IconSymbol name="trash" color={colors.error} size={20} />
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
});
