import React from 'react';
import { View, Text } from 'react-native';

export default function TranslateScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold">Translate</Text>
      <Text className="text-slate-600">Speak and translate phrases on the go.</Text>
    </View>
  );
}

