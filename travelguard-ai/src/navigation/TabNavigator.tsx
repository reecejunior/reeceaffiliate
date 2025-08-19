import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DiscoverScreen from '../screens/DiscoverScreen';
import SafetyMapScreen from '../screens/SafetyMapScreen';
import TranslateScreen from '../screens/TranslateScreen';
import CultureScreen from '../screens/CultureScreen';
import RentalsScreen from '../screens/RentalsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootTabParamList = {
  Discover: undefined;
  Safety: undefined;
  Translate: undefined;
  Culture: undefined;
  Rentals: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarIcon: ({ color, size }) => {
          const name = route.name;
          if (name === 'Discover') return <Ionicons name="compass-outline" size={size} color={color} />;
          if (name === 'Safety') return <Ionicons name="shield-outline" size={size} color={color} />;
          if (name === 'Translate') return <Ionicons name="globe-outline" size={size} color={color} />;
          if (name === 'Culture') return <Ionicons name="book-outline" size={size} color={color} />;
          if (name === 'Rentals') return <Ionicons name="car-outline" size={size} color={color} />;
          if (name === 'Settings') return <Ionicons name="settings-outline" size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Safety" component={SafetyMapScreen} />
      <Tab.Screen name="Translate" component={TranslateScreen} />
      <Tab.Screen name="Culture" component={CultureScreen} />
      <Tab.Screen name="Rentals" component={RentalsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

