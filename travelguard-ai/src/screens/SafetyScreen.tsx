import React from 'react';
import { View, Text } from 'react-native';

export default function SafetyScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold">Safety</Text>
      <Text className="text-slate-600">Emergency info and safety alerts.</Text>
    </View>
  );
}

