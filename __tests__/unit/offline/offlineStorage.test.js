import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "../../../services/offline/offlineStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("offlineStorage", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("getStorageItem", () => {
    it("returns parsed value when key exists", async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ foo: "bar" }));
      expect(await getStorageItem("my-key")).toEqual({ foo: "bar" });
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("my-key");
    });

    it("returns null when key does not exist", async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      expect(await getStorageItem("missing")).toBeNull();
    });

    it("handles stored primitive values", async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(42));
      expect(await getStorageItem("num")).toBe(42);
    });
  });

  describe("setStorageItem", () => {
    it("stringifies the value and stores it", async () => {
      AsyncStorage.setItem.mockResolvedValue(undefined);
      await setStorageItem("key", { a: 1 });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "key",
        JSON.stringify({ a: 1 })
      );
    });

    it("stores primitive values", async () => {
      AsyncStorage.setItem.mockResolvedValue(undefined);
      await setStorageItem("key", true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("key", "true");
    });
  });

  describe("removeStorageItem", () => {
    it("calls AsyncStorage.removeItem with the correct key", async () => {
      AsyncStorage.removeItem.mockResolvedValue(undefined);
      await removeStorageItem("del-key");
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("del-key");
    });
  });
});
