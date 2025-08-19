import React from 'react';
import { View, Text } from 'react-native';

export default function VoiceTranslateScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-4">
      <View className="w-full h-40 bg-slate-200 items-center justify-center rounded-md">
        <Text className="text-slate-700">Microphone / voice UI placeholder</Text>
      </View>
      <Text className="text-xl font-semibold mt-4">Translate (Voice)</Text>
    </View>
  );
}

