export type UserRole = "manager" | "worker" | "viewer";

export type Species = "pig" | "chicken" | "goat" | "cow" | "sheep" | "other";

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  farmId: string;
  pushToken?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Animal {
  id: string;
  species: Species | string;
  breed?: string;
  ageMonths?: number;
  healthStatus?: string;
  averageWeightKg?: number;
  count: number;
  notes?: string;
  farmId: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export type TransactionType = "purchase" | "sale" | "birth" | "death" | "adjustment";

export interface Transaction {
  id: string;
  animalId: string;
  animalSpecies: Species | string;
  type: TransactionType;
  quantity: number;
  pricePerUnit?: number;
  totalPrice?: number;
  counterparty?: string; // buyer or seller name
  timestamp: number;
  farmId: string;
  createdBy: string;
  notes?: string;
}

export interface Aggregates {
  bySpecies: Record<string, number>;
  totalAnimals: number;
  revenue: number; // sum of sales
  expenses: number; // sum of purchases
  profit: number; // revenue - expenses
  updatedAt: number;
}