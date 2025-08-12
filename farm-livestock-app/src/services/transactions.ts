import { db } from "./firebase";
import { addDoc, collection, doc, getDoc, runTransaction, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import type { Transaction, TransactionType, Animal } from "../types";
import { aggregatesDocRef } from "./animals";

const DEFAULT_FARM = "defaultFarm";

function transactionsCollection(farmId: string = DEFAULT_FARM) {
  return collection(db, "farms", farmId, "transactions");
}

export async function recordTransaction(params: {
  farmId: string;
  type: TransactionType;
  animalId: string;
  animalSpecies: string;
  quantity: number;
  pricePerUnit?: number;
  counterparty?: string;
  createdBy: string;
  notes?: string;
}) {
  const { farmId, type, animalId, animalSpecies, quantity, pricePerUnit, counterparty, createdBy, notes } = params;
  const amount = pricePerUnit ? pricePerUnit * quantity : undefined;

  await runTransaction(db, async (tx) => {
    const animalRef = doc(db, "farms", farmId, "animals", animalId);
    const animalSnap = await tx.get(animalRef);
    if (!animalSnap.exists()) throw new Error("Animal not found");
    const animal = animalSnap.data() as Animal;

    let newCount = animal.count;
    if (type === "purchase" || type === "birth" || type === "adjustment") {
      newCount = animal.count + quantity;
    } else if (type === "sale" || type === "death") {
      newCount = Math.max(0, animal.count - quantity);
    }

    tx.update(animalRef, { count: newCount, updatedAt: Date.now() });

    const aggregatesRef = aggregatesDocRef(farmId);
    const aggregatesSnap = await tx.get(aggregatesRef);
    const cur = aggregatesSnap.exists() ? (aggregatesSnap.data() as any) : { bySpecies: {}, totalAnimals: 0, revenue: 0, expenses: 0, profit: 0 };

    const deltaCount = newCount - animal.count;
    const bySpecies = { ...cur.bySpecies };
    bySpecies[animalSpecies] = Math.max(0, (bySpecies[animalSpecies] ?? 0) + deltaCount);

    let { revenue, expenses } = cur;
    if (amount) {
      if (type === "sale") revenue += amount;
      if (type === "purchase") expenses += amount;
    }

    const next = {
      bySpecies,
      totalAnimals: Math.max(0, (cur.totalAnimals ?? 0) + deltaCount),
      revenue,
      expenses,
      profit: revenue - expenses,
      updatedAt: Date.now(),
    };

    tx.set(aggregatesRef, next, { merge: true });

    const txn: Omit<Transaction, "id"> = {
      animalId,
      animalSpecies,
      type,
      quantity,
      pricePerUnit,
      totalPrice: amount,
      counterparty,
      timestamp: Date.now(),
      farmId,
      createdBy,
      notes,
    };

    const txnRef = doc(transactionsCollection(farmId));
    tx.set(txnRef, txn);
  });
}