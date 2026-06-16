import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  clearSyncQueue,
} from "../../../services/offline/syncQueue";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const QUEUE_KEY = "agrosense_sync_queue";

describe("syncQueue", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getSyncQueue", () => {
    it("returns the stored queue when it exists", async () => {
      const stored = [{ id: "1", type: "CREATE_FARM" }];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(stored));
      expect(await getSyncQueue()).toEqual(stored);
    });

    it("returns an empty array when storage is empty", async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      expect(await getSyncQueue()).toEqual([]);
    });
  });

  describe("addToSyncQueue", () => {
    it("appends a new item and persists the queue", async () => {
      const existing = [{ id: "existing-1", type: "CREATE_FIELD" }];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(existing));
      AsyncStorage.setItem.mockResolvedValue(undefined);

      const payload = { userId: "u1", data: { name: "Farm A" } };
      const item = await addToSyncQueue("CREATE_FARM", payload);

      expect(item).toMatchObject({ type: "CREATE_FARM", payload });
      expect(item.id).toBeDefined();
      expect(item.createdAt).toBeDefined();

      const [savedKey, savedValue] = AsyncStorage.setItem.mock.calls[0];
      expect(savedKey).toBe(QUEUE_KEY);
      const saved = JSON.parse(savedValue);
      expect(saved).toHaveLength(2);
      expect(saved[1]).toMatchObject({ type: "CREATE_FARM", payload });
    });

    it("creates a queue from scratch when storage is empty", async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      AsyncStorage.setItem.mockResolvedValue(undefined);

      const item = await addToSyncQueue("CREATE_OBSERVATION", { obs: true });

      const saved = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe(item.id);
    });

    it("generates unique ids for concurrent additions", async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      AsyncStorage.setItem.mockResolvedValue(undefined);

      const [a, b] = await Promise.all([
        addToSyncQueue("CREATE_FARM", {}),
        addToSyncQueue("CREATE_FIELD", {}),
      ]);
      expect(a.id).not.toBe(b.id);
    });
  });

  describe("removeFromSyncQueue", () => {
    it("removes the item with matching id", async () => {
      const queue = [
        { id: "keep-me", type: "CREATE_FARM" },
        { id: "remove-me", type: "CREATE_FIELD" },
      ];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(queue));
      AsyncStorage.setItem.mockResolvedValue(undefined);

      await removeFromSyncQueue("remove-me");

      const saved = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe("keep-me");
    });

    it("leaves the queue unchanged when id is not found", async () => {
      const queue = [{ id: "only-item", type: "CREATE_FARM" }];
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(queue));
      AsyncStorage.setItem.mockResolvedValue(undefined);

      await removeFromSyncQueue("nonexistent");

      const saved = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
      expect(saved).toHaveLength(1);
    });
  });

  describe("clearSyncQueue", () => {
    it("stores an empty array", async () => {
      AsyncStorage.setItem.mockResolvedValue(undefined);
      await clearSyncQueue();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        QUEUE_KEY,
        JSON.stringify([])
      );
    });
  });
});
