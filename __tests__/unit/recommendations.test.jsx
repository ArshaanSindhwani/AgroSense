import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import RecommendationsScreen from "../../app/(tabs)/recommendations";
import { getObs, getRecommendations, addRecommendation } from "../../services/firebase/firestore";
import { generateRecommendation } from "../../services/ai/recommendationService";
import { isOnline } from "../../services/offline/networkStatus";

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("../../services/firebase/firestore", () => ({
  getObs: jest.fn(),
  getRecommendations: jest.fn(),
  addRecommendation: jest.fn(),
}));

jest.mock("../../services/ai/recommendationService", () => ({
  generateRecommendation: jest.fn(),
}));

jest.mock("../../services/offline/networkStatus", () => ({
  isOnline: jest.fn(),
}));

jest.mock("../../hooks/useThemeColor", () => ({
  useThemeColor: () => "#000000",
}));

jest.mock("../../context/FarmContext", () => ({
  useFarmContext: jest.fn(),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../../components/cards/RecommendationCard", () => {
  const { Text } = require("react-native");
  return ({ recommendation }) => recommendation ? <Text>{recommendation}</Text> : null;
});

const { useFarmContext } = require("../../context/FarmContext");
const { useAuthContext } = require("../../context/AuthContext");

const mockField = { id: "field-1", name: "North Field", cropType: "Wheat" };
const mockObservation = {
  id: "obs-1",
  fieldId: "field-1",
  growthStage: "Tillering",
  pestSighting: "Aphids",
  diseaseSighting: "",
  soilCondition: "",
  notes: "Looking dry",
  recordedAt: "2025-01-01T10:00:00Z",
};
const mockRecommendation = {
  id: "rec-1",
  fieldName: "North Field",
  recommendationText: "Apply fertiliser",
  createdAt: { seconds: 1735725600 },
};

function setupMocks({
  fields = [mockField],
  uid = "user-1",
  observations = [mockObservation],
  history = [mockRecommendation],
} = {}) {
  useFarmContext.mockReturnValue({ fields });
  useAuthContext.mockReturnValue({ user: { uid } });
  getObs.mockResolvedValue(observations);
  getRecommendations.mockResolvedValue(history);
  addRecommendation.mockResolvedValue();
}

// ─── loadRecommendationData ───────────────────────────────────────────────────

describe("loadRecommendationData", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders observations after loading", async () => {
    setupMocks();
        await render(<RecommendationsScreen />);
        expect(await screen.findAllByText("North Field")).toBeTruthy();

    });

  it("renders empty state when there are no observations", async () => {
    setupMocks({ observations: [] });
    await render(<RecommendationsScreen />);
    expect(await screen.findByText(/no observations found/i)).toBeTruthy();
  });

  it("renders empty history state when there are no recommendations", async () => {
    setupMocks({ history: [] });
    await render(<RecommendationsScreen />);
    expect(await screen.findByText(/no recommendations generated yet/i)).toBeTruthy();
  });

  it("renders history items after loading", async () => {
    setupMocks();
    await render(<RecommendationsScreen />);
    expect(await screen.findByText("Apply fertiliser")).toBeTruthy();
  });

  it("clears state when there are no fields", async () => {
    setupMocks({ fields: [] });
    await render(<RecommendationsScreen />);
    expect(await screen.findByText(/no observations found/i)).toBeTruthy();
  });
});

// ─── handleGenerateRecommendation ────────────────────────────────────────────

