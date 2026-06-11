import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function FieldCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.fieldName}>North Field</Text>

      <Text style={styles.info}>Crop: Wheat</Text>
      <Text style={styles.info}>Area: 12.5 hectares</Text>
      <Text style={styles.info}>Status: Healthy</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Field</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 4,
  },
  fieldName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});