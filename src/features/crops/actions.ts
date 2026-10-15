"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { estimateHarvestDate } from "@/lib/calculations/harvest-date";

export type SeasonFormState = { error?: string };

const seasonSchema = z.object({
  farmId: z.uuid(),
  cropId: z.uuid("Choose a crop.") ,
  fieldId: z.union([z.uuid(), z.literal("")]),
  seasonName: z.string().trim().min(2).max(100),
  plantingDate: z.iso.date(),
  cultivatedArea: z.coerce.number().positive().max(1_000_000),
  status: z.enum(["planned", "active"]),
  notes: z.string().trim().max(2000),
});

export async function createCropSeason(_state: SeasonFormState, formData: FormData): Promise<SeasonFormState> {
  const parsed = seasonSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the crop-season details." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };

  const [{ data: farm }, { data: crop }, { data: field }] = await Promise.all([
    supabase.from("farms").select("area_hectares").eq("id", parsed.data.farmId).maybeSingle(),
    supabase.from("crops").select("typical_duration_days").eq("id", parsed.data.cropId).maybeSingle(),
    parsed.data.fieldId ? supabase.from("fields").select("area_hectares").eq("id", parsed.data.fieldId).eq("farm_id", parsed.data.farmId).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  if (!farm || !crop) return { error: "The farm or crop could not be found for your account." };
  if (parsed.data.fieldId && !field) return { error: "The selected field could not be found in this farm." };
  if (parsed.data.cultivatedArea > farm.area_hectares) return { error: "Cultivated area cannot exceed the farm area." };
  if (field && parsed.data.cultivatedArea > field.area_hectares) return { error: "Cultivated area cannot exceed the selected field area." };

  const expectedDate = crop.typical_duration_days
    ? estimateHarvestDate(parsed.data.plantingDate, crop.typical_duration_days)
    : null;
  const { error } = await supabase.from("crop_seasons").insert({
    farm_id: parsed.data.farmId,
    crop_id: parsed.data.cropId,
    field_id: parsed.data.fieldId || null,
    season_name: parsed.data.seasonName,
    planting_date: parsed.data.plantingDate,
    expected_harvest_date: expectedDate,
    cultivated_area_hectares: parsed.data.cultivatedArea,
    status: parsed.data.status,
    notes: parsed.data.notes || null,
  });
  if (error) return { error: "Crop season could not be saved. Check your access and try again." };

  redirect(`/farms/${parsed.data.farmId}/seasons`);
}