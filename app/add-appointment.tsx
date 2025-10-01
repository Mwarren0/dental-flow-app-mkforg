
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import React, { useState } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAppointments, usePatients, useProcedures } from '@/hooks/useData';
import { Button } from '@/components/button';
import { useTranslation } from 'react-i18next';

export default function AddAppointmentScreen() {
  const { t } = useTranslation();
  const { addAppointment } = useAppointments();
  const { patients } = usePatients();
  const { procedures } = useProcedures();
  
  const [formData, setFormData] = useState({
    patientId: '',
    procedureId: '',
    date: '',
    time: '',
    duration: '60',
    status: 'scheduled',
    notes: '',
  });

  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showProcedurePicker, setShowProcedurePicker] = useState(false);

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedProcedure = procedures.find(p => p.id === formData.procedureId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.procedureId || !formData.date || !formData.time) {
      Alert.alert(t('common.error'), t('forms.fillRequired'));
      return;
    }

    try {
      await addAppointment({
        id: Date.now().toString(),
        ...formData,
        duration: parseInt(formData.duration) || 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      Alert.alert(t('common.success'), t('forms.saveSuccess'), [
        { text: t('common.ok'), onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert(t('common.error'), t('forms.saveError'));
      console.log('Error adding appointment:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('appointments.addAppointment'),
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{t('appointments.appointmentDetails')}</Text>
          
          {/* Patient Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.patient')} *</Text>
            <Pressable
              style={styles.picker}
              onPress={() => setShowPatientPicker(!showPatientPicker)}
            >
              <Text style={[styles.pickerText, !selectedPatient && styles.placeholderText]}>
                {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : t('common.select')}
              </Text>
              <IconSymbol name="chevron.down" color={colors.textSecondary} size={16} />
            </Pressable>
            
            {showPatientPicker && (
              <View style={styles.pickerOptions}>
                {patients.map((patient) => (
                  <Pressable
                    key={patient.id}
                    style={styles.pickerOption}
                    onPress={() => {
                      handleInputChange('patientId', patient.id);
                      setShowPatientPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>
                      {patient.firstName} {patient.lastName}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Procedure Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.procedure')} *</Text>
            <Pressable
              style={styles.picker}
              onPress={() => setShowProcedurePicker(!showProcedurePicker)}
            >
              <Text style={[styles.pickerText, !selectedProcedure && styles.placeholderText]}>
                {selectedProcedure ? selectedProcedure.name : t('common.select')}
              </Text>
              <IconSymbol name="chevron.down" color={colors.textSecondary} size={16} />
            </Pressable>
            
            {showProcedurePicker && (
              <View style={styles.pickerOptions}>
                {procedures.map((procedure) => (
                  <Pressable
                    key={procedure.id}
                    style={styles.pickerOption}
                    onPress={() => {
                      handleInputChange('procedureId', procedure.id);
                      handleInputChange('duration', procedure.duration.toString());
                      setShowProcedurePicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{procedure.name}</Text>
                    <Text style={styles.pickerOptionSubtext}>${procedure.price}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.date')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(value) => handleInputChange('date', value)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.time')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.time}
              onChangeText={(value) => handleInputChange('time', value)}
              placeholder="HH:MM"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.duration')} (minutes)</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(value) => handleInputChange('duration', value)}
              placeholder="60"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.status')}</Text>
            <View style={styles.statusContainer}>
              {['scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={formData.status === status ? 'primary' : 'secondary'}
                  onPress={() => handleInputChange('status', status)}
                  style={styles.statusButton}
                >
                  {t(`appointments.${status}`)}
                </Button>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.notes')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder={t('appointments.notes')}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              variant="secondary"
              onPress={() => router.back()}
              style={styles.button}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              style={styles.button}
            >
              {t('common.save')}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  pickerOptions: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    maxHeight: 200,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerOptionText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  pickerOptionSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flex: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 40,
  },
  button: {
    flex: 1,
  },
});
