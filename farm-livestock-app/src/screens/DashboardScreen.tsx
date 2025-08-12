import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Aggregates } from "../types";
import { useAuthGate } from "../state/authGate";

export default function DashboardScreen({ navigation }: any) {
  const { profile } = useAuthGate();
  const [agg, setAgg] = useState<Aggregates | null>(null);

  useEffect(() => {
    if (!profile) return;
    const ref = doc(db, "farms", profile.farmId, "meta", "aggregates");
    const unsub = onSnapshot(ref, (snap) => setAgg((snap.data() as any) ?? null));
    return () => unsub();
  }, [profile?.farmId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Total animals: {agg?.totalAnimals ?? 0}</Text>
      <Text>Revenue: ${agg?.revenue?.toFixed?.(2) ?? "0.00"}</Text>
      <Text>Expenses: ${agg?.expenses?.toFixed?.(2) ?? "0.00"}</Text>
      <Text>Profit: ${agg?.profit?.toFixed?.(2) ?? "0.00"}</Text>

      <View style={{ height: 16 }} />
      <Button title="Add Animal" onPress={() => navigation.navigate("AddAnimal")} />
      <View style={{ height: 8 }} />
      <Button title="Record Transaction" onPress={() => navigation.navigate("AddTransaction")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
});