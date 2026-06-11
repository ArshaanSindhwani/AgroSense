import { View, StyleSheet } from 'react-native';
import FieldCard from '../../components/cards/FieldCard';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <FieldCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});