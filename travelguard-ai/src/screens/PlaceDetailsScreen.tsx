import React, { useMemo } from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useQuery } from '@tanstack/react-query';
import { apiPlace } from '../api/client';
import { Ionicons } from '@expo/vector-icons';

type Route = RouteProp<RootStackParamList, 'PlaceDetails'>;

export default function PlaceDetailsScreen() {
  const route = useRoute<Route>();
  const id = route.params.id;

  const { data: place } = useQuery({ queryKey: ['place', id], queryFn: () => apiPlace(id) });

  const safetyScore = 50;
  const safetyColor = useMemo(() => (safetyScore >= 75 ? 'bg-green-100 text-green-700' : safetyScore >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'), [safetyScore]);

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place?.name ?? '')}`;
    Linking.openURL(url);
  };
  const handleCall = () => {};
  const handleBook = () => {};

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="w-full h-56 bg-slate-200 items-center justify-center">
        <Text className="text-slate-700">Images carousel placeholder</Text>
      </View>
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-semibold">{place?.name ?? 'Loading...'} </Text>
            <Text className="text-slate-600">{place?.category} • {place?.rating?.toFixed?.(1)} ★</Text>
          </View>
          <View className={`px-2 py-1 rounded ${safetyColor}`}>
            <Text>Safety Score: {safetyScore}</Text>
          </View>
        </View>

        <View className="mt-4 space-y-1">
          <Text className="text-slate-700">Coordinates: {place?.lat.toFixed(4)}, {place?.lon.toFixed(4)}</Text>
        </View>

        <View className="mt-6 flex-row gap-3">
          <TouchableOpacity className="flex-row items-center gap-2 px-4 py-3 bg-sky-600 rounded" onPress={handleDirections}>
            <Ionicons name="navigate-outline" size={18} color="#fff" />
            <Text className="text-white font-medium">Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2 px-4 py-3 bg-emerald-600 rounded" onPress={handleCall}>
            <Ionicons name="call-outline" size={18} color="#fff" />
            <Text className="text-white font-medium">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2 px-4 py-3 bg-indigo-600 rounded" onPress={handleBook}>
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text className="text-white font-medium">Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

