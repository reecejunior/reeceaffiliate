import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiNearbyPlaces, BackendPlace } from '../api/client';
import { useUserLocation } from '../hooks/useUserLocation';
import { formatDistanceKm, haversineDistanceKm } from '../utils/geo';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const userLocation = useUserLocation();

  const { data: places } = useQuery<BackendPlace[]>({
    queryKey: ['nearby', userLocation?.latitude, userLocation?.longitude],
    queryFn: async () => {
      const coords = userLocation ?? { latitude: 37.7749, longitude: -122.4194 };
      return apiNearbyPlaces(coords.latitude, coords.longitude);
    },
    enabled: !!userLocation,
  });

  const sortedPlaces = useMemo(() => {
    if (!places) return [] as (BackendPlace & { distanceKm: number })[];
    const origin = userLocation ?? { latitude: places[0].lat, longitude: places[0].lon };
    return places
      .map((p) => ({ ...p, distanceKm: haversineDistanceKm(origin, { latitude: p.lat, longitude: p.lon }) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [places, userLocation]);

  const region = useMemo(() => {
    const center = userLocation ?? { latitude: 37.7749, longitude: -122.4194 };
    return { latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 };
  }, [userLocation]);

  let MapViewComponent: any = null;
  let MarkerComponent: any = null;
  if (Platform.OS !== 'web') {
    // Lazy require to avoid bundling/react-native-maps on web
    const maps = require('react-native-maps');
    MapViewComponent = maps.default;
    MarkerComponent = maps.Marker;
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-64">
        {Platform.OS === 'web' ? (
          <View className="flex-1 items-center justify-center bg-slate-200">
            <Text className="text-slate-700">Map not supported on web build</Text>
          </View>
        ) : (
          <MapViewComponent style={{ flex: 1 }} initialRegion={region} showsUserLocation>
            {sortedPlaces.map((p) => (
              <MarkerComponent key={p.id} coordinate={{ latitude: p.lat, longitude: p.lon }} title={p.name} description={p.category} onPress={() => navigation.navigate('PlaceDetails', { id: p.id })} />
            ))}
          </MapViewComponent>
        )}
      </View>
      <View className="flex-1 p-4">
        <Text className="text-xl font-semibold mb-2">Nearby Places</Text>
        <FlatList
          data={sortedPlaces}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-200" />}
          renderItem={({ item }) => (
            <TouchableOpacity className="py-3" onPress={() => navigation.navigate('PlaceDetails', { id: item.id })}>
              <Text className="text-base font-medium">{item.name}</Text>
              <Text className="text-slate-500">{item.category} • {(item.rating ?? 0).toFixed(1)} ★ • {formatDistanceKm(item.distanceKm)}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

