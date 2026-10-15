"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createCropSeason, type SeasonFormState } from "@/features/crops/actions";
import type { Database } from "@/lib/supabase/database.types";

type Crop = Database["public"]["Tables"]["crops"]["Row"];
type Field = Database["public"]["Tables"]["fields"]["Row"];

const initialState: SeasonFormState = {};

export function SeasonForm({ farmId, crops, fields, maxArea }: { farmId: string; crops: Crop[]; fields: Field[]; maxArea: number }) {
  const [state, formAction, pending] = useActionState(createCropSeason, initialState);
  return <form action={formAction} className="mt-7 space-y-5">
    <input type="hidden" name="farmId" value={farmId} />
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-[#344238]">Crop<select required name="cropId" defaultValue="" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="" disabled>Select a crop</option>{crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name_en} / {crop.name_sw}</option>)}</select></label>
      <label className="block text-sm font-medium text-[#344238]">Field<select name="fieldId" defaultValue="" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="">Whole farm / not assigned</option>{fields.map((field) => <option key={field.id} value={field.id}>{field.name}</option>)}</select></label>
      <Field label="Season name" name="seasonName" required placeholder="e.g. Masika 2026" />
      <Field label="Planting date" name="plantingDate" type="date" required />
      <Field label="Cultivated area (hectares)" name="cultivatedArea" type="number" required min="0.001" max={String(maxArea)} step="0.001" />
      <label className="block text-sm font-medium text-[#344238]">Season status<select name="status" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="planned">Planned</option><option value="active">Active</option></select></label>
    </div>
    {crops.length === 0 && <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">Crop reference data is empty. Apply the development seed to add crops.</p>}
    <label className="block text-sm font-medium text-[#344238]">Notes<textarea name="notes" rows={3} maxLength={2000} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>
    {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
    <div className="flex flex-wrap gap-3"><button disabled={pending || crops.length === 0} className="min-h-11 rounded-lg bg-[#245c3c] px-5 text-sm font-semibold text-white hover:bg-[#19492e] disabled:opacity-60">{pending ? "Saving..." : "Add crop season"}</button><Link href={`/farms/${farmId}/seasons`} className="inline-flex min-h-11 items-center rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">Cancel</Link></div>
  </form>;
}

function Field({ label, name, type = "text", required = false, min, max, step, placeholder }: { label: string; name: string; type?: string; required?: boolean; min?: string; max?: string; step?: string; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} type={type} required={required} min={min} max={max} step={step} placeholder={placeholder} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>;
}