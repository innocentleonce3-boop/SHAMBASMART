"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActivityFormState = { error?: string };

const activityTypes = ["planting", "irrigation", "fertilization", "weeding", "pest_management", "disease_treatment", "labor", "equipment", "harvesting", "other"] as const;
const activitySchema = z.object({
  farmId: z.uuid(),
  cropSeasonId: z.union([z.uuid(), z.literal("")]),
  activityType: z.enum(activityTypes),
  title: z.string().trim().min(2).max(160),
  activityDate: z.iso.date(),
  status: z.enum(["planned", "in_progress", "completed"]),
  costTzs: z.preprocess((value) => value === "" || value === undefined ? null : Number(value), z.number().nonnegative().nullable()),
  description: z.string().trim().max(2000),
});

export async function createActivity(_state: ActivityFormState, formData: FormData): Promise<ActivityFormState> {
  const parsed = activitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the activity details." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { error } = await supabase.from("farm_activities").insert({
    farm_id: parsed.data.farmId,
    crop_season_id: parsed.data.cropSeasonId || null,
    activity_type: parsed.data.activityType,
    title: parsed.data.title,
    activity_date: parsed.data.activityDate,
    status: parsed.data.status,
    cost_tzs: parsed.data.costTzs,
    description: parsed.data.description || null,
    created_by: user.id,
  });
  if (error) return { error: "The activity could not be saved. Check your access and try again." };
  redirect(`/farms/${parsed.data.farmId}/activities`);
}

export async function completeActivity(formData: FormData): Promise<void> {
  const parsed = z.object({ activityId: z.uuid(), farmId: z.uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const supabase = await createClient();
  const { error } = await supabase.from("farm_activities").update({ status: "completed" }).eq("id", parsed.data.activityId).eq("farm_id", parsed.data.farmId);
  redirect(`/farms/${parsed.data.farmId}/activities?${error ? "update-error=1" : "updated=1"}`);
}