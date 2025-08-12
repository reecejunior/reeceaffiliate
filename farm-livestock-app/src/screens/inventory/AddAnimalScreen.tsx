import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuthGate } from "../../state/authGate";
import { createAnimal } from "../../services/animals";
import { canCreateOrUpdate } from "../../services/permissions";
import { enqueue } from "../../services/offlineQueue";

export default function AddAnimalScreen({ navigation }: any) {
  const { profile } = useAuthGate();
  const [species, setSpecies] = useState("pig");
  const [breed, setBreed] = useState("");
  const [count, setCount] = useState("0");
  const [weight, setWeight] = useState("");
  const [health, setHealth] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSave() {
    if (!profile || !canCreateOrUpdate(profile)) {
      return Alert.alert("Access denied", "You do not have permission to add animals.");
    }
    const payload = {
      farmId: profile.farmId,
      data: {
        id: "",
        species,
        breed,
        count: Number(count || 0),
        averageWeightKg: weight ? Number(weight) : undefined,
        healthStatus: health || undefined,
        createdBy: profile.uid,
        farmId: profile.farmId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    } as any;
    try {
      setLoading(true);
      await createAnimal(profile.farmId, payload.data as any);
      navigation.goBack();
    } catch (e: any) {
      await enqueue({ id: String(Date.now()), type: "createAnimal", payload });
      Alert.alert("Offline", "Saved locally. Will sync when back online.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Animal</Text>
      <TextInput placeholder="Species (pig, chicken, goat, cow, sheep)" value={species} onChangeText={setSpecies} style={styles.input} />
      <TextInput placeholder="Breed" value={breed} onChangeText={setBreed} style={styles.input} />
      <TextInput placeholder="Count" keyboardType="numeric" value={count} onChangeText={setCount} style={styles.input} />
      <TextInput placeholder="Avg Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} style={styles.input} />
      <TextInput placeholder="Health status" value={health} onChangeText={setHealth} style={styles.input} />
      <Button title={loading ? "Saving..." : "Save"} onPress={onSave} disabled={loading || !canCreateOrUpdate(profile)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
});