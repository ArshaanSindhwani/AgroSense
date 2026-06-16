import {
  addFarm, getFarmsByUser,
  addField, deleteField, getFieldsByFarmIds, getField, updateField,
  addObs, deleteObs, getObs, updateObs,
  addRecommendation, getFieldRecommendations,
} from "../../services/firebase/firestore";

// ─── Mock setup ──────────────────────────────────────────────────────────────

const mockAdd    = jest.fn();
const mockGet    = jest.fn();
const mockDelete = jest.fn();
const mockUpdate = jest.fn();
const mockWhere  = jest.fn();
const mockOrderBy = jest.fn();
const mockDoc    = jest.fn();

// Each chainable method returns the same object so calls can be chained freely
const chain = {
  add:     mockAdd,
  get:     mockGet,
  delete:  mockDelete,
  update:  mockUpdate,
  where:   mockWhere,
  orderBy: mockOrderBy,
  doc:     mockDoc,
};

Object.values(chain).forEach((fn) => fn.mockReturnValue(chain));

const mockCollection = jest.fn(() => chain);

jest.mock("@react-native-firebase/firestore", () => {
  const firestoreFn = () => ({ collection: mockCollection });
  firestoreFn.FieldValue = { serverTimestamp: jest.fn(() => "TIMESTAMP") };
  return firestoreFn;
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeDoc = (id, data) => ({ id, data: () => data });

const makeSnap = (docs) => ({ docs });

beforeEach(() => jest.clearAllMocks());

// ─── addFarm ─────────────────────────────────────────────────────────────────

describe("addFarm", () => {
  it("adds to farms collection with userId and timestamp, returns id", async () => {
    mockAdd.mockResolvedValueOnce({ id: "farm-1" });

    const id = await addFarm("user-1", { name: "Green Acres" });

    expect(mockCollection).toHaveBeenCalledWith("farms");
    expect(mockAdd).toHaveBeenCalledWith({
      name: "Green Acres",
      userId: "user-1",
      createdAt: "TIMESTAMP",
    });
    expect(id).toBe("farm-1");
  });
});

// ─── getFarmsByUser ───────────────────────────────────────────────────────────

describe("getFarmsByUser", () => {
  it("queries farms by userId and returns mapped docs", async () => {
    mockGet.mockResolvedValueOnce(
      makeSnap([makeDoc("farm-1", { name: "Green Acres" })])
    );

    const result = await getFarmsByUser("user-1");

    expect(mockWhere).toHaveBeenCalledWith("userId", "==", "user-1");
    expect(result).toEqual([{ id: "farm-1", name: "Green Acres" }]);
  });

  it("returns empty array when user has no farms", async () => {
    mockGet.mockResolvedValueOnce(makeSnap([]));

    const result = await getFarmsByUser("user-1");

    expect(result).toEqual([]);
  });
});

// ─── addField ────────────────────────────────────────────────────────────────

describe("addField", () => {
  it("adds to fields collection with timestamp, returns id", async () => {
    mockAdd.mockResolvedValueOnce({ id: "field-1" });

    const id = await addField({ farmId: "farm-1", name: "North Field" });

    expect(mockCollection).toHaveBeenCalledWith("fields");
    expect(mockAdd).toHaveBeenCalledWith({
      farmId: "farm-1",
      name: "North Field",
      createdAt: "TIMESTAMP",
    });
    expect(id).toBe("field-1");
  });
});

// ─── deleteField ─────────────────────────────────────────────────────────────

describe("deleteField", () => {
  it("deletes the correct field document", async () => {
    mockDelete.mockResolvedValueOnce();

    await deleteField("field-1");

    expect(mockCollection).toHaveBeenCalledWith("fields");
    expect(mockDoc).toHaveBeenCalledWith("field-1");
    expect(mockDelete).toHaveBeenCalled();
  });
});

// ─── getFieldsByFarmIds ───────────────────────────────────────────────────────

describe("getFieldsByFarmIds", () => {
  it("returns empty array immediately if farmIds is empty", async () => {
    const result = await getFieldsByFarmIds([]);

    expect(mockGet).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("queries fields by farmIds and returns mapped docs", async () => {
    mockGet.mockResolvedValueOnce(
      makeSnap([makeDoc("field-1", { farmId: "farm-1", name: "North Field" })])
    );

    const result = await getFieldsByFarmIds(["farm-1"]);

    expect(mockWhere).toHaveBeenCalledWith("farmId", "in", ["farm-1"]);
    expect(result).toEqual([{ id: "field-1", farmId: "farm-1", name: "North Field" }]);
  });
});

// ─── getField ────────────────────────────────────────────────────────────────

describe("getField", () => {
  it("fetches and returns a single field by id", async () => {
    mockGet.mockResolvedValueOnce(makeDoc("field-1", { name: "North Field" }));

    const result = await getField("field-1");

    expect(mockDoc).toHaveBeenCalledWith("field-1");
    expect(result).toEqual({ id: "field-1", name: "North Field" });
  });
});

// ─── updateField ─────────────────────────────────────────────────────────────

describe("updateField", () => {
  it("updates the correct field document with given updates", async () => {
    mockUpdate.mockResolvedValueOnce();

    await updateField("field-1", { name: "South Field" });

    expect(mockDoc).toHaveBeenCalledWith("field-1");
    expect(mockUpdate).toHaveBeenCalledWith({ name: "South Field" });
  });
});

// ─── addObs ──────────────────────────────────────────────────────────────────

describe("addObs", () => {
  it("adds to observations collection with timestamp", async () => {
    mockAdd.mockResolvedValueOnce({ id: "obs-1" });

    await addObs({ fieldId: "field-1", note: "Rust spotted" });

    expect(mockCollection).toHaveBeenCalledWith("observations");
    expect(mockAdd).toHaveBeenCalledWith({
      fieldId: "field-1",
      note: "Rust spotted",
      createdAt: "TIMESTAMP",
    });
  });
});

// ─── deleteObs ───────────────────────────────────────────────────────────────

describe("deleteObs", () => {
  it("deletes the correct observation document", async () => {
    mockDelete.mockResolvedValueOnce();

    await deleteObs("obs-1");

    expect(mockCollection).toHaveBeenCalledWith("observations");
    expect(mockDoc).toHaveBeenCalledWith("obs-1");
    expect(mockDelete).toHaveBeenCalled();
  });
});

// ─── getObs ──────────────────────────────────────────────────────────────────

describe("getObs", () => {
  it("queries observations by fieldId and returns mapped docs", async () => {
    mockGet.mockResolvedValueOnce(
      makeSnap([makeDoc("obs-1", { fieldId: "field-1", note: "Rust spotted" })])
    );

    const result = await getObs("field-1");

    expect(mockWhere).toHaveBeenCalledWith("fieldId", "==", "field-1");
    expect(result).toEqual([{ id: "obs-1", fieldId: "field-1", note: "Rust spotted" }]);
  });

  it("returns empty array when no observations exist for field", async () => {
    mockGet.mockResolvedValueOnce(makeSnap([]));

    const result = await getObs("field-1");

    expect(result).toEqual([]);
  });
});

// ─── updateObs ───────────────────────────────────────────────────────────────

describe("updateObs", () => {
  it("updates the correct observation document with given updates", async () => {
    mockUpdate.mockResolvedValueOnce();

    await updateObs("obs-1", { note: "Updated note" });

    expect(mockDoc).toHaveBeenCalledWith("obs-1");
    expect(mockUpdate).toHaveBeenCalledWith({ note: "Updated note" });
  });
});

// ─── addRecommendation ───────────────────────────────────────────────────────

describe("addRecommendation", () => {
  it("adds to recommendations collection with timestamp", async () => {
    mockAdd.mockResolvedValueOnce({ id: "rec-1" });

    await addRecommendation({ fieldId: "field-1", text: "Apply fungicide." });

    expect(mockCollection).toHaveBeenCalledWith("recommendations");
    expect(mockAdd).toHaveBeenCalledWith({
      fieldId: "field-1",
      text: "Apply fungicide.",
      createdAt: "TIMESTAMP",
    });
  });
});

// ─── getFieldRecommendations ─────────────────────────────────────────────────

describe("getFieldRecommendations", () => {
  it("queries recommendations by fieldId ordered by createdAt desc", async () => {
    mockGet.mockResolvedValueOnce(
      makeSnap([makeDoc("rec-1", { fieldId: "field-1", text: "Apply fungicide." })])
    );

    const result = await getFieldRecommendations("field-1");

    expect(mockWhere).toHaveBeenCalledWith("fieldId", "==", "field-1");
    expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(result).toEqual([{ id: "rec-1", fieldId: "field-1", text: "Apply fungicide." }]);
  });

  it("returns empty array when no recommendations exist for field", async () => {
    mockGet.mockResolvedValueOnce(makeSnap([]));

    const result = await getFieldRecommendations("field-1");

    expect(result).toEqual([]);
  });
});