import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Platform } from 'react-native';
import { useUserLocation } from '../hooks/useUserLocation';
import { useQuery } from '@tanstack/react-query';
import { apiRentals, BackendRental } from '../api/client';

export default function RentalsScreen() {
  const userLocation = useUserLocation();
  const center = userLocation ?? { latitude: 37.7749, longitude: -122.4194 };
  const { data: rentals } = useQuery<BackendRental[]>({
    queryKey: ['rentals', center.latitude, center.longitude],
    queryFn: () => apiRentals(center.latitude, center.longitude),
    enabled: !!center,
  });

  const region = useMemo(() => ({ latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 }), [center]);

  let MapViewComponent: any = null;
  let MarkerComponent: any = null;
  if (Platform.OS !== 'web') {
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
            {(rentals ?? []).map((r) => (
              <MarkerComponent key={r.id} coordinate={{ latitude: r.lat, longitude: r.lon }} title={`${r.provider} (${r.type})`} description={`$${r.price}/${r.unit}`} />
            ))}
          </MapViewComponent>
        )}
      </View>
      <FlatList
        className="flex-1 p-4"
        data={rentals ?? []}
        keyExtractor={(r) => r.id}
        ItemSeparatorComponent={() => <View className="h-px bg-slate-200" />}
        renderItem={({ item }) => (
          <View className="py-3 flex-row items-center justify-between">
            <View>
              <Text className="text-base font-medium">{item.provider} • {item.type.toUpperCase()}</Text>
              <Text className="text-slate-500">${item.price}/{item.unit}</Text>
            </View>
            <TouchableOpacity className="px-3 py-2 bg-indigo-600 rounded" onPress={() => Linking.openURL(item.url)}>
              <Text className="text-white">Book</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

