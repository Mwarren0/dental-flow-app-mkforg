
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAppointments, usePatients, useProcedures } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';

export default function EditAppointmentScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appointments, updateAppointment } = useAppointments();
  const { patients } = usePatients();
  const { procedures } = useProcedures();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    procedureId: '',
    date: '',
    time: '',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
    notes: '',
  });

  const statuses = [
    { key: 'scheduled', label: t('appointments.scheduled'), icon: 'calendar', color: colors.primary },
    { key: 'confirmed', label: t('appointments.confirmed'), icon: 'checkmark.circle', color: colors.secondary },
    { key: 'completed', label: t('appointments.completed'), icon: 'checkmark.circle.fill', color: colors.success },
    { key: 'cancelled', label: t('appointments.cancelled'), icon: 'xmark.circle', color: colors.error },
  ];

  useEffect(() => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      const dateTime = new Date(appointment.dateTime);
      setFormData({
        patientId: appointment.patientId || '',
        procedureId: appointment.procedureId || '',
        date: dateTime.toISOString().split('T')[0],
        time: dateTime.toTimeString().slice(0, 5),
        status: appointment.status,
        notes: appointment.notes || '',
      });
    }
  }, [id, appointments]);

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
    return date.toTimeString().slice(0, 5);
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
    if (!formData.patientId) {
      Alert.alert(t('common.error'), t('appointments.patientRequired'));
      return;
    }

    if (!formData.procedureId) {
      Alert.alert(t('common.error'), t('appointments.procedureRequired'));
      return;
    }

    if (!formData.date) {
      Alert.alert(t('common.error'), t('appointments.dateRequired'));
      return;
    }

    if (!formData.time) {
      Alert.alert(t('common.error'), t('appointments.timeRequired'));
      return;
    }

    try {
      setLoading(true);
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      await updateAppointment(id!, {
        patientId: formData.patientId,
        procedureId: formData.procedureId,
        dateTime: dateTime,
        status: formData.status,
        notes: formData.notes.trim(),
      });
      
      Alert.alert(
        t('common.success'),
        t('appointments.updateSuccess'),
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error) {
      console.log('Error updating appointment:', error);
      Alert.alert(t('common.error'), t('appointments.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const appointment = appointments.find(a => a.id === id);
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

  return (
    <>
      <Stack.Screen
        options={{
          title: t('appointments.editAppointment'),
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('appointments.patient')} *</Text>
            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>{t('appointments.selectPatient')}</Text>
              <ScrollView style={styles.optionsList} nestedScrollEnabled>
                {patients.map((patient) => (
                  <Pressable
                    key={patient.id}
                    style={[
                      styles.option,
                      formData.patientId === patient.id && styles.optionSelected
                    ]}
                    onPress={() => handleInputChange('patientId', patient.id)}
                  >
                    <View style={styles.optionContent}>
                      <Text style={[
                        styles.optionText,
                        formData.patientId === patient.id && styles.optionTextSelected
                      ]}>
                        {patient.name}
                      </Text>
                      {patient.phone && (
                        <Text style={[
                          styles.optionSubtext,
                          formData.patientId === patient.id && styles.optionSubtextSelected
                        ]}>
                          {patient.phone}
                        </Text>
                      )}
                    </View>
                    {formData.patientId === patient.id && (
                      <IconSymbol name="checkmark" color="white" size={20} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('appointments.procedure')} *</Text>
            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>{t('appointments.selectProcedure')}</Text>
              <ScrollView style={styles.optionsList} nestedScrollEnabled>
                {procedures.map((procedure) => (
                  <Pressable
                    key={procedure.id}
                    style={[
                      styles.option,
                      formData.procedureId === procedure.id && styles.optionSelected
                    ]}
                    onPress={() => handleInputChange('procedureId', procedure.id)}
                  >
                    <View style={styles.optionContent}>
                      <Text style={[
                        styles.optionText,
                        formData.procedureId === procedure.id && styles.optionTextSelected
                      ]}>
                        {procedure.name}
                      </Text>
                      <Text style={[
                        styles.optionSubtext,
                        formData.procedureId === procedure.id && styles.optionSubtextSelected
                      ]}>
                        ${procedure.price.toFixed(2)} • {procedure.duration}min
                      </Text>
                    </View>
                    {formData.procedureId === procedure.id && (
                      <IconSymbol name="checkmark" color="white" size={20} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('appointments.date')} *</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={formData.date}
                  onChangeText={(value) => handleInputChange('date', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                />
                <Pressable style={styles.inputButton} onPress={setToday}>
                  <Text style={styles.inputButtonText}>{t('appointments.today')}</Text>
                </Pressable>
              </View>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('appointments.time')} *</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={formData.time}
                  onChangeText={(value) => handleInputChange('time', value)}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textSecondary}
                />
                <Pressable style={styles.inputButton} onPress={setCurrentTime}>
                  <Text style={styles.inputButtonText}>{t('appointments.now')}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('appointments.status')} *</Text>
            <View style={styles.statusGrid}>
              {statuses.map((status) => (
                <Pressable
                  key={status.key}
                  style={[
                    styles.statusOption,
                    formData.status === status.key && [styles.statusOptionSelected, { borderColor: status.color }]
                  ]}
                  onPress={() => handleInputChange('status', status.key)}
                >
                  <IconSymbol 
                    name={status.icon as any} 
                    color={formData.status === status.key ? status.color : colors.textSecondary} 
                    size={20} 
                  />
                  <Text style={[
                    styles.statusText,
                    formData.status === status.key && { color: status.color }
                  ]}>
                    {status.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
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
              loading={loading}
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
  inputGroup: {
    marginBottom: 24,
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 8,
  },
  inputFlex: {
    flex: 1,
  },
  inputButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
  },
  inputButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  selectLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    padding: 16,
    paddingBottom: 8,
    fontWeight: '500',
  },
  optionsList: {
    maxHeight: 200,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  optionTextSelected: {
    color: 'white',
  },
  optionSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionSubtextSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 12,
  },
  statusOptionSelected: {
    borderWidth: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
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
