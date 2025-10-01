
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useProcedures } from '@/hooks/useData';
import { Button } from '@/components/button';
import { useTranslation } from 'react-i18next';

export default function AddProcedureScreen() {
  const { t } = useTranslation();
  const { addProcedure } = useProcedures();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: 'preventive',
    duration: '',
    price: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.description || !formData.price) {
      Alert.alert(t('common.error'), t('forms.fillRequired'));
      return;
    }

    try {
      await addProcedure({
        id: Date.now().toString(),
        ...formData,
        duration: parseInt(formData.duration) || 30,
        price: parseFloat(formData.price) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      Alert.alert(t('common.success'), t('forms.saveSuccess'), [
        { text: t('common.ok'), onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert(t('common.error'), t('forms.saveError'));
      console.log('Error adding procedure:', error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('procedures.addProcedure'),
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{t('procedures.procedureDetails')}</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.name')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder={t('procedures.name')}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.code')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.code}
              onChangeText={(value) => handleInputChange('code', value)}
              placeholder={t('procedures.code')}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.description')} *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder={t('procedures.description')}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.category')}</Text>
            <View style={styles.categoryContainer}>
              {['preventive', 'restorative', 'endodontic', 'cosmetic'].map((category) => (
                <Button
                  key={category}
                  variant={formData.category === category ? 'primary' : 'secondary'}
                  onPress={() => handleInputChange('category', category)}
                  style={styles.categoryButton}
                >
                  {t(`procedures.${category}`)}
                </Button>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.duration')}</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(value) => handleInputChange('duration', value)}
              placeholder="30"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.price')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
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
