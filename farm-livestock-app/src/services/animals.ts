import { db } from "./firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import type { Animal, Aggregates } from "../types";

const DEFAULT_FARM = "defaultFarm";

export function animalsCollection(farmId: string = DEFAULT_FARM) {
  return collection(db, "farms", farmId, "animals");
}

export async function createAnimal(farmId: string, data: Omit<Animal, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(animalsCollection(farmId), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  await updateAggregatesForAnimalChange(farmId, data.species as string, data.count);
  return ref.id;
}

export async function updateAnimal(farmId: string, animalId: string, updates: Partial<Animal>) {
  const ref = doc(db, "farms", farmId, "animals", animalId);
  await updateDoc(ref, { ...updates, updatedAt: Date.now() });
}

export async function deleteAnimal(farmId: string, animalId: string) {
  const ref = doc(db, "farms", farmId, "animals", animalId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const animal = snap.data() as Animal;
    await deleteDoc(ref);
    await updateAggregatesForAnimalChange(farmId, animal.species as string, -animal.count);
  }
}

export function listenAnimals(farmId: string, callback: (animals: Animal[]) => void) {
  const q = query(animalsCollection(farmId), orderBy("species"));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Animal[];
    callback(list);
  });
}

export function aggregatesDocRef(farmId: string) {
  return doc(db, "farms", farmId, "meta", "aggregates");
}

export async function updateAggregatesForAnimalChange(farmId: string, species: string, deltaCount: number) {
  const ref = aggregatesDocRef(farmId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const cur = (snap.exists() ? (snap.data() as Aggregates) : { bySpecies: {}, totalAnimals: 0, revenue: 0, expenses: 0, profit: 0, updatedAt: 0 });
    const currentSpeciesCount = cur.bySpecies[species] ?? 0;
    const newSpeciesCount = Math.max(0, currentSpeciesCount + deltaCount);
    const newTotal = Math.max(0, (cur.totalAnimals ?? 0) + deltaCount);
    const next: Aggregates = {
      ...cur,
      bySpecies: { ...cur.bySpecies, [species]: newSpeciesCount },
      totalAnimals: newTotal,
      profit: (cur.revenue ?? 0) - (cur.expenses ?? 0),
      updatedAt: Date.now(),
    } as Aggregates;
    tx.set(ref, next, { merge: true });
  });
}