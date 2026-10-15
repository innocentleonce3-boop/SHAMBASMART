export function estimateHarvestDate(plantingDate: string, durationDays: number): string {
  const date = new Date(`${plantingDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + durationDays);
  return date.toISOString().slice(0, 10);
}