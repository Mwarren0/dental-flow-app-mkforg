
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle, onPress }) => {
  const CardContent = () => (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <IconSymbol name={icon as any} color="white" size={22} />
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        <CardContent />
      </Pressable>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minWidth: 160,
  },
  container: {
    flex: 1,
    minHeight: 120,
    margin: 0,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 32,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
