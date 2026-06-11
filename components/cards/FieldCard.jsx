import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function FieldCard() {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Field</Text>
      <Text style={styles.role}>FieldRole</Text>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F4F8F2",
  },
  hero: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#DDEEDC",
    color: "#1F4D2B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1F4D2B",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#3F5F46",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DDEEDC",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F4D2B",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    color: "#3F5F46",
    marginBottom: 6,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#1F4D2B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F4D2B",
  },
  secondaryButtonText: {
    color: "#1F4D2B",
    fontSize: 16,
    fontWeight: "700",
  },
});