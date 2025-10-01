
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function TestDataScreen() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testDataFetching();
  }, []);

  const testDataFetching = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Testing data fetching...');
      
      // Test patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*');
      
      if (patientsError) {
        console.error('Patients error:', patientsError);
        setError(`Patients error: ${patientsError.message}`);
        return;
      }
      
      console.log('Patients data:', patientsData);
      setPatients(patientsData || []);
      
      // Test appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*');
      
      if (appointmentsError) {
        console.error('Appointments error:', appointmentsError);
        setError(`Appointments error: ${appointmentsError.message}`);
        return;
      }
      
      console.log('Appointments data:', appointmentsData);
      setAppointments(appointmentsData || []);
      
      // Test procedures
      const { data: proceduresData, error: proceduresError } = await supabase
        .from('procedures')
        .select('*');
      
      if (proceduresError) {
        console.error('Procedures error:', proceduresError);
        setError(`Procedures error: ${proceduresError.message}`);
        return;
      }
      
      console.log('Procedures data:', proceduresData);
      setProcedures(proceduresData || []);
      
    } catch (err) {
      console.error('Test error:', err);
      setError(`Test error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Test Data',
          headerStyle: { backgroundColor: colors.backgroundAlt },
          headerTitleStyle: { color: colors.text, fontWeight: '600' },
        }}
      />
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Pressable style={styles.refreshButton} onPress={testDataFetching}>
            <Text style={styles.refreshText}>Refresh Data</Text>
          </Pressable>
          
          {loading && <Text style={styles.status}>Loading...</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patients ({patients.length})</Text>
            {patients.map((patient, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>{patient.name} - {patient.email}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointments ({appointments.length})</Text>
            {appointments.map((appointment, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>
                  {appointment.date_time} - {appointment.status}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Procedures ({procedures.length})</Text>
            {procedures.map((procedure, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemText}>
                  {procedure.name} - ${procedure.price}
                </Text>
              </View>
            ))}
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
  refreshButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  refreshText: {
    color: 'white',
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  error: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  item: {
    backgroundColor: colors.backgroundAlt,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemText: {
    fontSize: 14,
    color: colors.text,
  },
});
