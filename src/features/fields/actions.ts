"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FieldFormState = { error?: string };

const fieldSchema = z.object({
  farmId: z.uuid(),
  name: z.string().trim().min(1).max(100),
  areaHectares: z.coerce.number().positive().max(1_000_000),
  soilType: z.string().trim().max(100),
  notes: z.string().trim().max(2000),
});

export async function createField(_state: FieldFormState, formData: FormData): Promise<FieldFormState> {
  const parsed = fieldSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the field details." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { data: farm } = await supabase.from("farms").select("area_hectares").eq("id", parsed.data.farmId).maybeSingle();
  if (!farm) return { error: "Farm could not be found for your account." };
  const { data: fields } = await supabase.from("fields").select("area_hectares").eq("farm_id", parsed.data.farmId);
  const recordedArea = (fields ?? []).reduce((sum, field) => sum + field.area_hectares, 0);
  if (recordedArea + parsed.data.areaHectares > farm.area_hectares) return { error: "Field areas cannot add up to more than the farm area." };
  const { error } = await supabase.from("fields").insert({
    farm_id: parsed.data.farmId, name: parsed.data.name, area_hectares: parsed.data.areaHectares,
    soil_type: parsed.data.soilType || null, notes: parsed.data.notes || null,
  });
  if (error) return { error: "Field could not be saved. Check the field name and your access." };
  redirect(`/farms/${parsed.data.farmId}/fields`);
}