import { describe, expect, it } from "vitest";
import { estimateHarvestDate } from "@/lib/calculations/harvest-date";
import { assessCropRisk } from "@/lib/calculations/crop-risk";

describe("estimateHarvestDate", () => {
  it("adds crop reference duration using calendar days", () => {
    expect(estimateHarvestDate("2026-01-15", 120)).toBe("2026-05-15");
  });

  it("handles year boundaries", () => {
    expect(estimateHarvestDate("2026-12-20", 20)).toBe("2027-01-09");
  });
});

describe("assessCropRisk", () => {
  it("does not label an unobserved crop as low risk", () => {
    expect(assessCropRisk({ plantCondition: "unknown", symptoms: "", pestObservations: "" }).riskLevel).toBe("unknown");
  });

  it("returns a low indicator level for a reported symptom without claiming diagnosis", () => {
    const result = assessCropRisk({ plantCondition: "healthy", symptoms: "yellow leaf edges", pestObservations: "" });
    expect(result.riskLevel).toBe("low");
    expect(result.disclaimer).toContain("not a diagnosis");
    expect(result.indicators).toContain("Symptoms were reported");
  });

  it("raises the monitoring level when multiple concerns are reported", () => {
    expect(assessCropRisk({ plantCondition: "poor", symptoms: "wilting", pestObservations: "aphids" }).riskLevel).toBe("high");
  });
});