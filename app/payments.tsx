
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function PaymentsScreen() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statuses = ['all', 'completed', 'pending', 'failed'];

  // Mock payment data for demonstration
  const mockPayments = [
    {
      id: '1',
      patientName: 'John Doe',
      amount: 120,
      method: 'card',
      status: 'completed',
      date: '2024-01-20',
      procedure: 'Dental Cleaning',
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      amount: 180,
      method: 'cash',
      status: 'pending',
      date: '2024-01-25',
      procedure: 'Tooth Filling',
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      amount: 800,
      method: 'insurance',
      status: 'completed',
      date: '2024-01-22',
      procedure: 'Root Canal',
    },
  ];

  const filteredPayments = mockPayments.filter(payment => 
    selectedStatus === 'all' || payment.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return 'creditcard';
      case 'cash': return 'dollarsign.circle';
      case 'insurance': return 'shield';
      case 'bank_transfer': return 'building.columns';
      default: return 'questionmark.circle';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
          title: 'Payments',
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <View style={commonStyles.container}>
        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {statuses.map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.filterButton,
                  selectedStatus === status && styles.filterButtonActive
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.filterButtonTextActive
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[commonStyles.card, styles.summaryCard]}>
            <Text style={styles.summaryLabel}>Total Revenue</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              ${mockPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </Text>
          </View>
          <View style={[commonStyles.card, styles.summaryCard]}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={[styles.summaryValue, { color: colors.warning }]}>
              ${mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payments List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredPayments.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="creditcard" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>
                {selectedStatus !== 'all' ? `No ${selectedStatus} payments` : 'No payments yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {selectedStatus !== 'all'
                  ? 'Try selecting a different status filter'
                  : 'Payments will appear here as they are processed'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.paymentsList}>
              <Text style={styles.resultsCount}>
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
              </Text>
              {filteredPayments.map((payment) => (
                <Pressable
                  key={payment.id}
                  style={[commonStyles.card, styles.paymentCard]}
                  onPress={() => console.log('View payment:', payment.id)}
                >
                  <View style={styles.paymentHeader}>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.patientName}>{payment.patientName}</Text>
                      <Text style={styles.procedureName}>{payment.procedure}</Text>
                    </View>
                    <View style={styles.paymentAmount}>
                      <Text style={styles.amountText}>{formatPrice(payment.amount)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) }]}>
                        <Text style={styles.statusText}>{payment.status.toUpperCase()}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.paymentDetails}>
                    <View style={styles.detailItem}>
                      <IconSymbol 
                        name={getMethodIcon(payment.method) as any} 
                        color={colors.textSecondary} 
                        size={16} 
                      />
                      <Text style={styles.detailText}>
                        {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <IconSymbol name="calendar" color={colors.textSecondary} size={16} />
                      <Text style={styles.detailText}>{formatDate(payment.date)}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: colors.backgroundAlt,
  },
  filterContent: {
    gap: 8,
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
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
    marginRight: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  procedureName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  paymentDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerButton: {
    padding: 8,
  },
});
