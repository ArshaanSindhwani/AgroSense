import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import FieldCard from '../../components/cards/FieldCard';

export default function DashboardScreen() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      // const response = await fetch(
      //   'https://your-api.com/api/fields'
      // );

      // const data = await response.json();
      const data = [
            {
              "id": 1,
              "name": "North Field",
              "crop": "Wheat",
              "area": 12.5,
              "status": "Healthy"
            },
            {
              "id": 2,
              "name": "South Field",
              "crop": "Barley",
              "area": 8.3,
              "status": "Needs Irrigation"
            }
          ]

      setFields(data);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fields}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FieldCard field={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});