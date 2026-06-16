import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import { ObservationCard } from "../../components/cards/ObservationCard";
import { ObservationForm } from "../../components/forms/ObservationForm";
import { ThemeProvider } from "../../context/ThemeContext";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

const press = async (element) => {
  await act(async () => {
    fireEvent.press(element);
  });
};

const mockFields = [
  { id: "field-1", name: "North Field" },
  { id: "field-2", name: "South Field" },
];

const mockObservation = {
  growthStage: "Vegetative",
  pestSighting: "Aphids",
  soilCondition: "Good",
  notes: "Crop looking healthy",
};

// ─── ObservationCard ──────────────────────────────────────────────────────────

describe("ObservationCard", () => {
  it("renders the field name", async () => {
    const { getByText } = await render(
      <ObservationCard observation={mockObservation} fieldName="North Field" />
    );
    expect(getByText("North Field")).toBeTruthy();
  });

  it("renders the growth stage", async () => {
    const { getByText } = await render(
      <ObservationCard observation={mockObservation} fieldName="North Field" />
    );
    expect(getByText("Vegetative")).toBeTruthy();
  });

  it("renders pest sighting with Pest: prefix", async () => {
    const { getByText } = await render(
      <ObservationCard observation={mockObservation} fieldName="North Field" />
    );
    expect(getByText("Pest: Aphids")).toBeTruthy();
  });

  it("renders soil condition with Soil: prefix", async () => {
    const { getByText } = await render(
      <ObservationCard observation={mockObservation} fieldName="North Field" />
    );
    expect(getByText("Soil: Good")).toBeTruthy();
  });

  it("renders notes", async () => {
    const { getByText } = await render(
      <ObservationCard observation={mockObservation} fieldName="North Field" />
    );
    expect(getByText("Crop looking healthy")).toBeTruthy();
  });

  it("does not render pest sighting when empty", async () => {
    const { queryByText } = await render(
      <ObservationCard
        observation={{ ...mockObservation, pestSighting: "" }}
        fieldName="North Field"
      />
    );
    expect(queryByText(/Pest:/)).toBeNull();
  });

  it("does not render field name when not provided", async () => {
    const { queryByText } = await render(
      <ObservationCard observation={mockObservation} />
    );
    expect(queryByText("North Field")).toBeNull();
  });

  it("calls onDelete when the delete button is pressed", async () => {
    const onDelete = jest.fn();
    const { getByTestId } = await render(
      <ObservationCard
        observation={mockObservation}
        fieldName="North Field"
        onDelete={onDelete}
      />
    );
    await press(getByTestId("delete-button"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});

// ─── ObservationForm ──────────────────────────────────────────────────────────

describe("ObservationForm", () => {
  const onSubmit = jest.fn();

  beforeEach(() => onSubmit.mockClear());

  it("renders all field names as selectable chips", async () => {
    const { getByText } = await render(
      <ObservationForm fields={mockFields} onSubmit={onSubmit} loading={false} />,
      { wrapper: ThemeProvider }
    );
    expect(getByText("North Field")).toBeTruthy();
    expect(getByText("South Field")).toBeTruthy();
  });

  it("renders all growth stage options", async () => {
    const { getByText } = await render(
      <ObservationForm fields={mockFields} onSubmit={onSubmit} loading={false} />,
      { wrapper: ThemeProvider }
    );
    expect(getByText("Seedling")).toBeTruthy();
    expect(getByText("Vegetative")).toBeTruthy();
    expect(getByText("Flowering")).toBeTruthy();
    expect(getByText("Harvest")).toBeTruthy();
  });

  it("shows a field error when submitted without selecting a field", async () => {
    const { getByText } = await render(
      <ObservationForm fields={mockFields} onSubmit={onSubmit} loading={false} />,
      { wrapper: ThemeProvider }
    );
    await press(getByText("Save Observation"));
    expect(getByText("Please select a field.")).toBeTruthy();
  });

  it("shows a growth stage error when submitted without selecting a stage", async () => {
    const { getByText } = await render(
      <ObservationForm fields={mockFields} onSubmit={onSubmit} loading={false} />,
      { wrapper: ThemeProvider }
    );
    await press(getByText("North Field"));
    await press(getByText("Save Observation"));
    expect(getByText("Please select a growth stage.")).toBeTruthy();
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    const { getByText } = await render(
      <ObservationForm fields={mockFields} onSubmit={onSubmit} loading={false} />,
      { wrapper: ThemeProvider }
    );
    await press(getByText("North Field"));
    await press(getByText("Vegetative"));
    await press(getByText("Save Observation"));
    expect(onSubmit).toHaveBeenCalledWith({
      fieldId: "field-1",
      growthStage: "Vegetative",
      pestSighting: "",
      soilCondition: "",
      notes: "",
      source: "manual",
    });
  });

  it("pre-selects the field when only one field is available", async () => {
    const { getByText } = await render(
      <ObservationForm
        fields={[{ id: "field-1", name: "North Field" }]}
        onSubmit={onSubmit}
        loading={false}
      />,
      { wrapper: ThemeProvider }
    );
    await press(getByText("Seedling"));
    await press(getByText("Save Observation"));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ fieldId: "field-1" })
    );
  });

  it("hides the submit button and shows a spinner when loading", async () => {
    const { queryByText } = await render(
      <ObservationForm fields={mockFields} onSubmit={onSubmit} loading={true} />,
      { wrapper: ThemeProvider }
    );
    expect(queryByText("Save Observation")).toBeNull();
  });
});