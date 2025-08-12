import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuthGate } from "../../state/authGate";
import { recordTransaction } from "../../services/transactions";
import { listenAnimals } from "../../services/animals";
import type { Animal } from "../../types";
import { canCreateOrUpdate } from "../../services/permissions";
import { enqueue } from "../../services/offlineQueue";

export default function AddTransactionScreen({ navigation }: any) {
  const { profile } = useAuthGate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalId, setAnimalId] = useState<string>("");
  const [animalSpecies, setAnimalSpecies] = useState<string>("");
  const [type, setType] = useState<"purchase" | "sale" | "birth" | "death" | "adjustment">("sale");
  const [quantity, setQuantity] = useState("0");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const unsub = listenAnimals(profile.farmId, (list) => {
      setAnimals(list);
      if (list.length && !animalId) {
        setAnimalId(list[0].id);
        setAnimalSpecies(list[0].species as string);
      }
    });
    return () => unsub();
  }, [profile?.farmId]);

  async function onSave() {
    if (!profile || !canCreateOrUpdate(profile)) {
      return Alert.alert("Access denied", "You do not have permission to record transactions.");
    }
    const selected = animals.find((a) => a.id === animalId);
    if (!selected) return Alert.alert("Select an animal");

    const payload = {
      farmId: profile.farmId,
      type,
      animalId: selected.id,
      animalSpecies: selected.species as string,
      quantity: Number(quantity || 0),
      pricePerUnit: pricePerUnit ? Number(pricePerUnit) : undefined,
      counterparty: counterparty || undefined,
      createdBy: profile.uid,
    };
    try {
      setLoading(true);
      await recordTransaction(payload);
      navigation.goBack();
    } catch (e: any) {
      await enqueue({ id: String(Date.now()), type: "recordTransaction", payload });
      Alert.alert("Offline", "Saved locally. Will sync when back online.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Transaction</Text>
      <Text>Animal</Text>
      <TextInput placeholder="Animal ID" value={animalId} onChangeText={setAnimalId} style={styles.input} />
      <Text>Type</Text>
      <TextInput placeholder="sale | purchase | birth | death | adjustment" value={type} onChangeText={(t) => setType(t as any)} style={styles.input} />
      <Text>Quantity</Text>
      <TextInput placeholder="Quantity" keyboardType="numeric" value={quantity} onChangeText={setQuantity} style={styles.input} />
      <Text>Price per unit (optional for sale/purchase)</Text>
      <TextInput placeholder="Price per unit" keyboardType="numeric" value={pricePerUnit} onChangeText={setPricePerUnit} style={styles.input} />
      <Text>Buyer/Seller</Text>
      <TextInput placeholder="Counterparty" value={counterparty} onChangeText={setCounterparty} style={styles.input} />
      <Button title={loading ? "Saving..." : "Save"} onPress={onSave} disabled={loading || !canCreateOrUpdate(profile)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 },
});