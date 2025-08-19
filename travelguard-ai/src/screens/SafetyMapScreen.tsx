import React from 'react';
import { View, Text } from 'react-native';

export default function SafetyMapScreen() {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-64 bg-slate-200 items-center justify-center">
        <Text className="text-base font-medium text-slate-700">Heatmap placeholder</Text>
      </View>
      <View className="p-4">
        <Text className="text-xl font-semibold">Safety Map (Heatmap)</Text>
        <Text className="text-slate-600 mt-1">Visualize safety levels across the area.</Text>
      </View>
    </View>
  );
}

