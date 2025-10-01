
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/button';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAppointments, usePatients, useProcedures } from '@/hooks/useData';

export default function AddAppointmentScreen() {
  const { addAppointment } = useAppointments();
  const { patients } = usePatients();
  const { procedures } = useProcedures();
  
  const [formData, setFormData] = useState({
    patientId: '',
    procedureId: '',
    date: '',
    time: '',
    notes: '',
  });

  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showProcedurePicker, setShowProcedurePicker] = useState(false);

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedProcedure = procedures.find(p => p.id === formData.procedureId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.patientId || !formData.procedureId || !formData.date || !formData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      addAppointment({
        patientId: formData.patientId,
        procedureId: formData.procedureId,
        date: formData.date,
        time: formData.time,
        status: 'scheduled',
        notes: formData.notes,
        totalAmount: selectedProcedure?.price || 0,
      });
      Alert.alert('Success', 'Appointment scheduled successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule appointment. Please try again.');
      console.log('Error adding appointment:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Schedule Appointment',
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          {/* Patient Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patient *</Text>
            <Pressable
              style={[styles.picker, !selectedPatient && styles.pickerEmpty]}
              onPress={() => setShowPatientPicker(!showPatientPicker)}
            >
              <Text style={[styles.pickerText, !selectedPatient && styles.pickerPlaceholder]}>
                {selectedPatient 
                  ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                  : 'Select a patient'
                }
              </Text>
              <IconSymbol 
                name={showPatientPicker ? "chevron.up" : "chevron.down"} 
                color={colors.textSecondary} 
                size={16} 
              />
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
                    <Text style={styles.pickerOptionSubtext}>{patient.phone}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Procedure Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Procedure *</Text>
            <Pressable
              style={[styles.picker, !selectedProcedure && styles.pickerEmpty]}
              onPress={() => setShowProcedurePicker(!showProcedurePicker)}
            >
              <Text style={[styles.pickerText, !selectedProcedure && styles.pickerPlaceholder]}>
                {selectedProcedure 
                  ? selectedProcedure.name
                  : 'Select a procedure'
                }
              </Text>
              <IconSymbol 
                name={showProcedurePicker ? "chevron.up" : "chevron.down"} 
                color={colors.textSecondary} 
                size={16} 
              />
            </Pressable>
            
            {showProcedurePicker && (
              <View style={styles.pickerOptions}>
                {procedures.map((procedure) => (
                  <Pressable
                    key={procedure.id}
                    style={styles.pickerOption}
                    onPress={() => {
                      handleInputChange('procedureId', procedure.id);
                      setShowProcedurePicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{procedure.name}</Text>
                    <Text style={styles.pickerOptionSubtext}>
                      ${procedure.price} • {procedure.duration}min
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Date and Time */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={formData.date}
                onChangeText={(value) => handleInputChange('date', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Time *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={formData.time}
                onChangeText={(value) => handleInputChange('time', value)}
                placeholder="HH:MM"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[commonStyles.input, styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Enter appointment notes"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Summary */}
          {selectedProcedure && (
            <View style={[commonStyles.card, styles.summary]}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Procedure:</Text>
                <Text style={styles.summaryValue}>{selectedProcedure.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration:</Text>
                <Text style={styles.summaryValue}>{selectedProcedure.duration} minutes</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cost:</Text>
                <Text style={[styles.summaryValue, styles.summaryPrice]}>
                  ${selectedProcedure.price.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              variant="outline"
              onPress={() => router.back()}
              style={styles.button}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              style={styles.button}
            >
              Schedule Appointment
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
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.backgroundAlt,
  },
  pickerEmpty: {
    borderColor: colors.border,
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  pickerPlaceholder: {
    color: colors.textSecondary,
  },
  pickerOptions: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
    maxHeight: 200,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerOptionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  pickerOptionSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summary: {
    marginTop: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  summaryPrice: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
  },
});
