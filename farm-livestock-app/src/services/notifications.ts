import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function registerForPushNotificationsAsync(userId: string) {
  let token: string | undefined;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return undefined;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    await setDoc(doc(db, "users", userId), { pushToken: token, updatedAt: Date.now() }, { merge: true });
  }

  return token;
}