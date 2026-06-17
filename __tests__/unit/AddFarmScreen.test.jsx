// __tests__/unit/AddFarmScreen.test.jsx

import React from "react";
import { render, screen, userEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import AddFarmScreen from "../../app/add-farm";

// --- mock external dependencies ----------------------------------------------

const mockBack = jest.fn();
jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack }) }));

jest.mock("../../context/AuthContext", () => ({
  useAuthContext: () => ({ user: { uid: "user-123" } }),
}));

const mockRefresh = jest.fn();
jest.mock("../../context/FarmContext", () => ({
  useFarmContext: () => ({ refresh: mockRefresh }),
}));

const mockAddFarm = jest.fn();
jest.mock("../../services/firebase/firestore", () => ({
  addFarm: (...args) => mockAddFarm(...args),
}));

jest.mock("../../hooks/useColorScheme", () => ({
  useThemeColor: () => "#000",
}));

// --- AddFarmForm mock ---------------------------------------------------------
// submitData is declared with a mock-prefixed name so Jest's hoisting
// allows the factory closure to reference it before imports are resolved.

const mockSubmitData = {
  name: "Green Acres",
  location: "Yorkshire",
  size: "50",
  unit: "ha",
};

jest.mock("../../components/forms/AddFarmForm", () => {
  const React = require("react");
  const { View, Pressable, Text } = require("react-native");
  return {
    AddFarmForm: ({ onSubmit, loading }) => (
      <View>
        <Pressable
          role="button"
          aria-label="Submit farm"
          accessibilityState={{ busy: loading }}
          onPress={() => onSubmit(mockSubmitData)}
        >
          <Text>Submit farm</Text>
        </Pressable>
      </View>
    ),
  };
});

// --- helpers -----------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  mockSubmitData.size = "50";
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

// =============================================================================
// Rendering
// =============================================================================

describe("AddFarmScreen rendering", () => {
  it("renders the submit button", async () => {
    await render(<AddFarmScreen />);

    expect(screen.getByRole("button", { name: "Submit farm" })).toBeOnTheScreen();
  });

  it("submit button is not busy on initial render", async () => {
    await render(<AddFarmScreen />);

    expect(screen.getByRole("button", { name: "Submit farm" })).not.toBeBusy();
  });
});

// =============================================================================
// handleSubmit — happy path
// =============================================================================

describe("handleSubmit — success", () => {
  it("calls addFarm with the current user uid and mapped farm data", async () => {
    mockAddFarm.mockResolvedValue();
    mockRefresh.mockResolvedValue();
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(mockAddFarm).toHaveBeenCalledWith("user-123", {
      name: "Green Acres",
      location: "Yorkshire",
      size: { value: 50, unit: "ha" },
    });
  });

  it("parses size as a float", async () => {
    mockSubmitData.size = "12.75";
    mockAddFarm.mockResolvedValue();
    mockRefresh.mockResolvedValue();
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(mockAddFarm).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ size: { value: 12.75, unit: "ha" } })
    );
  });

  it("calls refresh after addFarm resolves", async () => {
    mockAddFarm.mockResolvedValue();
    mockRefresh.mockResolvedValue();
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    const addFarmOrder = mockAddFarm.mock.invocationCallOrder[0];
    const refreshOrder = mockRefresh.mock.invocationCallOrder[0];
    expect(refreshOrder).toBeGreaterThan(addFarmOrder);
  });

  it("shows a success Alert after the farm is added", async () => {
    mockAddFarm.mockResolvedValue();
    mockRefresh.mockResolvedValue();
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(Alert.alert).toHaveBeenCalledWith("Success", "Farm added successfully.");
  });

  it("navigates back after a successful submission", async () => {
    mockAddFarm.mockResolvedValue();
    mockRefresh.mockResolvedValue();
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("button is no longer busy after a successful submission", async () => {
    mockAddFarm.mockResolvedValue();
    mockRefresh.mockResolvedValue();
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(screen.getByRole("button", { name: "Submit farm" })).not.toBeBusy();
  });
});

// =============================================================================
// handleSubmit — error path
// =============================================================================

describe("handleSubmit — failure", () => {
  it("does not show a success Alert when addFarm rejects", async () => {
    mockAddFarm.mockRejectedValue(new Error("Firestore write failed"));
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it("does not navigate back when addFarm rejects", async () => {
    mockAddFarm.mockRejectedValue(new Error("Firestore write failed"));
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(mockBack).not.toHaveBeenCalled();
  });

  it("button is no longer busy after addFarm rejects", async () => {
    mockAddFarm.mockRejectedValue(new Error("Firestore write failed"));
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(screen.getByRole("button", { name: "Submit farm" })).not.toBeBusy();
  });
});

// =============================================================================
// handleSubmit — size omitted
// =============================================================================

describe("handleSubmit — size omitted", () => {
  it("passes size=null when the form submits an empty size string", async () => {
    mockSubmitData.size = "";
    mockAddFarm.mockResolvedValue();
    mockRefresh.mockResolvedValue();
    const user = userEvent.setup();

    await render(<AddFarmScreen />);
    await user.press(screen.getByRole("button", { name: "Submit farm" }));

    expect(mockAddFarm).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ size: null })
    );
  });
});