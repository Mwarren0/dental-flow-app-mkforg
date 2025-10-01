
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useProcedures } from '@/hooks/useData';
import { useTranslation } from 'react-i18next';
import { Procedure } from '@/types';

export default function ProcedureProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { procedures, deleteProcedure } = useProcedures();
  const [procedure, setProcedure] = useState<Procedure | null>(null);

  useEffect(() => {
    const foundProcedure = procedures.find(p => p.id === id);
    setProcedure(foundProcedure || null);
  }, [id, procedures]);

  const handleEdit = () => {
    router.push(`/edit-procedure/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      t('common.confirmDelete'),
      t('procedures.confirmDeleteMessage', { name: procedure?.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProcedure(id!);
              Alert.alert(
                t('common.success'),
                t('procedures.deleteSuccess'),
                [{ text: t('common.ok'), onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert(t('common.error'), t('procedures.deleteError'));
              console.log('Error deleting procedure:', error);
            }
          }
        }
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'preventive': return colors.success;
      case 'restorative': return colors.primary;
      case 'endodontic': return colors.warning;
      case 'cosmetic': return colors.accent;
      default: return colors.textSecondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'preventive': return 'shield.checkered';
      case 'restorative': return 'wrench.and.screwdriver';
      case 'endodontic': return 'medical.thermometer';
      case 'cosmetic': return 'sparkles';
      default: return 'medical.thermometer';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

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
          title: procedure.name,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable style={styles.headerButton} onPress={handleEdit}>
                <IconSymbol name="pencil" color={colors.primary} size={20} />
              </Pressable>
              <Pressable style={styles.headerButton} onPress={handleDelete}>
                <IconSymbol name="trash" color={colors.error} size={20} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Procedure Header */}
          <View style={styles.procedureHeader}>
            <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(procedure.category) }]}>
              <IconSymbol 
                name={getCategoryIcon(procedure.category) as any} 
                color="white" 
                size={32} 
              />
            </View>
            <Text style={styles.procedureName}>{procedure.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(procedure.category) }]}>
              <Text style={styles.categoryText}>{procedure.category}</Text>
            </View>
            <Text style={styles.procedureId}>Code: {procedure.code}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('procedures.description')}</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{procedure.description}</Text>
            </View>
          </View>

          {/* Procedure Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('procedures.procedureDetails')}</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="dollarsign.circle" color={colors.success} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.price')}</Text>
                </View>
                <Text style={[styles.detailValue, styles.priceText]}>
                  {formatPrice(procedure.price)}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="clock" color={colors.primary} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.duration')}</Text>
                </View>
                <Text style={styles.detailValue}>
                  {formatDuration(procedure.duration)}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="tag" color={getCategoryColor(procedure.category)} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.category')}</Text>
                </View>
                <Text style={[styles.detailValue, { color: getCategoryColor(procedure.category) }]}>
                  {t(`procedures.${procedure.category}`)}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <IconSymbol name="number" color={colors.textSecondary} size={24} />
                  <Text style={styles.detailLabel}>{t('procedures.code')}</Text>
                </View>
                <Text style={[styles.detailValue, styles.codeText]}>
                  {procedure.code}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              variant="primary"
              onPress={handleEdit}
              style={styles.actionButton}
            >
              <IconSymbol name="pencil" color="white" size={16} />
              {t('common.edit')}
            </Button>
            <Button
              variant="secondary"
              onPress={handleDelete}
              style={styles.actionButton}
            >
              <IconSymbol name="trash" color={colors.error} size={16} />
              {t('common.delete')}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  procedureHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  procedureName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  procedureId: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
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
  descriptionCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  priceText: {
    color: colors.success,
    fontSize: 20,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
