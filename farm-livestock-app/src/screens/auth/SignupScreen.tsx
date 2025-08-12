import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signUpWithEmail } from "../../services/auth";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSignup() {
    try {
      setLoading(true);
      await signUpWithEmail({ email, password, displayName: name, role: "worker" });
    } catch (e: any) {
      Alert.alert("Signup failed", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title={loading ? "Creating..." : "Sign Up"} onPress={onSignup} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Back to login" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
});