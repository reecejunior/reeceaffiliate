import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { useQuery } from '@tanstack/react-query';

type CityPack = { id: string; name: string; size_mb: number };

async function fetchCityPacks(): Promise<CityPack[]> {
  const base = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000';
  const res = await fetch(`${base}/downloads/city_packs`);
  return res.json();
}

const db = SQLite.openDatabaseSync('offline.db');
db.execSync('CREATE TABLE IF NOT EXISTS packs (id TEXT PRIMARY KEY, name TEXT, size_mb INTEGER, path TEXT);');

export default function DownloadsScreen() {
  const { data } = useQuery<CityPack[]>({ queryKey: ['city_packs'], queryFn: fetchCityPacks });
  const [progressById, setProgressById] = useState<Record<string, number>>({});

  const handleDownload = async (pack: CityPack) => {
    const uri = `${FileSystem.documentDirectory}${pack.id}.json`;
    setProgressById((p) => ({ ...p, [pack.id]: 0 }));
    await FileSystem.downloadAsync('https://example.com/offline-pack.json', uri).then(() => {
      db.runSync('INSERT OR REPLACE INTO packs (id, name, size_mb, path) VALUES (?, ?, ?, ?);', [pack.id, pack.name, pack.size_mb, uri]);
      setProgressById((p) => ({ ...p, [pack.id]: 1 }));
    });
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-semibold mb-3">Offline Packs</Text>
      <FlatList
        data={data ?? []}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-200" />}
        renderItem={({ item }) => (
          <View className="py-3 flex-row items-center justify-between">
            <View>
              <Text className="text-base font-medium">{item.name}</Text>
              <Text className="text-slate-500">~{item.size_mb} MB</Text>
            </View>
            <View className="items-end">
              <TouchableOpacity className="px-3 py-2 bg-slate-800 rounded" onPress={() => handleDownload(item)}>
                <Text className="text-white">Download</Text>
              </TouchableOpacity>
              {progressById[item.id] != null && (
                <View className="mt-2 w-32 h-2 bg-slate-200 rounded overflow-hidden">
                  <View className="h-2 bg-sky-600" style={{ width: `${Math.round((progressById[item.id] ?? 0) * 100)}%` }} />
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

