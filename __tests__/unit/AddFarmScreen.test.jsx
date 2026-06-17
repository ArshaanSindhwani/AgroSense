import React from "react";
import { render as rtlRender, screen, waitFor, userEvent } from "@testing-library/react-native";
import { Alert } from "react-native";

import AddFarmScreen from "../../app/add-farm";
import { ThemeProvider } from "../../context/ThemeContext";

const render = (component) => rtlRender(component, { wrapper: ThemeProvider });

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockReplace = jest.fn()
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuthContext: () => ({ user: { uid: "test-uid-123" } }),
}));

jest.mock("../../services/firebase/firestore", () => ({
  addFarm: jest.fn(),
}));

import { addFarm } from "../../services/firebase/firestore";
import { useRouter } from "expo-router";



// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Fill in required fields and optionally size/unit, then press Save farm. */
async function fillAndSubmit(user, options = {}) {
  const {
    name = "Greenacre Farm",
    postcode = "TA1 3LT",
    size,
    unit,
  } = options;

  if (name) {
    await user.type(screen.getByPlaceholderText("e.g. Greenacre Farm"), name);
  }
  if (postcode) {
    await user.type(screen.getByPlaceholderText("e.g. TA1 3LT"), postcode);
  }
  if (size) {
    await user.type(screen.getByPlaceholderText("0"), size);
  }
  if (unit) {
    await user.press(screen.getByText(unit));
  }

  await user.press(screen.getByText("Save farm"));
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AddFarmScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it("renders all form fields and buttons", async () => {
    await render(<AddFarmScreen />);

    expect(screen.getByText("Add a farm")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("e.g. Greenacre Farm")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("e.g. TA1 3LT")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("0")).toBeOnTheScreen();
    expect(screen.getByText("ha")).toBeOnTheScreen();
    expect(screen.getByText("acres")).toBeOnTheScreen();
    expect(screen.getByText("Save farm")).toBeOnTheScreen();
    expect(screen.getByText("Cancel")).toBeOnTheScreen();
  });


  // ── Happy path ─────────────────────────────────────────────────────────────

  it("submits required fields only and calls addFarm correctly", async () => {
    addFarm.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await fillAndSubmit(user, { name: "Greenacre Farm", postcode: "TA1 3LT" });

    await waitFor(() => {
      expect(addFarm).toHaveBeenCalledWith("test-uid-123", {
        name: "Greenacre Farm",
        location: "TA1 3LT",
        size: null,
      });
    });
  });

  it("submits with size and ha unit", async () => {
    addFarm.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await fillAndSubmit(user, {
      name: "Greenacre Farm",
      postcode: "TA1 3LT",
      size: "42.5",
      unit: "ha",
    });

    await waitFor(() => {
      expect(addFarm).toHaveBeenCalledWith("test-uid-123", {
        name: "Greenacre Farm",
        location: "TA1 3LT",
        size: { value: 42.5, unit: "ha" },
      });
    });
  });

  it("submits with size and acres unit", async () => {
    addFarm.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await fillAndSubmit(user, {
      name: "Hill Farm",
      postcode: "SW1A 1AA",
      size: "100",
      unit: "acres",
    });

    await waitFor(() => {
      expect(addFarm).toHaveBeenCalledWith("test-uid-123", {
        name: "Hill Farm",
        location: "SW1A 1AA",
        size: { value: 100, unit: "acres" },
      });
    });
  });

  it("shows success alert and navigates to fields on successful submit", async () => {
    addFarm.mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    await render(<AddFarmScreen />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Success", "Farm added successfully.");
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/fields");
    });
  });

  // ── Validation ─────────────────────────────────────────────────────────────

  it("shows error when farm name is empty", async () => {
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await user.press(screen.getByText("Save farm"));

    expect(screen.getByText("Farm name is required.")).toBeOnTheScreen();
    expect(addFarm).not.toHaveBeenCalled();
  });

  it("shows error when postcode is empty", async () => {
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await user.type(screen.getByPlaceholderText("e.g. Greenacre Farm"), "My Farm");
    await user.press(screen.getByText("Save farm"));

    expect(screen.getByText("Postcode is required.")).toBeOnTheScreen();
    expect(addFarm).not.toHaveBeenCalled();
  });

  it("shows error for invalid UK postcode format", async () => {
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await user.type(screen.getByPlaceholderText("e.g. Greenacre Farm"), "My Farm");
    await user.type(screen.getByPlaceholderText("e.g. TA1 3LT"), "NOTAPOSTCODE");
    await user.press(screen.getByText("Save farm"));

    expect(screen.getByText("Enter a valid UK postcode.")).toBeOnTheScreen();
    expect(addFarm).not.toHaveBeenCalled();
  });

  it("accepts valid UK postcodes in various formats", async () => {
    addFarm.mockResolvedValue(undefined);
    const user = userEvent.setup();

    const validPostcodes = ["SW1A 1AA", "EC1A 1BB", "W1A 0AX", "M1 1AE", "B338TH"];

    for (const postcode of validPostcodes) {
      jest.clearAllMocks();
      await render(<AddFarmScreen />);

      await fillAndSubmit(user, { name: "Test Farm", postcode });

      await waitFor(() => {
        expect(addFarm).toHaveBeenCalled();
      });
    }
  });

  it("shows error when size is non-numeric", async () => {
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await user.type(screen.getByPlaceholderText("e.g. Greenacre Farm"), "My Farm");
    await user.type(screen.getByPlaceholderText("e.g. TA1 3LT"), "TA1 3LT");
    await user.type(screen.getByPlaceholderText("0"), "abc");
    await user.press(screen.getByText("Save farm"));

    expect(screen.getByText("Size must be a number.")).toBeOnTheScreen();
    expect(addFarm).not.toHaveBeenCalled();
  });

  it("clears field error when user starts correcting it", async () => {
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    // Trigger name error
    await user.press(screen.getByText("Save farm"));
    expect(screen.getByText("Farm name is required.")).toBeOnTheScreen();

    // Start typing — error should clear
    await user.type(screen.getByPlaceholderText("e.g. Greenacre Farm"), "G");
    expect(screen.queryByText("Farm name is required.")).not.toBeOnTheScreen();
  });

  // ── Error handling ─────────────────────────────────────────────────────────

  it("does not navigate or show success alert when addFarm throws", async () => {
    addFarm.mockRejectedValueOnce(new Error("Firestore error"));
    const user = userEvent.setup();
    await render(<AddFarmScreen />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(addFarm).toHaveBeenCalled();
    });

    expect(Alert.alert).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it("disables submit button while loading", async () => {
    // Hang the promise so loading stays true throughout the assertion
    addFarm.mockReturnValueOnce(new Promise(() => {}));

    const user = userEvent.setup();
    await render(<AddFarmScreen />);
    await fillAndSubmit(user);


    await waitFor(() => {
      expect(screen.getByTestId("save-farm-button")).toBeDisabled();
    });
  });

  it("re-enables submit button after successful submission", async () => {
    addFarm.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    // Button enabled before submit
    expect(screen.getByText("Save farm")).toBeEnabled();

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(addFarm).toHaveBeenCalled();
    });

    // Button re-enabled after finally block runs
    expect(screen.getByText("Save farm")).toBeEnabled();
  });

  it("re-enables submit button after a failed submission", async () => {
    addFarm.mockRejectedValueOnce(new Error("Network error"));
    const user = userEvent.setup();
    await render(<AddFarmScreen />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(screen.getByText("Save farm")).toBeEnabled();
    });
  });
});
