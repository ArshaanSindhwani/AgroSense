import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// loading spinner for the whole app while it loads -> this is gonna be used in the _layout.jsx 
export function FullScreenSpinner({ color = '#2b5f47' }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={color} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// inline spinner for components
export function InlineSpinner({ size = 'small', color = '#FFFFFF' }) {
  return <ActivityIndicator size={size} color={color} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});