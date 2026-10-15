"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assessCropRisk } from "@/lib/calculations/crop-risk";

export type ObservationFormState = { error?: string };

const observationSchema = z.object({
  farmId: z.uuid(),
  cropSeasonId: z.union([z.uuid(), z.literal("")]),
  observedAt: z.iso.date(),
  growthStage: z.string().trim().max(100),
  plantCondition: z.enum(["healthy", "watch", "poor", "unknown"]),
  symptoms: z.string().trim().max(2000),
  pestObservations: z.string().trim().max(2000),
  notes: z.string().trim().max(2000),
});

const allowedImages = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);

export async function createObservation(_state: ObservationFormState, formData: FormData): Promise<ObservationFormState> {
  const parsed = observationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the observation details." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };

  const photo = formData.get("photo");
  let imagePath: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    const extension = allowedImages.get(photo.type);
    if (!extension || photo.size > 5 * 1024 * 1024) return { error: "Choose a JPEG, PNG, or WebP image under 5 MB." };
    imagePath = `${parsed.data.farmId}/${user.id}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("farm-media").upload(imagePath, photo, { contentType: photo.type, upsert: false });
    if (uploadError) return { error: "The photo could not be uploaded. Check the private storage setup and try again." };
  }

  const { data: observation, error } = await supabase.from("crop_observations").insert({
    farm_id: parsed.data.farmId,
    crop_season_id: parsed.data.cropSeasonId || null,
    observed_at: `${parsed.data.observedAt}T12:00:00.000Z`,
    growth_stage: parsed.data.growthStage || null,
    plant_condition: parsed.data.plantCondition,
    symptoms: parsed.data.symptoms || null,
    pest_observations: parsed.data.pestObservations || null,
    image_path: imagePath,
    notes: parsed.data.notes || null,
    created_by: user.id,
  }).select("id").single();
  if (error || !observation) {
    if (imagePath) await supabase.storage.from("farm-media").remove([imagePath]);
    return { error: "The observation could not be saved. Check your access and try again." };
  }

  const assessment = assessCropRisk(parsed.data);
  const { error: assessmentError } = await supabase.from("disease_risk_assessments").insert({
    observation_id: observation.id,
    risk_level: assessment.riskLevel,
    indicators: assessment.indicators,
    ruleset_version: assessment.rulesetVersion,
    disclaimer: assessment.disclaimer,
  });
  if (assessmentError) return { error: "Observation saved, but its risk indicators could not be recorded. Please contact support." };

  redirect(`/farms/${parsed.data.farmId}/observations`);
}