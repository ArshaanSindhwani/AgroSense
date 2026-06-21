import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

import {
  isOnline,
  listenToNetworkStatus,
} from "../services/offline/networkStatus";
import { syncOfflineQueue } from "../services/offline/syncService";

export default function useNetworkStatus() {
  const [online, setOnline] = useState(true);
  const wasOffline = useRef(false);

  useEffect(() => {
    async function checkInitialStatus() {
      const status = await isOnline();

      setOnline(status);

      if (!status) {
        wasOffline.current = true;
      }
    }

    checkInitialStatus();

    const unsubscribe = listenToNetworkStatus(async (status) => {
      setOnline(status);

      if (!status) {
        wasOffline.current = true;
        return;
      }

      if (wasOffline.current) {
        try {
          const result = await syncOfflineQueue();

          if (result.success && result.syncedCount > 0) {
            Alert.alert(
              "Connection restored",
              `${result.syncedCount} observation${
                result.syncedCount > 1 ? "s have" : " has"
              } been synced successfully.`
            );
          }
        } catch (error) {
          console.log("Offline sync failed:", error.message);
        } finally {
          wasOffline.current = false;
        }
      }
    });

    return unsubscribe;
  }, []);

  return online;
}