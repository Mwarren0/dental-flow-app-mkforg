
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { StatCard } from '@/components/StatCard';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useDashboardStats, usePatients, useAppointments, useProcedures } from '@/hooks/useData';
import { supabase } from '@/app/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { debugConfig, debugLog } from '@/config/debug';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { patients, loading: patientsLoading } = usePatients();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  const { procedures, loading: proceduresLoading } = useProcedures();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('patients').select('count', { count: 'exact', head: true });
      if (error) {
        debugLog('error', 'Connection check failed:', error);
        setConnectionStatus('disconnected');
      } else {
        debugLog('info', 'Connection successful, patient count:', data);
        setConnectionStatus('connected');
      }
    } catch (error) {
      debugLog('error', 'Connection check error:', error);
      setConnectionStatus('disconnected');
    }
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      {debugConfig.showTestDataButton && (
        <Pressable onPress={() => router.push('/test-data')} style={styles.headerButton}>
          <IconSymbol name="wrench" color={colors.text} size={20} />
        </Pressable>
      )}
      <Pressable onPress={() => router.push('/settings')} style={styles.headerButton}>
        <IconSymbol name="gearshape" color={colors.text} size={24} />
      </Pressable>
    </View>
  );

  debugLog('debug', 'Dashboard render - Stats:', stats);
  debugLog('debug', 'Dashboard render - Patients:', { count: patients.length, loading: patientsLoading });
  debugLog('debug', 'Dashboard render - Appointments:', { count: appointments.length, loading: appointmentsLoading });
  debugLog('debug', 'Dashboard render - Procedures:', { count: procedures.length, loading: proceduresLoading });

  return (
    <>
      <Stack.Screen
        options={{
          title: t('dashboard.title'),
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView 
        style={commonStyles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Connection Status - Only show if enabled in debug config */}
          {debugConfig.showConnectionStatus && (
            <View style={styles.connectionStatus}>
              <View style={[
                styles.connectionIndicator,
                { backgroundColor: connectionStatus === 'connected' ? colors.success : colors.error }
              ]} />
              <Text style={styles.connectionText}>
                {t('dashboard.connectionStatus')}: {connectionStatus === 'connected' ? t('dashboard.connected') : t('dashboard.disconnected')}
              </Text>
            </View>
          )}

          {/* Debug Info - Only show if enabled */}
          {debugConfig.showDataCounts && (
            <View style={[commonStyles.card, styles.debugCard]}>
              <Text style={styles.debugTitle}>Debug Information</Text>
              <Text style={styles.debugText}>Patients: {patients.length} (loading: {patientsLoading ? 'yes' : 'no'})</Text>
              <Text style={styles.debugText}>Appointments: {appointments.length} (loading: {appointmentsLoading ? 'yes' : 'no'})</Text>
              <Text style={styles.debugText}>Procedures: {procedures.length} (loading: {proceduresLoading ? 'yes' : 'no'})</Text>
              <Text style={styles.debugText}>Stats loading: {statsLoading ? 'yes' : 'no'}</Text>
              <Text style={styles.debugText}>Connection: {connectionStatus}</Text>
              {debugConfig.showTestDataButton && (
                <Pressable 
                  style={styles.testButton} 
                  onPress={() => router.push('/test-data')}
                >
                  <Text style={styles.testButtonText}>Test Data Fetching</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              title={t('dashboard.totalPatients')}
              value={stats?.totalPatients?.toString() || '0'}
              icon="person.2"
              color={colors.primary}
              onPress={() => router.push('/patients')}
            />
            <StatCard
              title={t('dashboard.totalProcedures')}
              value={stats?.totalProcedures?.toString() || '0'}
              icon="medical.thermometer"
              color={colors.secondary}
              onPress={() => router.push('/procedures')}
            />
            <StatCard
              title={t('dashboard.totalAppointments')}
              value={stats?.totalAppointments?.toString() || '0'}
              icon="calendar"
              color={colors.accent}
              onPress={() => router.push('/appointments')}
            />
            <StatCard
              title={t('dashboard.totalRevenue')}
              value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
              icon="dollarsign.circle"
              color={colors.success}
              onPress={() => router.push('/payments')}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>{t('dashboard.quickActions')}</Text>
            <View style={styles.actionGrid}>
              <Pressable
                style={[styles.actionCard, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/add-patient')}
              >
                <IconSymbol name="person.badge.plus" color="white" size={24} />
                <Text style={styles.actionText}>{t('dashboard.addPatient')}</Text>
              </Pressable>
              <Pressable
                style={[styles.actionCard, { backgroundColor: colors.secondary }]}
                onPress={() => router.push('/add-appointment')}
              >
                <IconSymbol name="calendar.badge.plus" color="white" size={24} />
                <Text style={styles.actionText}>{t('dashboard.scheduleAppointment')}</Text>
              </Pressable>
              <Pressable
                style={[styles.actionCard, { backgroundColor: colors.accent }]}
                onPress={() => router.push('/add-procedure')}
              >
                <IconSymbol name="plus.circle" color="white" size={24} />
                <Text style={styles.actionText}>{t('dashboard.addProcedure')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    padding: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  connectionIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  connectionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  debugCard: {
    marginBottom: 24,
    backgroundColor: colors.backgroundAlt,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  debugText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 16,
  },
  testButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: 140,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});
