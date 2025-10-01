
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/app/integrations/supabase/client';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [dbStats, setDbStats] = useState<{
    patients: number;
    procedures: number;
    appointments: number;
    isConnected: boolean;
  } | null>(null);

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      const [patientsResult, proceduresResult, appointmentsResult] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact', head: true }),
        supabase.from('procedures').select('id', { count: 'exact', head: true }),
        supabase.from('appointments').select('id', { count: 'exact', head: true })
      ]);

      setDbStats({
        patients: patientsResult.count || 0,
        procedures: proceduresResult.count || 0,
        appointments: appointmentsResult.count || 0,
        isConnected: true
      });
      console.log('Database stats fetched successfully');
    } catch (error) {
      console.error('Error fetching database stats:', error);
      setDbStats({
        patients: 0,
        procedures: 0,
        appointments: 0,
        isConnected: false
      });
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      await changeLanguage(languageCode);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings.title'),
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <IconSymbol name="chevron.left" color={colors.primary} size={24} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Language Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.sectionContent}>
              {availableLanguages.map((language) => (
                <Pressable
                  key={language.code}
                  style={[
                    styles.languageOption,
                    currentLanguage === language.code && styles.languageOptionActive
                  ]}
                  onPress={() => handleLanguageChange(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={[
                      styles.languageName,
                      currentLanguage === language.code && styles.languageNameActive
                    ]}>
                      {language.nativeName}
                    </Text>
                    <Text style={[
                      styles.languageSubname,
                      currentLanguage === language.code && styles.languageSubnameActive
                    ]}>
                      {language.name}
                    </Text>
                  </View>
                  {currentLanguage === language.code && (
                    <IconSymbol name="checkmark" color={colors.primary} size={20} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Database Status Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Database Status</Text>
            <View style={styles.sectionContent}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Connection Status</Text>
                <View style={styles.statusContainer}>
                  <IconSymbol 
                    name={dbStats?.isConnected ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                    color={dbStats?.isConnected ? colors.success : colors.error} 
                    size={16} 
                  />
                  <Text style={[styles.statusText, { 
                    color: dbStats?.isConnected ? colors.success : colors.error 
                  }]}>
                    {dbStats?.isConnected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
              </View>
              {dbStats && (
                <>
                  <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Patients</Text>
                    <Text style={styles.settingValue}>{dbStats.patients}</Text>
                  </View>
                  <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Procedures</Text>
                    <Text style={styles.settingValue}>{dbStats.procedures}</Text>
                  </View>
                  <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Appointments</Text>
                    <Text style={styles.settingValue}>{dbStats.appointments}</Text>
                  </View>
                </>
              )}
              <Pressable style={styles.settingItem} onPress={fetchDatabaseStats}>
                <Text style={[styles.settingLabel, { color: colors.primary }]}>Refresh Status</Text>
                <IconSymbol name="arrow.clockwise" color={colors.primary} size={16} />
              </Pressable>
            </View>
          </View>

          {/* Other Settings Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
            <View style={styles.sectionContent}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>{t('settings.version')}</Text>
                <Text style={styles.settingValue}>1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
            <View style={styles.sectionContent}>
              <Pressable style={styles.settingItem}>
                <Text style={styles.settingLabel}>{t('settings.privacy')}</Text>
                <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
              </Pressable>
              <Pressable style={styles.settingItem}>
                <Text style={styles.settingLabel}>{t('settings.terms')}</Text>
                <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
              </Pressable>
            </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageOptionActive: {
    backgroundColor: colors.primary + '10',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  languageNameActive: {
    color: colors.primary,
  },
  languageSubname: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  languageSubnameActive: {
    color: colors.primary + 'AA',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  settingValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerButton: {
    padding: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
