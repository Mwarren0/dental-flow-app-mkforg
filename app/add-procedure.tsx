
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useProcedures } from '@/hooks/useData';
import { Button } from '@/components/button';
import { useTranslation } from 'react-i18next';
import { IconSymbol } from '@/components/IconSymbol';

export default function AddProcedureScreen() {
  const { t } = useTranslation();
  const { addProcedure } = useProcedures();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'preventive',
    duration: '',
    price: '',
    code: '',
  });

  const categories = [
    { key: 'preventive', label: t('procedures.preventive'), icon: 'shield.checkered', color: colors.success },
    { key: 'restorative', label: t('procedures.restorative'), icon: 'wrench.and.screwdriver', color: colors.primary },
    { key: 'endodontic', label: t('procedures.endodontic'), icon: 'medical.thermometer', color: colors.warning },
    { key: 'cosmetic', label: t('procedures.cosmetic'), icon: 'sparkles', color: colors.accent },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCode = () => {
    const prefix = formData.category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${randomNum}`;
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      Alert.alert(t('common.error'), t('forms.fillRequired'));
      return;
    }

    try {
      const procedureCode = formData.code || generateCode();
      
      await addProcedure({
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration) || 30,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        code: procedureCode,
      });
      
      Alert.alert(
        t('common.success'), 
        '✅ Procedure saved to database successfully!',
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(t('common.error'), '❌ Failed to save procedure to database. Please try again.');
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
              placeholder={t('procedures.namePlaceholder')}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.description')} *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder={t('procedures.descriptionPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.category')} *</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <Pressable
                  key={category.key}
                  style={[
                    styles.categoryCard,
                    formData.category === category.key && [
                      styles.categoryCardActive,
                      { borderColor: category.color }
                    ]
                  ]}
                  onPress={() => handleInputChange('category', category.key)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <IconSymbol name={category.icon as any} color="white" size={20} />
                  </View>
                  <Text style={[
                    styles.categoryText,
                    formData.category === category.key && { color: category.color, fontWeight: '600' }
                  ]}>
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('procedures.duration')} (min)</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                placeholder="30"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('procedures.price')} * ($)</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('procedures.code')}</Text>
            <View style={styles.codeInputContainer}>
              <TextInput
                style={[styles.input, styles.codeInput]}
                value={formData.code}
                onChangeText={(value) => handleInputChange('code', value)}
                placeholder="AUTO-GENERATED"
                placeholderTextColor={colors.textSecondary}
              />
              <Pressable
                style={styles.generateButton}
                onPress={() => handleInputChange('code', generateCode())}
              >
                <IconSymbol name="arrow.clockwise" color={colors.primary} size={16} />
                <Text style={styles.generateButtonText}>Generate</Text>
              </Pressable>
            </View>
            <Text style={styles.helpText}>Leave empty to auto-generate based on category</Text>
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryCardActive: {
    backgroundColor: colors.background,
    borderWidth: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 8,
  },
  generateButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
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
