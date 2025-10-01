
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
    status: 'scheduled',
    notes: '',
  });

  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showProcedurePicker, setShowProcedurePicker] = useState(false);

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedProcedure = procedures.find(p => p.id === formData.procedureId);

  const statusOptions = [
    { key: 'scheduled', label: t('appointments.scheduled'), color: colors.primary, icon: 'calendar' },
    { key: 'confirmed', label: t('appointments.confirmed'), color: colors.secondary, icon: 'checkmark.circle' },
    { key: 'completed', label: t('appointments.completed'), color: colors.success, icon: 'checkmark.circle.fill' },
    { key: 'cancelled', label: t('appointments.cancelled'), color: colors.error, icon: 'xmark.circle' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().split(' ')[0].substring(0, 5);
  };

  const setToday = () => {
    const today = new Date();
    handleInputChange('date', formatDate(today));
  };

  const setCurrentTime = () => {
    const now = new Date();
    handleInputChange('time', formatTime(now));
  };

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.procedureId || !formData.date || !formData.time) {
      Alert.alert(t('common.error'), t('forms.fillRequired'));
      return;
    }

    try {
      // Combine date and time into a single datetime string
      const dateTimeString = `${formData.date}T${formData.time}:00`;
      
      await addAppointment({
        patientId: formData.patientId,
        procedureId: formData.procedureId,
        dateTime: dateTimeString,
        status: formData.status as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
        notes: formData.notes,
      });
      
      Alert.alert(
        t('common.success'), 
        '✅ Appointment saved to database successfully!',
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t('common.error'), '❌ Failed to save appointment to database. Please try again.');
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
              style={[styles.picker, selectedPatient && styles.pickerSelected]}
              onPress={() => setShowPatientPicker(!showPatientPicker)}
            >
              <View style={styles.pickerContent}>
                {selectedPatient ? (
                  <View style={styles.selectedItem}>
                    <View style={styles.selectedAvatar}>
                      <Text style={styles.selectedAvatarText}>
                        {selectedPatient.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.selectedInfo}>
                      <Text style={styles.selectedName}>{selectedPatient.name}</Text>
                      <Text style={styles.selectedDetails}>{selectedPatient.phone}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>{t('appointments.selectPatient')}</Text>
                )}
              </View>
              <IconSymbol 
                name={showPatientPicker ? "chevron.up" : "chevron.down"} 
                color={colors.textSecondary} 
                size={16} 
              />
            </Pressable>
            
            {showPatientPicker && (
              <View style={styles.pickerOptions}>
                <ScrollView style={styles.pickerScrollView} nestedScrollEnabled>
                  {patients.map((patient) => (
                    <Pressable
                      key={patient.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        handleInputChange('patientId', patient.id);
                        setShowPatientPicker(false);
                      }}
                    >
                      <View style={styles.optionAvatar}>
                        <Text style={styles.optionAvatarText}>
                          {patient.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionName}>{patient.name}</Text>
                        <Text style={styles.optionDetails}>{patient.phone} • {patient.email}</Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Procedure Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.procedure')} *</Text>
            <Pressable
              style={[styles.picker, selectedProcedure && styles.pickerSelected]}
              onPress={() => setShowProcedurePicker(!showProcedurePicker)}
            >
              <View style={styles.pickerContent}>
                {selectedProcedure ? (
                  <View style={styles.selectedItem}>
                    <View style={[styles.selectedAvatar, { backgroundColor: colors.secondary }]}>
                      <IconSymbol name="medical.thermometer" color="white" size={16} />
                    </View>
                    <View style={styles.selectedInfo}>
                      <Text style={styles.selectedName}>{selectedProcedure.name}</Text>
                      <Text style={styles.selectedDetails}>
                        ${selectedProcedure.price} • {selectedProcedure.duration}min
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>{t('appointments.selectProcedure')}</Text>
                )}
              </View>
              <IconSymbol 
                name={showProcedurePicker ? "chevron.up" : "chevron.down"} 
                color={colors.textSecondary} 
                size={16} 
              />
            </Pressable>
            
            {showProcedurePicker && (
              <View style={styles.pickerOptions}>
                <ScrollView style={styles.pickerScrollView} nestedScrollEnabled>
                  {procedures.map((procedure) => (
                    <Pressable
                      key={procedure.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        handleInputChange('procedureId', procedure.id);
                        setShowProcedurePicker(false);
                      }}
                    >
                      <View style={[styles.optionAvatar, { backgroundColor: colors.secondary }]}>
                        <IconSymbol name="medical.thermometer" color="white" size={16} />
                      </View>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionName}>{procedure.name}</Text>
                        <Text style={styles.optionDetails}>
                          ${procedure.price} • {procedure.duration}min • {procedure.category}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Date and Time */}
          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('appointments.date')} *</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={formData.date}
                  onChangeText={(value) => handleInputChange('date', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                />
                <Pressable style={styles.quickButton} onPress={setToday}>
                  <Text style={styles.quickButtonText}>Today</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('appointments.time')} *</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={formData.time}
                  onChangeText={(value) => handleInputChange('time', value)}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textSecondary}
                />
                <Pressable style={styles.quickButton} onPress={setCurrentTime}>
                  <Text style={styles.quickButtonText}>Now</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Status Selection */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.status')}</Text>
            <View style={styles.statusGrid}>
              {statusOptions.map((status) => (
                <Pressable
                  key={status.key}
                  style={[
                    styles.statusCard,
                    formData.status === status.key && [
                      styles.statusCardActive,
                      { borderColor: status.color }
                    ]
                  ]}
                  onPress={() => handleInputChange('status', status.key)}
                >
                  <View style={[styles.statusIcon, { backgroundColor: status.color }]}>
                    <IconSymbol name={status.icon as any} color="white" size={16} />
                  </View>
                  <Text style={[
                    styles.statusText,
                    formData.status === status.key && { color: status.color, fontWeight: '600' }
                  ]}>
                    {status.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('appointments.notes')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder={t('appointments.notesPlaceholder')}
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
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  inputFlex: {
    flex: 1,
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  quickButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 8,
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
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
    minHeight: 48,
  },
  pickerSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}05`,
  },
  pickerContent: {
    flex: 1,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  selectedDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  placeholderText: {
    fontSize: 16,
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
  pickerScrollView: {
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  optionDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  statusCardActive: {
    backgroundColor: colors.background,
    borderWidth: 2,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
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
