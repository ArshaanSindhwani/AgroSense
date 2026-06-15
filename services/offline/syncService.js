import { isOnline } from "./networkStatus";
import {
  getSyncQueue,
  removeFromSyncQueue,
} from "./syncQueue";

import {
  addFarm,
  addField,
  addObs,
} from "../firebase/firestore";

export async function syncOfflineQueue() {
  const online = await isOnline();

  if (!online) {
    return {
      success: false,
      message: "Device is offline.",
    };
  }

  const queue = await getSyncQueue();

  if (!queue.length) {
    return {
      success: true,
      message: "No offline items to sync.",
    };
  }

  for (const item of queue) {
    try {
      if (item.type === "CREATE_FARM") {
        await addFarm(item.payload.userId, item.payload.data);
      }

      if (item.type === "CREATE_FIELD") {
        await addField(item.payload);
      }

      if (item.type === "CREATE_OBSERVATION") {
        await addObs(item.payload);
      }

      await removeFromSyncQueue(item.id);
    } catch (error) {
      console.log("Failed to sync item:", item, error.message);
    }
  }

  return {
    success: true,
    message: "Offline sync complete.",
  };
}