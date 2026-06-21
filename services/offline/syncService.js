import { isOnline } from "./networkStatus";
import { getSyncQueue, removeFromSyncQueue } from "./syncQueue";

import { addFarm, addField, addObs } from "../firebase/firestore";

let syncing = false;

export async function syncOfflineQueue() {
  if (syncing) {
    return {
      success: false,
      syncedCount: 0,
      message: "Sync already running.",
    };
  }

  syncing = true;
  let syncedCount = 0;

  try {
    const online = await isOnline();

    if (!online) {
      return {
        success: false,
        syncedCount: 0,
        message: "Device is offline.",
      };
    }

    const queue = await getSyncQueue();

    if (!queue.length) {
      return {
        success: true,
        syncedCount: 0,
        message: "No offline items to sync.",
      };
    }

    for (const item of queue) {
      try {
        if (item.type === "CREATE_FARM") {
          await addFarm(item.payload.userId, item.payload.data);
          syncedCount++;
        }

        if (item.type === "CREATE_FIELD") {
          await addField(item.payload);
          syncedCount++;
        }

        if (item.type === "CREATE_OBSERVATION") {
          await addObs(item.payload);
          syncedCount++;
        }

        await removeFromSyncQueue(item.id);
      } catch (error) {
        console.log("Failed to sync item:", item, error.message);
      }
    }

    return {
      success: true,
      syncedCount,
      message: "Offline sync complete.",
    };
  } finally {
    syncing = false;
  }
}