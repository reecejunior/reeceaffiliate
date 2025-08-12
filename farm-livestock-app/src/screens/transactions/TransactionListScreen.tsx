import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../services/firebase";
import type { Transaction } from "../../types";
import { useAuthGate } from "../../state/authGate";
import { isReadOnly } from "../../services/permissions";

export default function TransactionListScreen({ navigation }: any) {
  const { profile } = useAuthGate();
  const [txns, setTxns] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!profile) return;
    const q = query(collection(db, "farms", profile.farmId, "transactions"), orderBy("timestamp", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => setTxns(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as any));
    return () => unsub();
  }, [profile?.farmId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Transactions</Text>
        {!isReadOnly(profile) && <Button title="Add" onPress={() => navigation.navigate("AddTransaction")} />}
      </View>
      <FlatList
        data={txns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.type.toUpperCase()} - {item.animalSpecies}</Text>
            <Text>Qty: {item.quantity} {item.pricePerUnit ? `@ $${item.pricePerUnit}` : ""}</Text>
            {item.totalPrice ? <Text>Total: ${item.totalPrice}</Text> : null}
            <Text>{new Date(item.timestamp).toLocaleString()}</Text>
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