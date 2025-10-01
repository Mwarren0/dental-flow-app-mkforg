
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { ProcedureCard } from '@/components/ProcedureCard';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useProcedures } from '@/hooks/useData';

export default function ProceduresScreen() {
  const { procedures, loading } = useProcedures();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'preventive', 'restorative', 'endodontic', 'cosmetic'];

  const filteredProcedures = procedures.filter(procedure => {
    const matchesSearch = procedure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         procedure.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         procedure.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           procedure.category.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/add-procedure')}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>Loading procedures...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Procedures',
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <View style={commonStyles.container}>
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search procedures..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" color={colors.textSecondary} size={20} />
              </Pressable>
            )}
          </View>
          
          {/* Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryFilter}
            contentContainerStyle={styles.categoryFilterContent}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Procedures List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredProcedures.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="medical.thermometer" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>
                {searchQuery || selectedCategory !== 'all' ? 'No procedures found' : 'No procedures yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Add your first procedure to get started'
                }
              </Text>
              {!searchQuery && selectedCategory === 'all' && (
                <Button
                  variant="primary"
                  onPress={() => router.push('/add-procedure')}
                  style={styles.addButton}
                >
                  Add First Procedure
                </Button>
              )}
            </View>
          ) : (
            <View style={styles.proceduresList}>
              <Text style={styles.resultsCount}>
                {filteredProcedures.length} procedure{filteredProcedures.length !== 1 ? 's' : ''}
              </Text>
              {filteredProcedures.map((procedure) => (
                <ProcedureCard
                  key={procedure.id}
                  procedure={procedure}
                  onPress={() => router.push(`/procedure/${procedure.id}`)}
                  onEdit={() => router.push(`/edit-procedure/${procedure.id}`)}
                  onDelete={() => console.log('Delete procedure:', procedure.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: colors.backgroundAlt,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoryFilter: {
    marginBottom: 10,
  },
  categoryFilterContent: {
    gap: 8,
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryButtonTextActive: {
    color: 'white',
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
    marginBottom: 24,
  },
  addButton: {
    width: 200,
  },
  proceduresList: {
    paddingBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500',
  },
  headerButton: {
    padding: 8,
  },
});
