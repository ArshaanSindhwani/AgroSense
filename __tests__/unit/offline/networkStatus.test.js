import NetInfo from "@react-native-community/netinfo";
import { isOnline, listenToNetworkStatus } from "../../../services/offline/networkStatus";

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

describe("networkStatus", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("isOnline", () => {
    it("returns true when connected and internet is reachable", async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        isInternetReachable: true,
      });
      expect(await isOnline()).toBe(true);
    });

    it("returns true when isInternetReachable is null (unknown)", async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        isInternetReachable: null,
      });
      expect(await isOnline()).toBe(true);
    });

    it("returns false when not connected", async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: false,
        isInternetReachable: false,
      });
      expect(await isOnline()).toBe(false);
    });

    it("returns false when connected but internet explicitly unreachable", async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: true,
        isInternetReachable: false,
      });
      expect(await isOnline()).toBe(false);
    });

    it("returns false when isConnected is null", async () => {
      NetInfo.fetch.mockResolvedValue({
        isConnected: null,
        isInternetReachable: true,
      });
      expect(await isOnline()).toBe(false);
    });
  });

  describe("listenToNetworkStatus", () => {
    it("calls callback with true when online", () => {
      const callback = jest.fn();
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockImplementation((handler) => {
        handler({ isConnected: true, isInternetReachable: true });
        return unsubscribe;
      });

      const result = listenToNetworkStatus(callback);

      expect(callback).toHaveBeenCalledWith(true);
      expect(result).toBe(unsubscribe);
    });

    it("calls callback with false when offline", () => {
      const callback = jest.fn();
      NetInfo.addEventListener.mockImplementation((handler) => {
        handler({ isConnected: false, isInternetReachable: false });
        return jest.fn();
      });

      listenToNetworkStatus(callback);
      expect(callback).toHaveBeenCalledWith(false);
    });

    it("calls callback with false when internet is explicitly unreachable", () => {
      const callback = jest.fn();
      NetInfo.addEventListener.mockImplementation((handler) => {
        handler({ isConnected: true, isInternetReachable: false });
        return jest.fn();
      });

      listenToNetworkStatus(callback);
      expect(callback).toHaveBeenCalledWith(false);
    });

    it("returns the unsubscribe function from NetInfo", () => {
      const unsubscribe = jest.fn();
      NetInfo.addEventListener.mockReturnValue(unsubscribe);
      expect(listenToNetworkStatus(jest.fn())).toBe(unsubscribe);
    });
  });
});
