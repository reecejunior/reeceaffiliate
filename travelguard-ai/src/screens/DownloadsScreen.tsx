import React from 'react';
import { View, Text } from 'react-native';

export default function DownloadsScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-semibold">Downloads</Text>
      <Text className="text-slate-600 mt-1">Manage offline data and maps.</Text>
    </View>
  );
}

