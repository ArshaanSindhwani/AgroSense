import {
  getStorageItem,
  setStorageItem,
} from "./offlineStorage";

const SYNC_QUEUE_KEY = "agrosense_sync_queue";

export async function getSyncQueue() {
  const queue = await getStorageItem(SYNC_QUEUE_KEY);
  return queue || [];
}

export async function addToSyncQueue(type, payload) {
  const queue = await getSyncQueue();

  const queueItem = {
    id: `${Date.now()}-${Math.random()}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
  };

  const updatedQueue = [...queue, queueItem];

  await setStorageItem(SYNC_QUEUE_KEY, updatedQueue);

  return queueItem;
}

export async function removeFromSyncQueue(queueItemId) {
  const queue = await getSyncQueue();

  const updatedQueue = queue.filter((item) => item.id !== queueItemId);

  await setStorageItem(SYNC_QUEUE_KEY, updatedQueue);
}

export async function clearSyncQueue() {
  await setStorageItem(SYNC_QUEUE_KEY, []);
}