
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Pressable } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useProcedures } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';

export default function EditProcedureScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { procedures, updateProcedure } = useProcedures();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: 'preventive',
    code: '',
  });

  const categories = [
    { key: 'preventive', label: t('procedures.preventive'), icon: 'shield.checkered' },
    { key: 'restorative', label: t('procedures.restorative'), icon: 'wrench.and.screwdriver' },
    { key: 'endodontic', label: t('procedures.endodontic'), icon: 'medical.thermometer' },
    { key: 'cosmetic', label: t('procedures.cosmetic'), icon: 'sparkles' },
  ];

  useEffect(() => {
    const procedure = procedures.find(p => p.id === id);
    if (procedure) {
      setFormData({
        name: procedure.name || '',
        description: procedure.description || '',
        duration: procedure.duration?.toString() || '',
        price: procedure.price?.toString() || '',
        category: procedure.category || 'preventive',
        code: procedure.code || '',
      });
    }
  }, [id, procedures]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert(t('common.error'), t('procedures.nameRequired'));
      return;
    }

    if (!formData.price || isNaN(parseFloat(formData.price))) {
      Alert.alert(t('common.error'), t('procedures.priceRequired'));
      return;
    }

    if (!formData.duration || isNaN(parseInt(formData.duration))) {
      Alert.alert(t('common.error'), t('procedures.durationRequired'));
      return;
    }

    try {
      setLoading(true);
      await updateProcedure(id!, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        category: formData.category,
        code: formData.code.trim(),
      });
      Alert.alert(
        t('common.success'),
        t('procedures.updateSuccess'),
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error) {
      console.log('Error updating procedure:', error);
      Alert.alert(t('common.error'), t('procedures.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const procedure = procedures.find(p => p.id === id);
  if (!procedure) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>{t('procedures.notFound')}</Text>
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
          title: t('procedures.editProcedure'),
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('procedures.name')} *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder={t('procedures.namePlaceholder')}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('procedures.description')}</Text>
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

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('procedures.duration')} * (min)</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                placeholder="30"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>{t('procedures.price')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="100.00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('procedures.category')} *</Text>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <Pressable
                  key={category.key}
                  style={[
                    styles.categoryOption,
                    formData.category === category.key && styles.categoryOptionSelected
                  ]}
                  onPress={() => handleInputChange('category', category.key)}
                >
                  <IconSymbol 
                    name={category.icon as any} 
                    color={formData.category === category.key ? 'white' : colors.primary} 
                    size={24} 
                  />
                  <Text style={[
                    styles.categoryText,
                    formData.category === category.key && styles.categoryTextSelected
                  ]}>
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('procedures.code')}</Text>
            <TextInput
              style={styles.input}
              value={formData.code}
              onChangeText={(value) => handleInputChange('code', value)}
              placeholder="D1110"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  categoryOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: 'white',
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
