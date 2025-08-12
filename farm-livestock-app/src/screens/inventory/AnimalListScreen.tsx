import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { listenAnimals } from "../../services/animals";
import type { Animal } from "../../types";
import { useAuthGate } from "../../state/authGate";
import { isReadOnly } from "../../services/permissions";

export default function AnimalListScreen({ navigation }: any) {
  const { profile } = useAuthGate();
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    if (!profile) return;
    const unsub = listenAnimals(profile.farmId, setAnimals);
    return () => unsub();
  }, [profile?.farmId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Inventory</Text>
        {!isReadOnly(profile) && <Button title="Add" onPress={() => navigation.navigate("AddAnimal")} />}
      </View>
      <FlatList
        data={animals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.species} - {item.breed ?? ""}</Text>
            <Text>Count: {item.count}</Text>
            {item.averageWeightKg ? <Text>Avg weight: {item.averageWeightKg} kg</Text> : null}
            {item.healthStatus ? <Text>Health: {item.healthStatus}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600" },
  card: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginVertical: 8 },
  cardTitle: { fontWeight: "600", marginBottom: 4 },
});