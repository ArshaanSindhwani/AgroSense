import { useState } from "react";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthContext } from "../../context/AuthContext.jsx";
import { InlineSpinner } from "../shared/LoadingSpinner";

export default function LoginForm() {
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      router.replace("/(tabs)/addFarm");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <InlineSpinner />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 24,
  },

  error: {
    backgroundColor: "#FDECEA",
    color: "#691b29",
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },

  input: {
    borderWidth: 1,
    borderColor: "#95D5B2",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#F0FAF4",
    color: "#1B4332",
  },

  button: {
    backgroundColor: "#2D6A4F",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});