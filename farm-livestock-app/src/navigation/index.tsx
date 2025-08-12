import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AnimalListScreen from "../screens/inventory/AnimalListScreen";
import AddAnimalScreen from "../screens/inventory/AddAnimalScreen";
import TransactionListScreen from "../screens/transactions/TransactionListScreen";
import AddTransactionScreen from "../screens/transactions/AddTransactionScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useAuthGate } from "../state/authGate";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Inventory" component={AnimalListScreen} />
      <Tab.Screen name="Transactions" component={TransactionListScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigation() {
  const { user, loading } = useAuthGate();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AddAnimal" component={AddAnimalScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}