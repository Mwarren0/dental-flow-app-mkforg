
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { StatCard } from '@/components/StatCard';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useDashboardStats } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { stats, loading } = useDashboardStats();

  const quickActions = [
    {
      title: t('navigation.patients'),
      icon: 'person.2',
      color: colors.primary,
      route: '/patients',
      description: t('dashboard.managePatients'),
    },
    {
      title: t('navigation.appointments'),
      icon: 'calendar',
      color: colors.secondary,
      route: '/appointments',
      description: t('dashboard.scheduleAppointments'),
    },
    {
      title: t('navigation.procedures'),
      icon: 'medical.thermometer',
      color: colors.accent,
      route: '/procedures',
      description: t('dashboard.manageProcedures'),
    },
    {
      title: t('navigation.payments'),
      icon: 'creditcard',
      color: colors.success,
      route: '/payments',
      description: t('dashboard.trackPayments'),
    },
  ];

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/settings')}
      style={styles.headerButton}
    >
      <IconSymbol name="gear" color={colors.primary} size={24} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>{t('common.loading')}</Text>
      </View>
    );
  }

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
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>{t('dashboard.welcome')}</Text>
            <Text style={styles.welcomeSubtitle}>
              {t('dashboard.overview')}
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>{t('dashboard.todaysOverview')}</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title={t('dashboard.todaysAppointments')}
                value={stats?.todayAppointments || 0}
                icon="calendar"
                color={colors.primary}
              />
              <StatCard
                title={t('dashboard.totalPatients')}
                value={stats?.totalPatients || 0}
                icon="person.2"
                color={colors.secondary}
              />
            </View>
            <View style={styles.statsGrid}>
              <StatCard
                title={t('dashboard.weeklyRevenue')}
                value={`$${stats?.weeklyRevenue || 0}`}
                icon="dollarsign.circle"
                color={colors.success}
              />
              <StatCard
                title={t('dashboard.pendingPayments')}
                value={stats?.pendingPayments || 0}
                icon="exclamationmark.triangle"
                color={colors.warning}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>{t('dashboard.quickActions')}</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <Pressable
                  key={action.route}
                  style={[styles.actionCard, commonStyles.card]}
                  onPress={() => router.push(action.route as any)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <IconSymbol name={action.icon as any} color="white" size={24} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>{action.description}</Text>
                </Pressable>
              ))}
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
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  headerButton: {
    padding: 8,
  },
});
