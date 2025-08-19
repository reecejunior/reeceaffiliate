import React from 'react';
import { View, Text } from 'react-native';

export default function PlaceDetailsScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="w-full h-48 bg-slate-200 items-center justify-center rounded-md">
        <Text className="text-slate-700">Image / Map preview placeholder</Text>
      </View>
      <View className="mt-4">
        <Text className="text-2xl font-semibold">Place Details</Text>
        <Text className="text-slate-600 mt-1">Summary and information about this place.</Text>
      </View>
    </View>
  );
}

