import { generateRecommendation } from "../../services/ai/recommendationService";

let mockApiKey = "test-key";

jest.mock("../../utils/config", () => ({
  get API_CONFIG() {
    return { geminiApiKey: mockApiKey, geminiModel: "gemini-pro" };
  }
}));
jest.mock("../../utils/helpers", () => ({
  formatUnknown: (val) => val ?? "Unknown"
}));

global.fetch = jest.fn();



describe('generateRecommendation tests', () =>{
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    it("throws if gemini API key is missing", async () => {
        mockApiKey = null;
        await expect(generateRecommendation({})).rejects.toThrow("Gemini API key is missing.");
        mockApiKey = "test-key";
    });
    
    it("returns recommendation text on success", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
            candidates: [{ content: { parts: [{ text: "Apply fungicide." }] } }]
            })
        });

        const result = await generateRecommendation({
            fieldName: "Field A",
            cropType: "Wheat",
            growthStage: "Tillering",
            notes: "Some yellowing",
            pestSightings: "None",
            diseaseSightings: "Rust suspected",
            weatherData: { temperature: 12, humidity: 80, rainfall: 5, windSpeed: 20 },
            soilData: { soilType: "Clay", soilTemperature: 8, soilMoisture: "High" }
        });

        expect(result).toBe("Apply fungicide.");
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("gemini-pro"),
            expect.objectContaining({ method: "POST" })
        );
    });

    it("throws error from API response body when response is not ok", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: { message: "Quota exceeded." } })
        });

        await expect(generateRecommendation({ fieldName: "Field B" }))
            .rejects.toThrow("Quota exceeded.");
    });

    it("throws fallback message when API error has no message", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({})
        });

        await expect(generateRecommendation({}))
            .rejects.toThrow("Could not generate recommendation.");
    });

    it("returns fallback string when candidates are empty", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ candidates: [] })
        });

        const result = await generateRecommendation({});
        expect(result).toBe("No recommendation was generated.");
    });

    it("handles missing weatherData and soilData without throwing", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
            candidates: [{ content: { parts: [{ text: "Check soil." }] } }]
            })
        });

        const result = await generateRecommendation({});
        expect(result).toBe("Check soil.");
    });

})