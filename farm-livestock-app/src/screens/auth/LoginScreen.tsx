import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmail } from "../../services/auth";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    try {
      setLoading(true);
      await signInWithEmail({ email, password });
    } catch (e: any) {
      Alert.alert("Login failed", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Livestock Manager</Text>
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title={loading ? "Signing in..." : "Sign In"} onPress={onLogin} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Create account" onPress={() => navigation.navigate("Signup")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
});