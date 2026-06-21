import {StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView} from "react-native";
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Link} from 'expo-router';
import LoginForm from '../../components/forms/LoginForm.jsx';

export default function LoginScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.keyboardView} behavior="height">

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.appName}>AgroSense</Text>
              <Text style={styles.tagline}>Crop health management for your farm</Text>
            </View>

            <View style={styles.login}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Log into your account</Text>
              <LoginForm />
            </View>

            <View style={styles.register}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Register</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
      
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D8F3DC',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1B4332',
    letterSpacing: 1,
  },

  tagline: {
    fontSize: 14, 
    color: '#2D6A4F',
    marginTop: 6,
    textAlign: 'center',
  },

  login: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#52796F',
    marginBottom: 24,
  },

  register: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  registerText: {
    color: '#52796F',
    fontSize: 14,
  },

  registerLink: {
    color: '#2D6A4F',
    fontSize: 14,
    fontWeight: '700'
  }
})