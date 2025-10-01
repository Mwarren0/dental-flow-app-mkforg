
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { PatientCard } from '@/components/PatientCard';
import { Button } from '@/components/button';
import { colors, commonStyles } from '@/styles/commonStyles';
import { usePatients } from '@/hooks/useData';

export default function PatientsScreen() {
  const { patients, loading } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/add-patient')}
      style={styles.headerButton}
    >
      <IconSymbol name="plus" color={colors.primary} size={24} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>Loading patients...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Patients',
          headerRight: renderHeaderRight,
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <View style={commonStyles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search patients..."
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
        </View>

        {/* Patients List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredPatients.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="person.2" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No patients found' : 'No patients yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Add your first patient to get started'
                }
              </Text>
              {!searchQuery && (
                <Button
                  variant="primary"
                  onPress={() => router.push('/add-patient')}
                  style={styles.addButton}
                >
                  Add First Patient
                </Button>
              )}
            </View>
          ) : (
            <View style={styles.patientsList}>
              <Text style={styles.resultsCount}>
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
              </Text>
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onPress={() => router.push(`/patient/${patient.id}`)}
                  onEdit={() => router.push(`/edit-patient/${patient.id}`)}
                  onDelete={() => console.log('Delete patient:', patient.id)}
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
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
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
  patientsList: {
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
