import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useUserLocation } from '../hooks/useUserLocation';
import { useQuery } from '@tanstack/react-query';
import { fetchRentalsNearby, RentalOption } from '../api/mockApi';

export default function RentalsScreen() {
  const userLocation = useUserLocation();
  const center = userLocation ?? { latitude: 37.7749, longitude: -122.4194 };
  const { data: rentals } = useQuery<RentalOption[]>({
    queryKey: ['rentals', center.latitude, center.longitude],
    queryFn: () => fetchRentalsNearby(center),
    enabled: !!center,
  });

  const region = useMemo(() => ({ latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 }), [center]);

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-64">
        <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation>
          {(rentals ?? []).map((r) => (
            <Marker key={r.id} coordinate={{ latitude: r.latitude, longitude: r.longitude }} title={`${r.provider} (${r.type})`} description={`$${r.price}/${r.unit}`} />
          ))}
        </MapView>
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
            <TouchableOpacity className="px-3 py-2 bg-indigo-600 rounded" onPress={() => Linking.openURL(item.bookingUrl)}>
              <Text className="text-white">Book</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

