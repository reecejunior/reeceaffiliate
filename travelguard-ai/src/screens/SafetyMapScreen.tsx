import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Platform } from 'react-native';
import { useUserLocation } from '../hooks/useUserLocation';
import { useQuery } from '@tanstack/react-query';
import { IncidentType, TimeRange } from '../api/mockApi';
import { apiSafetyTiles, BackendTile } from '../api/client';
import { hexagonForCenter } from '../utils/geo';

export default function SafetyMapScreen() {
  const userLocation = useUserLocation();
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>(['crime', 'robbery', 'accidents']);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [selectedTile, setSelectedTile] = useState<null | { id: string; safetyScore: number; topIncidents: { type: IncidentType; count: number }[] }>(null);

  const center = userLocation ?? { latitude: 37.7749, longitude: -122.4194 };

  const { data: tiles } = useQuery<BackendTile[]>({
    queryKey: ['safety', center.latitude, center.longitude, incidentTypes.sort().join(','), timeRange],
    queryFn: () => apiSafetyTiles({}),
    enabled: !!center,
  });

  const region = useMemo(() => ({ latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.04, longitudeDelta: 0.04 }), [center]);

  const colorForScore = (score: number) => {
    if (score >= 75) return 'rgba(16,185,129,0.35)'; // green-500 35%
    if (score >= 50) return 'rgba(249,115,22,0.35)'; // orange-500 35%
    return 'rgba(239,68,68,0.35)'; // red-500 35%
  };

  const toggleIncident = (type: IncidentType) => {
    setIncidentTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  let MapViewComponent: any = null;
  let PolygonComponent: any = null;
  if (Platform.OS !== 'web') {
    const maps = require('react-native-maps');
    MapViewComponent = maps.default;
    PolygonComponent = maps.Polygon;
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-80">
        {Platform.OS === 'web' ? (
          <View className="flex-1 items-center justify-center bg-slate-200">
            <Text className="text-slate-700">Map not supported on web build</Text>
          </View>
        ) : (
          <MapViewComponent style={{ flex: 1 }} initialRegion={region} showsUserLocation>
            {(tiles ?? []).map((t) => {
              const verts = hexagonForCenter({ latitude: center.latitude, longitude: center.longitude }, 0.25);
              return (
                <PolygonComponent
                  key={t.id}
                  coordinates={verts}
                  strokeColor={colorForScore(t.score)}
                  fillColor={colorForScore(t.score)}
                  tappable
                  onPress={() => setSelectedTile({ id: t.id, safetyScore: t.score, topIncidents: [] })}
                />
              );
            })}
          </MapViewComponent>
        )}
      </View>

      <View className="p-4">
        <Text className="text-xl font-semibold mb-2">Safety Map</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {(['accidents', 'crime', 'robbery', 'theft', 'assault'] as IncidentType[]).map((type) => (
            <TouchableOpacity
              key={type}
              className={`px-3 py-2 rounded ${incidentTypes.includes(type) ? 'bg-sky-600' : 'bg-slate-200'}`}
              onPress={() => toggleIncident(type)}
            >
              <Text className={`${incidentTypes.includes(type) ? 'text-white' : 'text-slate-700'}`}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex-row gap-2">
          {(['24h', '7d', '30d'] as TimeRange[]).map((tr) => (
            <TouchableOpacity key={tr} className={`px-3 py-2 rounded ${timeRange === tr ? 'bg-sky-600' : 'bg-slate-200'}`} onPress={() => setTimeRange(tr)}>
              <Text className={`${timeRange === tr ? 'text-white' : 'text-slate-700'}`}>{tr}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal visible={!!selectedTile} transparent animationType="fade" onRequestClose={() => setSelectedTile(null)}>
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white w-full rounded p-4">
            <Text className="text-lg font-semibold mb-2">Top Incidents</Text>
            {(selectedTile?.topIncidents ?? []).map((i) => (
              <View key={i.type} className="flex-row justify-between py-1">
                <Text className="capitalize">{i.type}</Text>
                <Text className="font-medium">{i.count}</Text>
              </View>
            ))}
            <TouchableOpacity className="mt-4 self-end px-4 py-2 bg-slate-800 rounded" onPress={() => setSelectedTile(null)}>
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

