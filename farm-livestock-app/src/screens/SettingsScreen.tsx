import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { logout } from "../services/auth";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Sign out" onPress={() => logout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
});