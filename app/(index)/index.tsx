
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { StatCard } from '@/components/StatCard';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useDashboardStats, usePatients, useAppointments, useProcedures } from '@/hooks/useData';
import { supabase } from '@/app/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

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
        console.error('Connection check failed:', error);
        setConnectionStatus('disconnected');
      } else {
        console.log('Connection successful, patient count:', data);
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Connection check error:', error);
      setConnectionStatus('disconnected');
    }
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      <Pressable onPress={() => router.push('/test-data')} style={styles.headerButton}>
        <IconSymbol name="wrench" color={colors.text} size={20} />
      </Pressable>
      <Pressable onPress={() => router.push('/settings')} style={styles.headerButton}>
        <IconSymbol name="gearshape" color={colors.text} size={24} />
      </Pressable>
    </View>
  );

  console.log('Dashboard render - Stats:', stats);
  console.log('Dashboard render - Patients:', patients.length, 'loading:', patientsLoading);
  console.log('Dashboard render - Appointments:', appointments.length, 'loading:', appointmentsLoading);
  console.log('Dashboard render - Procedures:', procedures.length, 'loading:', proceduresLoading);

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
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Connection Status */}
          <View style={styles.connectionStatus}>
            <View style={[
              styles.connectionIndicator,
              { backgroundColor: connectionStatus === 'connected' ? colors.success : colors.error }
            ]} />
            <Text style={styles.connectionText}>
              {t('dashboard.connectionStatus')}: {connectionStatus === 'connected' ? t('dashboard.connected') : t('dashboard.disconnected')}
            </Text>
          </View>

          {/* Debug Info */}
          <View style={[commonStyles.card, styles.debugCard]}>
            <Text style={styles.debugTitle}>Debug Information</Text>
            <Text style={styles.debugText}>Patients: {patients.length} (loading: {patientsLoading ? 'yes' : 'no'})</Text>
            <Text style={styles.debugText}>Appointments: {appointments.length} (loading: {appointmentsLoading ? 'yes' : 'no'})</Text>
            <Text style={styles.debugText}>Procedures: {procedures.length} (loading: {proceduresLoading ? 'yes' : 'no'})</Text>
            <Text style={styles.debugText}>Stats loading: {statsLoading ? 'yes' : 'no'}</Text>
            <Text style={styles.debugText}>Connection: {connectionStatus}</Text>
            <Pressable 
              style={styles.testButton} 
              onPress={() => router.push('/test-data')}
            >
              <Text style={styles.testButtonText}>Test Data Fetching</Text>
            </Pressable>
          </View>

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
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <Pressable
                style={[styles.actionCard, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/add-patient')}
              >
                <IconSymbol name="person.badge.plus" color="white" size={24} />
                <Text style={styles.actionText}>Add Patient</Text>
              </Pressable>
              <Pressable
                style={[styles.actionCard, { backgroundColor: colors.secondary }]}
                onPress={() => router.push('/add-appointment')}
              >
                <IconSymbol name="calendar.badge.plus" color="white" size={24} />
                <Text style={styles.actionText}>Schedule Appointment</Text>
              </Pressable>
              <Pressable
                style={[styles.actionCard, { backgroundColor: colors.accent }]}
                onPress={() => router.push('/add-procedure')}
              >
                <IconSymbol name="plus.circle" color="white" size={24} />
                <Text style={styles.actionText}>Add Procedure</Text>
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  debugCard: {
    marginBottom: 20,
    backgroundColor: colors.backgroundAlt,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  testButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  quickActions: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
