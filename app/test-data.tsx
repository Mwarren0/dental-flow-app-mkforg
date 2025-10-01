
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function TestDataScreen() {
  const [testResults, setTestResults] = useState<{
    patients: any[];
    procedures: any[];
    appointments: any[];
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    testDataFetching();
  }, []);

  const testDataFetching = async () => {
    setLoading(true);
    try {
      console.log('Starting database connection test...');
      
      const [patientsResult, proceduresResult, appointmentsResult] = await Promise.all([
        supabase.from('patients').select('*').limit(5),
        supabase.from('procedures').select('*').limit(5),
        supabase.from('appointments').select('*').limit(5)
      ]);

      console.log('Patients result:', patientsResult);
      console.log('Procedures result:', proceduresResult);
      console.log('Appointments result:', appointmentsResult);

      if (patientsResult.error || proceduresResult.error || appointmentsResult.error) {
        const errors = [
          patientsResult.error?.message,
          proceduresResult.error?.message,
          appointmentsResult.error?.message
        ].filter(Boolean);
        
        setTestResults({
          patients: [],
          procedures: [],
          appointments: [],
          error: `Database errors: ${errors.join(', ')}`
        });
      } else {
        setTestResults({
          patients: patientsResult.data || [],
          procedures: proceduresResult.data || [],
          appointments: appointmentsResult.data || []
        });
      }
    } catch (error) {
      console.error('Test data fetching error:', error);
      setTestResults({
        patients: [],
        procedures: [],
        appointments: [],
        error: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Database Test',
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Text style={styles.backButton}>← Back</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Database Connection Test</Text>
            
            <Pressable 
              style={[styles.testButton, loading && styles.testButtonDisabled]} 
              onPress={testDataFetching}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                {loading ? 'Testing...' : 'Run Test'}
              </Text>
            </Pressable>

            {testResults && (
              <View style={styles.results}>
                {testResults.error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>❌ Connection Failed</Text>
                    <Text style={styles.errorText}>{testResults.error}</Text>
                  </View>
                ) : (
                  <View style={styles.successContainer}>
                    <Text style={styles.successTitle}>✅ Connection Successful</Text>
                    
                    <View style={styles.dataSection}>
                      <Text style={styles.dataTitle}>Patients ({testResults.patients.length})</Text>
                      {testResults.patients.slice(0, 3).map((patient, index) => (
                        <Text key={index} style={styles.dataItem}>
                          • {patient.name} ({patient.email || 'No email'})
                        </Text>
                      ))}
                    </View>

                    <View style={styles.dataSection}>
                      <Text style={styles.dataTitle}>Procedures ({testResults.procedures.length})</Text>
                      {testResults.procedures.slice(0, 3).map((procedure, index) => (
                        <Text key={index} style={styles.dataItem}>
                          • {procedure.name} (${procedure.price || '0'})
                        </Text>
                      ))}
                    </View>

                    <View style={styles.dataSection}>
                      <Text style={styles.dataTitle}>Appointments ({testResults.appointments.length})</Text>
                      {testResults.appointments.slice(0, 3).map((appointment, index) => (
                        <Text key={index} style={styles.dataItem}>
                          • {new Date(appointment.date_time).toLocaleDateString()} - {appointment.status}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
  backButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  results: {
    marginTop: 20,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    lineHeight: 20,
  },
  successContainer: {
    backgroundColor: colors.success + '20',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 16,
  },
  dataSection: {
    marginBottom: 16,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  dataItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    paddingLeft: 8,
  },
});
