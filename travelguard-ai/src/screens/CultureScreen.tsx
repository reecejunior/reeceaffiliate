import React from 'react';
import { View, Text } from 'react-native';

export default function CultureScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold">Culture</Text>
      <Text className="text-slate-600">Learn local customs and cultural tips.</Text>
    </View>
  );
}

