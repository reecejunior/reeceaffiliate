import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, useWindowDimensions } from "react-native";
import { db } from "../../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { Aggregates } from "../../types";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import { useAuthGate } from "../../state/authGate";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

export default function ReportsScreen() {
  const { profile } = useAuthGate();
  const [agg, setAgg] = useState<Aggregates | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!profile) return;
    const ref = doc(db, "farms", profile.farmId, "meta", "aggregates");
    const unsub = onSnapshot(ref, (snap) => setAgg((snap.data() as any) ?? null));
    return () => unsub();
  }, [profile?.farmId]);

  const speciesData = useMemo(() => {
    const entries = Object.entries(agg?.bySpecies ?? {});
    return entries.map(([k, v]) => ({ species: k, count: Number(v) }));
  }, [agg?.bySpecies]);

  async function exportPDF() {
    const html = `<h1>Farm Report</h1>
      <p>Total animals: ${agg?.totalAnimals ?? 0}</p>
      <p>Revenue: ${agg?.revenue ?? 0}</p>
      <p>Expenses: ${agg?.expenses ?? 0}</p>
      <p>Profit: ${agg?.profit ?? 0}</p>`;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  }

  async function exportExcel() {
    try {
      const rows = [
        { metric: "totalAnimals", value: agg?.totalAnimals ?? 0 },
        { metric: "revenue", value: agg?.revenue ?? 0 },
        { metric: "expenses", value: agg?.expenses ?? 0 },
        { metric: "profit", value: agg?.profit ?? 0 },
      ];
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Summary");
      const ws2 = XLSX.utils.json_to_sheet(speciesData);
      XLSX.utils.book_append_sheet(wb, ws2, "BySpecies");
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const uri = FileSystem.cacheDirectory + `farm-report-${Date.now()}.xlsx`;
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(uri);
    } catch (e: any) {
      Alert.alert("Export failed", e.message);
    }
  }

  const chartHeight = 200;
  const chartWidth = Math.max(300, width - 32);
  const maxCount = Math.max(1, ...speciesData.map((d) => d.count));
  const barWidth = speciesData.length ? Math.max(20, (chartWidth - 40) / speciesData.length - 10) : 20;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Text>Total animals: {agg?.totalAnimals ?? 0}</Text>
      <Text>Revenue: ${agg?.revenue?.toFixed?.(2) ?? "0.00"}</Text>
      <Text>Expenses: ${agg?.expenses?.toFixed?.(2) ?? "0.00"}</Text>
      <Text>Profit: ${agg?.profit?.toFixed?.(2) ?? "0.00"}</Text>
      <View style={{ height: 16 }} />
      <Text style={{ fontWeight: "600", marginBottom: 8 }}>By Species</Text>
      <Svg width={chartWidth} height={chartHeight}>
        {speciesData.map((d, idx) => {
          const barHeight = (d.count / maxCount) * (chartHeight - 30);
          const x = 20 + idx * (barWidth + 10);
          const y = chartHeight - barHeight - 20;
          return (
            <React.Fragment key={d.species}>
              <Rect x={x} y={y} width={barWidth} height={barHeight} fill="#2a9d8f" rx={4} />
              <SvgText x={x + barWidth / 2} y={chartHeight - 5} fontSize="10" fill="#333" textAnchor="middle">
                {d.species.slice(0, 6)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={{ height: 12 }} />
      <Button title="Export PDF" onPress={exportPDF} />
      <View style={{ height: 8 }} />
      <Button title="Export Excel" onPress={exportExcel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
});