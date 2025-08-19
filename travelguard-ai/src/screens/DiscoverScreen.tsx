import React from 'react';
import { View, Text, FlatList } from 'react-native';

const MOCK_PLACES = [
  { id: '1', name: 'Central Park', distance: '0.5 km' },
  { id: '2', name: 'City Museum', distance: '1.2 km' },
  { id: '3', name: 'Art Gallery', distance: '1.8 km' },
  { id: '4', name: "Traveler's Cafe", distance: '2.0 km' },
];

export default function DiscoverScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-64 bg-slate-200 items-center justify-center">
        <Text className="text-base text-slate-700">Map placeholder (nearby places)</Text>
      </View>
      <View className="flex-1 p-4">
        <Text className="text-xl font-semibold mb-2">Nearby Places</Text>
        <FlatList
          data={MOCK_PLACES}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-px bg-slate-200" />}
          renderItem={({ item }) => (
            <View className="py-3">
              <Text className="text-base font-medium">{item.name}</Text>
              <Text className="text-slate-500">{item.distance}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

