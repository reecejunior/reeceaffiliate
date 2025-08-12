import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";

const QUEUE_FILE = FileSystem.cacheDirectory + "offline-queue.json";

type QueueItem = {
  id: string;
  type: "createAnimal" | "recordTransaction";
  payload: any;
};

async function readQueue(): Promise<QueueItem[]> {
  try {
    const exists = await FileSystem.getInfoAsync(QUEUE_FILE);
    if (!exists.exists) return [];
    const text = await FileSystem.readAsStringAsync(QUEUE_FILE);
    return JSON.parse(text) as QueueItem[];
  } catch {
    return [];
  }
}

async function writeQueue(items: QueueItem[]) {
  await FileSystem.writeAsStringAsync(QUEUE_FILE, JSON.stringify(items));
}

export async function enqueue(item: QueueItem) {
  const q = await readQueue();
  q.push(item);
  await writeQueue(q);
}

export async function syncQueue(handlers: {
  createAnimal: (payload: any) => Promise<any>;
  recordTransaction: (payload: any) => Promise<any>;
}) {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;
  let q = await readQueue();
  const remaining: QueueItem[] = [];
  for (const item of q) {
    try {
      // eslint-disable-next-line default-case
      switch (item.type) {
        case "createAnimal":
          await handlers.createAnimal(item.payload);
          break;
        case "recordTransaction":
          await handlers.recordTransaction(item.payload);
          break;
      }
    } catch {
      remaining.push(item);
    }
  }
  await writeQueue(remaining);
}