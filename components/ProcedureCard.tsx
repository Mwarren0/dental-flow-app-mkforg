
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { Procedure } from '@/types';

interface ProcedureCardProps {
  procedure: Procedure;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProcedureCard: React.FC<ProcedureCardProps> = ({ 
  procedure, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'preventive': return colors.success;
      case 'restorative': return colors.primary;
      case 'endodontic': return colors.warning;
      case 'cosmetic': return colors.accent;
      default: return colors.textSecondary;
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

  const handleEdit = (e: any) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Pressable style={[commonStyles.card, styles.container]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.name}>{procedure.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(procedure.category) }]}>
            <Text style={styles.categoryText}>{procedure.category}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <Pressable style={styles.actionButton} onPress={handleEdit}>
              <IconSymbol name="pencil" color={colors.primary} size={18} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable style={styles.actionButton} onPress={handleDelete}>
              <IconSymbol name="trash" color={colors.error} size={18} />
            </Pressable>
          )}
        </View>
      </View>
      
      <Text style={styles.description}>{procedure.description}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <View style={styles.detailRow}>
            <IconSymbol name="dollarsign.circle" color={colors.success} size={16} />
            <Text style={styles.detailLabel}>Price:</Text>
          </View>
          <Text style={[styles.detailValue, styles.priceText]}>{formatPrice(procedure.price)}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <View style={styles.detailRow}>
            <IconSymbol name="clock" color={colors.primary} size={16} />
            <Text style={styles.detailLabel}>Duration:</Text>
          </View>
          <Text style={styles.detailValue}>{formatDuration(procedure.duration)}</Text>
        </View>
        
        {procedure.code && (
          <View style={styles.detailItem}>
            <View style={styles.detailRow}>
              <IconSymbol name="number" color={colors.textSecondary} size={16} />
              <Text style={styles.detailLabel}>Code:</Text>
            </View>
            <Text style={styles.detailValue}>{procedure.code}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  details: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  priceText: {
    color: colors.success,
    fontSize: 16,
  },
});
