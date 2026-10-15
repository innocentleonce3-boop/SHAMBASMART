export type RiskLevel = "low" | "moderate" | "high" | "unknown";

export type CropRiskInput = {
  plantCondition: "healthy" | "watch" | "poor" | "unknown";
  symptoms: string;
  pestObservations: string;
};

export type CropRiskResult = {
  riskLevel: RiskLevel;
  indicators: string[];
  rulesetVersion: "v1";
  disclaimer: string;
};

export function assessCropRisk(input: CropRiskInput): CropRiskResult {
  const indicators: string[] = [];
  if (input.plantCondition === "poor") indicators.push("Plant condition recorded as poor");
  if (input.plantCondition === "watch") indicators.push("Plant condition needs monitoring");
  if (input.symptoms.trim()) indicators.push("Symptoms were reported");
  if (input.pestObservations.trim()) indicators.push("Pest activity was reported");

  const riskLevel: RiskLevel = indicators.length === 0
    ? input.plantCondition === "healthy" ? "low" : "unknown"
    : indicators.length >= 3 ? "high" : indicators.length === 2 ? "moderate" : "low";

  return {
    riskLevel,
    indicators,
    rulesetVersion: "v1",
    disclaimer: "This is a rule-based monitoring prompt, not a diagnosis. Confirm concerns with a qualified agricultural extension officer.",
  };
}