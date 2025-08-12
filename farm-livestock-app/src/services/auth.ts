import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile, UserRole } from "../types";

export async function signUpWithEmail(params: { email: string; password: string; displayName?: string; farmId?: string; role?: UserRole }) {
  const { email, password, displayName, farmId = "defaultFarm", role = "worker" } = params;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  const profile: UserProfile = {
    uid: cred.user.uid,
    email,
    displayName,
    role,
    farmId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as UserProfile;
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return cred.user;
}

export async function signInWithEmail(params: { email: string; password: string }) {
  const { email, password } = params;
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export async function loadUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}