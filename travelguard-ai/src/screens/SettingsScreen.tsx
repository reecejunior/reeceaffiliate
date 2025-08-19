import React from 'react';
import { View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold">Settings</Text>
      <Text className="text-slate-600">Manage preferences and permissions.</Text>
    </View>
  );
}

