import { addFarm, addField, addObs } from "../../../services/firebase/firestore";

jest.mock("../../../services/firebase/firestore", () => ({
  addFarm: jest.fn(),
  addField: jest.fn(),
  addObs: jest.fn(),
}));

describe("syncService", () => {
  let syncOfflineQueue;
  let isOnlineMock;
  let getSyncQueueMock;
  let removeFromSyncQueueMock;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.isolateModules(() => {
      jest.mock("../../../services/offline/networkStatus", () => ({ isOnline: jest.fn() }));
      jest.mock("../../../services/offline/syncQueue", () => ({
        getSyncQueue: jest.fn(),
        removeFromSyncQueue: jest.fn(),
      }));

      isOnlineMock = require("../../../services/offline/networkStatus").isOnline;
      getSyncQueueMock = require("../../../services/offline/syncQueue").getSyncQueue;
      removeFromSyncQueueMock = require("../../../services/offline/syncQueue").removeFromSyncQueue;
      syncOfflineQueue = require("../../../services/offline/syncService").syncOfflineQueue;
    });
  });

  it("returns offline message when device has no connection", async () => {
    isOnlineMock.mockResolvedValue(false);

    const result = await syncOfflineQueue();

    expect(result).toEqual({ success: false, message: "Device is offline.", syncedCount: 0 });
    expect(getSyncQueueMock).not.toHaveBeenCalled();
  });

  it("returns empty-queue message when online but nothing to sync", async () => {
    isOnlineMock.mockResolvedValue(true);
    getSyncQueueMock.mockResolvedValue([]);

    const result = await syncOfflineQueue();

    expect(result).toEqual({
      success: true,
      message: "No offline items to sync.",
      syncedCount: 0
    });
  });

  it("processes CREATE_FARM items and removes them from the queue", async () => {
    isOnlineMock.mockResolvedValue(true);
    const item = {
      id: "farm-1",
      type: "CREATE_FARM",
      payload: { userId: "u1", data: { name: "Farm A" } },
    };
    getSyncQueueMock.mockResolvedValue([item]);
    addFarm.mockResolvedValue();
    removeFromSyncQueueMock.mockResolvedValue();

    const result = await syncOfflineQueue();

    expect(addFarm).toHaveBeenCalledWith("u1", { name: "Farm A" });
    expect(removeFromSyncQueueMock).toHaveBeenCalledWith("farm-1");
    expect(result).toEqual({ success: true, message: "Offline sync complete.", syncedCount: 1 });
  });

  it("processes CREATE_FIELD items", async () => {
    isOnlineMock.mockResolvedValue(true);
    const item = {
      id: "field-1",
      type: "CREATE_FIELD",
      payload: { farmId: "f1", name: "Field A" },
    };
    getSyncQueueMock.mockResolvedValue([item]);
    addField.mockResolvedValue();
    removeFromSyncQueueMock.mockResolvedValue();

    await syncOfflineQueue();

    expect(addField).toHaveBeenCalledWith(item.payload);
    expect(removeFromSyncQueueMock).toHaveBeenCalledWith("field-1");
  });

  it("processes CREATE_OBSERVATION items", async () => {
    isOnlineMock.mockResolvedValue(true);
    const item = {
      id: "obs-1",
      type: "CREATE_OBSERVATION",
      payload: { fieldId: "fi1", note: "Pests spotted" },
    };
    getSyncQueueMock.mockResolvedValue([item]);
    addObs.mockResolvedValue();
    removeFromSyncQueueMock.mockResolvedValue();

    await syncOfflineQueue();

    expect(addObs).toHaveBeenCalledWith(item.payload);
    expect(removeFromSyncQueueMock).toHaveBeenCalledWith("obs-1");
  });

  it("continues processing remaining items when one fails", async () => {
    isOnlineMock.mockResolvedValue(true);
    const failItem = {
      id: "fail-1",
      type: "CREATE_FARM",
      payload: { userId: "u1", data: {} },
    };
    const okItem = {
      id: "ok-1",
      type: "CREATE_FIELD",
      payload: { farmId: "f1" },
    };
    getSyncQueueMock.mockResolvedValue([failItem, okItem]);
    addFarm.mockRejectedValue(new Error("Firestore error"));
    addField.mockResolvedValue();
    removeFromSyncQueueMock.mockResolvedValue();

    const result = await syncOfflineQueue();

    expect(removeFromSyncQueueMock).not.toHaveBeenCalledWith("fail-1");
    expect(removeFromSyncQueueMock).toHaveBeenCalledWith("ok-1");
    expect(result).toEqual({ success: true, message: "Offline sync complete.", syncedCount: 1 });
  });

  it("resets the syncing flag after completion (allows re-run)", async () => {
    isOnlineMock.mockResolvedValue(true);
    getSyncQueueMock.mockResolvedValue([]);

    await syncOfflineQueue();
    const second = await syncOfflineQueue();

    expect(second).toEqual({
      success: true,
      message: "No offline items to sync.",
      syncedCount: 0
    });
  });

  it("resets the syncing flag even when an unhandled error occurs", async () => {
    isOnlineMock.mockRejectedValueOnce(new Error("Network check failed"));

    await expect(syncOfflineQueue()).rejects.toThrow("Network check failed");

    isOnlineMock.mockResolvedValue(true);
    getSyncQueueMock.mockResolvedValue([]);
    const second = await syncOfflineQueue();
    expect(second.success).toBe(true);
  });

  it("prevents concurrent sync runs", async () => {
    isOnlineMock.mockResolvedValue(true);
    getSyncQueueMock.mockResolvedValue([]);

    const first = syncOfflineQueue();
    const second = syncOfflineQueue();

    const [r1, r2] = await Promise.all([first, second]);

    const rejected = [r1, r2].find((r) => r.message === "Sync already running.");
    const succeeded = [r1, r2].find((r) => r.success === true);
    expect(rejected).toBeDefined();
    expect(succeeded).toBeDefined();
  });
});