describe("handleGenerateRecommendation", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows offline alert when device is offline", async () => {
    setupMocks();
    isOnline.mockResolvedValue(false);
    // easier to just spy on Alert.alert directly
    const Alert = require("react-native").Alert;
    jest.spyOn(Alert, "alert");

    await render(<RecommendationsScreen />);
    const button = await screen.findByText("Generate recommendation");
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Feature unavailable offline",
        expect.stringContaining("not available when offline")
      );
    });
  });

  it("shows alert when there are no fields", async () => {
    setupMocks({ fields: [] });
    isOnline.mockResolvedValue(true);
    const Alert = require("react-native").Alert;
    jest.spyOn(Alert, "alert");

    await render(<RecommendationsScreen />);
    const button = await screen.findByText("Generate recommendation");
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Missing field", expect.any(String));
    });
  });

  it("shows alert when there are no observations", async () => {
    setupMocks({ observations: [] });
    isOnline.mockResolvedValue(true);
    const Alert = require("react-native").Alert;
    jest.spyOn(Alert, "alert");

    await render(<RecommendationsScreen />);
    const button = await screen.findByText("Generate recommendation");
    fireEvent.press(button);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Missing observation", expect.any(String));
    });
  });

  it("calls generateRecommendation with the correct field and observation data", async () => {
    setupMocks();
    isOnline.mockResolvedValue(true);
    generateRecommendation.mockResolvedValue("Apply fertiliser now");

    await render(<RecommendationsScreen />);
    const button = await screen.findByText("Generate recommendation");
    fireEvent.press(button);

    await waitFor(() => {
      expect(generateRecommendation).toHaveBeenCalledWith(
        expect.objectContaining({
          fieldName: "North Field",
          cropType: "Wheat",
          growthStage: "Tillering",
          pestSightings: "Aphids",
        })
      );
    });
  });

  it("saves the recommendation to firestore after generation", async () => {
    setupMocks();
    isOnline.mockResolvedValue(true);
    generateRecommendation.mockResolvedValue("Apply fertiliser now");

    await render(<RecommendationsScreen />);
    fireEvent.press(await screen.findByText("Generate recommendation"));

    await waitFor(() => {
      expect(addRecommendation).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          fieldId: "field-1",
          recommendationText: "Apply fertiliser now",
        })
      );
    });
  });

  it("displays the generated recommendation text", async () => {
    setupMocks();
    isOnline.mockResolvedValue(true);
    generateRecommendation.mockResolvedValue("Apply fertiliser now");

    await render(<RecommendationsScreen />);
    fireEvent.press(await screen.findByText("Generate recommendation"));

    expect(await screen.findByText("Apply fertiliser now")).toBeTruthy();
  });

  it("shows an alert when generateRecommendation throws", async () => {
    setupMocks();
    isOnline.mockResolvedValue(true);
    generateRecommendation.mockRejectedValue(new Error("AI service down"));
    const Alert = require("react-native").Alert;
    jest.spyOn(Alert, "alert");

    await render(<RecommendationsScreen />);
    fireEvent.press(await screen.findByText("Generate recommendation"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Could not generate recommendation",
        "AI service down"
      );
    });
  });
});

// ─── getItemTime / formatDate (via rendered output) ──────────────────────────

describe("date formatting", () => {
  beforeEach(() => jest.clearAllMocks());

  it("formats a Firestore timestamp (seconds)", async () => {
    const obs = { ...mockObservation, createdAt: { seconds: 1735725600 }, recordedAt: undefined };
    setupMocks({ observations: [obs], history: [] });

    await render(<RecommendationsScreen />);
    // just verify it renders a recognisable date string, not "Unknown date"
    const dateElements = await screen.findAllByText(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("formats a recordedAt ISO string", async () => {
    const obs = { ...mockObservation, createdAt: undefined, recordedAt: "2025-06-01T08:00:00Z" };
    setupMocks({ observations: [obs], history: [] });

    await render(<RecommendationsScreen />);
    const dateElements = await screen.findAllByText(/jun/i);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("shows Unknown date when no time data is present", async () => {
    const obs = { ...mockObservation, createdAt: undefined, recordedAt: undefined };
    setupMocks({ observations: [obs], history: [] });

    await render(<RecommendationsScreen />);
    expect(await screen.findByText("Unknown date")).toBeTruthy();
  });
});