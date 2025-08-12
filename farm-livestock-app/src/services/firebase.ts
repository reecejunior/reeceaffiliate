import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const firebaseConfig = (Constants.expoConfig?.extra as any)?.firebase;

if (!firebaseConfig) {
  // eslint-disable-next-line no-console
  console.warn("Firebase config is missing in app.json extra.firebase");
}

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig || {});

export const auth = getAuth(app);
export const db = getFirestore(app);