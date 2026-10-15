"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type RecordFormState = { error?: string };

const harvestSchema = z.object({
  farmId: z.uuid(), cropSeasonId: z.uuid(), harvestedOn: z.iso.date(),
  quantity: z.coerce.number().positive(), damagedQuantity: z.coerce.number().nonnegative(),
  unit: z.string().trim().min(1).max(30), qualityGrade: z.string().trim().max(50), notes: z.string().trim().max(2000),
}).refine((values) => values.damagedQuantity <= values.quantity, { message: "Damaged quantity cannot exceed total harvest." });

const saleSchema = z.object({
  farmId: z.uuid(), harvestId: z.union([z.uuid(), z.literal("")]), soldOn: z.iso.date(),
  quantity: z.coerce.number().positive(), unit: z.string().trim().min(1).max(30),
  unitPriceTzs: z.coerce.number().nonnegative(), buyer: z.string().trim().max(160), notes: z.string().trim().max(2000),
});

const expenseSchema = z.object({
  farmId: z.uuid(), cropSeasonId: z.union([z.uuid(), z.literal("")]),
  expenseType: z.enum(["input", "labor", "transport", "equipment", "other"]),
  description: z.string().trim().min(2).max(160), amountTzs: z.coerce.number().nonnegative(),
  spentOn: z.iso.date(), notes: z.string().trim().max(2000),
});

async function currentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createHarvest(_state: RecordFormState, formData: FormData): Promise<RecordFormState> {
  const parsed = harvestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the harvest details." };
  const { supabase, user } = await currentUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { error } = await supabase.from("harvests").insert({
    farm_id: parsed.data.farmId, crop_season_id: parsed.data.cropSeasonId, harvested_on: parsed.data.harvestedOn,
    quantity: parsed.data.quantity, unit: parsed.data.unit, damaged_quantity: parsed.data.damagedQuantity,
    quality_grade: parsed.data.qualityGrade || null, notes: parsed.data.notes || null, created_by: user.id,
  });
  if (error) return { error: "Harvest could not be saved. Check your access and try again." };
  redirect(`/farms/${parsed.data.farmId}/harvests`);
}

export async function createSale(_state: RecordFormState, formData: FormData): Promise<RecordFormState> {
  const parsed = saleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the sale details." };
  const { supabase, user } = await currentUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { error } = await supabase.from("sales").insert({
    farm_id: parsed.data.farmId, harvest_id: parsed.data.harvestId || null, sold_on: parsed.data.soldOn,
    quantity: parsed.data.quantity, unit: parsed.data.unit, unit_price_tzs: parsed.data.unitPriceTzs,
    buyer: parsed.data.buyer || null, notes: parsed.data.notes || null,
  });
  if (error) return { error: "Sale could not be saved. Check your access and try again." };
  redirect(`/farms/${parsed.data.farmId}/finance`);
}

export async function createExpense(_state: RecordFormState, formData: FormData): Promise<RecordFormState> {
  const parsed = expenseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the expense details." };
  const { supabase, user } = await currentUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { error } = await supabase.from("expenses").insert({
    farm_id: parsed.data.farmId, crop_season_id: parsed.data.cropSeasonId || null,
    expense_type: parsed.data.expenseType, description: parsed.data.description,
    amount_tzs: parsed.data.amountTzs, spent_on: parsed.data.spentOn, notes: parsed.data.notes || null,
  });
  if (error) return { error: "Expense could not be saved. Check your access and try again." };
  redirect(`/farms/${parsed.data.farmId}/finance`);
}