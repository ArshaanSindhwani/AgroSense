import { useEffect, useState } from "react";

import { isOnline, listenToNetworkStatus } from "../services/offline/networkStatus";
import { syncOfflineQueue } from "../services/offline/syncService";

export default function useNetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    async function checkInitialStatus() {
      const status = await isOnline();
      setOnline(status);

      if (status) {
        await syncOfflineQueue();
      }
    }

    checkInitialStatus();

    const unsubscribe = listenToNetworkStatus(async (status) => {
      setOnline(status);

      if (status) {
        await syncOfflineQueue();
      }
    });

    return unsubscribe;
  }, []);

  return online;
}