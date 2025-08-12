import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigation from "./src/navigation";
import { AuthProvider, useAuthGate } from "./src/state/authGate";
import { registerForPushNotificationsAsync } from "./src/services/notifications";
import { syncQueue } from "./src/services/offlineQueue";
import { createAnimal as createAnimalOnline } from "./src/services/animals";
import { recordTransaction as recordTransactionOnline } from "./src/services/transactions";

function AppBootstrap() {
  const { user } = useAuthGate();

  useEffect(() => {
    if (user?.uid) {
      registerForPushNotificationsAsync(user.uid);
      syncQueue({
        createAnimal: async (payload) => {
          await createAnimalOnline(payload.farmId, payload.data);
        },
        recordTransaction: async (payload) => {
          await recordTransactionOnline(payload);
        },
      });
    }
  }, [user?.uid]);

  return <RootNavigation />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppBootstrap />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
