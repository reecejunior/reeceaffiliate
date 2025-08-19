import * as InAppPurchases from 'expo-in-app-purchases';

export const PRODUCTS = {
  premiumPacks: 'premium_packs',
  unlimitedTranslate: 'unlimited_translate',
  realtimeAlerts: 'realtime_alerts',
};

export async function initializePurchases() {
  try {
    await InAppPurchases.connectAsync();
  } catch {}
}

export async function getProducts() {
  const ids = Object.values(PRODUCTS);
  const { results } = await InAppPurchases.getProductsAsync(ids);
  return results;
}

export async function purchase(productId: string) {
  await InAppPurchases.purchaseItemAsync(productId);
}

export async function disconnectPurchases() {
  try {
    await InAppPurchases.disconnectAsync();
  } catch {}
}

