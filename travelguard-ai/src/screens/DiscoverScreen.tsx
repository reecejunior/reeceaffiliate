import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useQuery } from '@tanstack/react-query';
import { fetchNearbyPlaces, NearbyPlace } from '../api/mockApi';
import { useUserLocation } from '../hooks/useUserLocation';
import { formatDistanceKm, haversineDistanceKm } from '../utils/geo';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DiscoverScreen() {
  const navigation = useNavigation<Nav>();
  const userLocation = useUserLocation();

  const { data: places } = useQuery<NearbyPlace[]>({
    queryKey: ['nearby', userLocation?.latitude, userLocation?.longitude],
    queryFn: async () => {
      const coords = userLocation ?? { latitude: 37.7749, longitude: -122.4194 };
      return fetchNearbyPlaces(coords);
    },
    enabled: !!userLocation,
  });

  const sortedPlaces = useMemo(() => {
    if (!places) return [] as (NearbyPlace & { distanceKm: number })[];
    const origin = userLocation ?? { latitude: places[0].latitude, longitude: places[0].longitude };
    return places
      .map((p) => ({ ...p, distanceKm: haversineDistanceKm(origin, { latitude: p.latitude, longitude: p.longitude }) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [places, userLocation]);

  const region = useMemo(() => {
    const center = userLocation ?? { latitude: 37.7749, longitude: -122.4194 };
    return { latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 };
  }, [userLocation]);

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-64">
        <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation>
          {sortedPlaces.map((p) => (
            <Marker key={p.id} coordinate={{ latitude: p.latitude, longitude: p.longitude }} title={p.name} description={p.category} onPress={() => navigation.navigate('PlaceDetails', { id: p.id })} />
          ))}
        </MapView>
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
              <Text className="text-slate-500">{item.category} • {item.rating.toFixed(1)} ★ • {formatDistanceKm(item.distanceKm)}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

