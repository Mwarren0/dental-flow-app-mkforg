
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { usePatients } from '@/hooks/useData';

export default function AddPatientScreen() {
  const { addPatient } = usePatients();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    medicalHistory: '',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields (First Name, Last Name, Phone)');
      return;
    }

    try {
      addPatient(formData);
      Alert.alert('Success', 'Patient added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add patient. Please try again.');
      console.log('Error adding patient:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add New Patient',
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Enter first name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Enter last name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter email address"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[commonStyles.input, styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter full address"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <Text style={styles.sectionTitle}>Medical Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medical History</Text>
            <TextInput
              style={[commonStyles.input, styles.input, styles.textArea]}
              value={formData.medicalHistory}
              onChangeText={(value) => handleInputChange('medicalHistory', value)}
              placeholder="Enter medical history"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Allergies</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.allergies}
              onChangeText={(value) => handleInputChange('allergies', value)}
              placeholder="Enter known allergies"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <Text style={styles.sectionTitle}>Emergency Contact</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Emergency Contact Name</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.emergencyContact}
              onChangeText={(value) => handleInputChange('emergencyContact', value)}
              placeholder="Enter emergency contact name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Emergency Contact Phone</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.emergencyPhone}
              onChangeText={(value) => handleInputChange('emergencyPhone', value)}
              placeholder="Enter emergency contact phone"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

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
              Add Patient
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
    marginTop: 24,
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
    height: 80,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
  },
});
