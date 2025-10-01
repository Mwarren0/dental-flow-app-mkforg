
import React, { useState } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useTranslation } from 'react-i18next';

export default function PaymentsScreen() {
  const { t } = useTranslation();
  const [payments] = useState([
    {
      id: '1',
      patientName: 'John Doe',
      amount: 250.00,
      method: 'card',
      status: 'paid',
      date: '2024-01-15',
      description: 'Dental Cleaning',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      amount: 450.00,
      method: 'cash',
      status: 'pending',
      date: '2024-01-14',
      description: 'Root Canal Treatment',
    },
    {
      id: '3',
      patientName: 'Mike Johnson',
      amount: 180.00,
      method: 'insurance',
      status: 'paid',
      date: '2024-01-13',
      description: 'Tooth Filling',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      case 'refunded': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return 'creditcard';
      case 'cash': return 'banknote';
      case 'transfer': return 'arrow.left.arrow.right';
      case 'insurance': return 'shield.checkered';
      default: return 'dollarsign.circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/add-payment')}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t('payments.title'),
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {payments.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="creditcard" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>{t('payments.noPayments')}</Text>
              <Text style={styles.emptySubtitle}>
                {t('payments.addFirstPayment')}
              </Text>
              <Pressable
                style={[styles.addButton, commonStyles.button]}
                onPress={() => router.push('/add-payment')}
              >
                <Text style={styles.addButtonText}>
                  {t('payments.addFirstPaymentButton')}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.paymentsList}>
              <Text style={styles.resultsCount}>
                {payments.length} payment{payments.length !== 1 ? 's' : ''}
              </Text>
              {payments.map((payment) => (
                <View key={payment.id} style={[styles.paymentCard, commonStyles.card]}>
                  <View style={styles.paymentHeader}>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.patientName}>{payment.patientName}</Text>
                      <Text style={styles.paymentDescription}>{payment.description}</Text>
                    </View>
                    <View style={styles.paymentAmount}>
                      <Text style={styles.amountText}>{formatPrice(payment.amount)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                          {t(`payments.${payment.status}`)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.paymentFooter}>
                    <View style={styles.paymentMethod}>
                      <IconSymbol 
                        name={getMethodIcon(payment.method) as any} 
                        color={colors.textSecondary} 
                        size={16} 
                      />
                      <Text style={styles.methodText}>
                        {t(`payments.${payment.method}`)}
                      </Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(payment.date)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  addButton: {
    width: 200,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentsList: {
    paddingBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
  paymentCard: {
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
    marginRight: 16,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodText: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerButton: {
    padding: 8,
  },
});
