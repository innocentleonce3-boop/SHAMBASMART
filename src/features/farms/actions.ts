"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FarmFormState = { error?: string };

const farmSchema = z.object({
  name: z.string().trim().min(2, "Farm name must be at least 2 characters.").max(120),
  region: z.string().trim().min(2, "Select or enter a region.").max(100),
  district: z.string().trim().max(100),
  village: z.string().trim().max(100),
  areaHectares: z.coerce.number().positive("Farm area must be greater than zero.").max(1_000_000),
  latitude: z.preprocess((value) => value === "" || value === undefined ? null : Number(value), z.number().min(-90).max(90).nullable()),
  longitude: z.preprocess((value) => value === "" || value === undefined ? null : Number(value), z.number().min(-180).max(180).nullable()),
  soilType: z.string().trim().max(100),
  irrigationType: z.string().trim().max(100),
  description: z.string().trim().max(2000),
});

export async function createFarm(_state: FarmFormState, formData: FormData): Promise<FarmFormState> {
  const parsed = farmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the farm details and try again." };

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { error: "Your session has expired. Sign in again to continue." };

  const { error } = await supabase.from("farms").insert({
    owner_id: user.id,
    name: parsed.data.name,
    region: parsed.data.region,
    district: parsed.data.district || null,
    village: parsed.data.village || null,
    area_hectares: parsed.data.areaHectares,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    soil_type: parsed.data.soilType || null,
    irrigation_type: parsed.data.irrigationType || null,
    description: parsed.data.description || null,
  });
  if (error) return { error: "Farm could not be saved. Check your connection and access, then try again." };

  redirect("/farms");
}

export async function updateFarm(_state: FarmFormState, formData: FormData): Promise<FarmFormState> {
  const parsed = farmSchema.extend({ farmId: z.uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the farm details and try again." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { farmId, ...farm } = parsed.data;
  const [{ data: fields }, { data: seasons }] = await Promise.all([
    supabase.from("fields").select("area_hectares").eq("farm_id", farmId),
    supabase.from("crop_seasons").select("cultivated_area_hectares").eq("farm_id", farmId).neq("status", "cancelled"),
  ]);
  const largestAllocation = Math.max(0, ...(fields ?? []).map((field) => field.area_hectares), ...(seasons ?? []).map((season) => season.cultivated_area_hectares));
  if (farm.areaHectares < largestAllocation) return { error: "Farm area cannot be smaller than an existing field or crop-season area." };
  const { error } = await supabase.from("farms").update({
    name: farm.name, region: farm.region, district: farm.district || null,
    village: farm.village || null, area_hectares: farm.areaHectares,
    latitude: farm.latitude,
    longitude: farm.longitude,
    soil_type: farm.soilType || null, irrigation_type: farm.irrigationType || null,
    description: farm.description || null, updated_at: new Date().toISOString(),
  }).eq("id", farmId);
  if (error) return { error: "Farm could not be updated. Check your access and try again." };
  redirect(`/farms/${farmId}`);
}

export async function deleteFarm(_state: FarmFormState, formData: FormData): Promise<FarmFormState> {
  const parsed = z.object({ farmId: z.uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Farm could not be identified." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { error } = await supabase.from("farms").delete().eq("id", parsed.data.farmId).eq("owner_id", user.id);
  if (error) return { error: "Farm could not be deleted. It may be shared or you may not own it." };
  redirect("/farms");
}