import React from 'react';
import { View, Text } from 'react-native';

export default function DiscoverScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold">Discover</Text>
      <Text className="text-slate-600">Explore nearby places and attractions.</Text>
    </View>
  );
}

