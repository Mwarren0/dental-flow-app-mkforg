
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useProcedures } from '@/hooks/useData';

export default function AddProcedureScreen() {
  const { addProcedure } = useProcedures();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    code: '',
  });

  const categories = ['Preventive', 'Restorative', 'Endodontic', 'Cosmetic', 'Surgical', 'Orthodontic'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.price || !formData.duration || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const price = parseFloat(formData.price);
    const duration = parseInt(formData.duration);

    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return;
    }

    try {
      addProcedure({
        name: formData.name,
        description: formData.description,
        price,
        duration,
        category: formData.category,
        code: formData.code,
      });
      Alert.alert('Success', 'Procedure added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add procedure. Please try again.');
      console.log('Error adding procedure:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add New Procedure',
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Procedure Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Procedure Name *</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter procedure name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[commonStyles.input, styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter procedure description"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Price ($) *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Duration (minutes) *</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                placeholder="60"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={formData.category === category ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => handleInputChange('category', category)}
                  style={styles.categoryButton}
                >
                  {category}
                </Button>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Procedure Code</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.code}
              onChangeText={(value) => handleInputChange('code', value)}
              placeholder="Enter procedure code (e.g., D1110)"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
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
              Add Procedure
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
  categoryContainer: {
    marginTop: 8,
  },
  categoryButton: {
    marginRight: 8,
    minWidth: 100,
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
