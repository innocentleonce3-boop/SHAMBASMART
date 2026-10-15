"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createObservation, type ObservationFormState } from "@/features/observations/actions";
import type { Database } from "@/lib/supabase/database.types";

type Season = Database["public"]["Tables"]["crop_seasons"]["Row"];
const initialState: ObservationFormState = {};

export function ObservationForm({ farmId, seasons }: { farmId: string; seasons: Season[] }) {
  const [state, formAction, pending] = useActionState(createObservation, initialState);
  return <form action={formAction} encType="multipart/form-data" className="mt-7 space-y-5"><input type="hidden" name="farmId" value={farmId} />
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-[#344238]">Crop season<select name="cropSeasonId" defaultValue="" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="">Farm-wide</option>{seasons.map((season) => <option key={season.id} value={season.id}>{season.season_name}</option>)}</select></label>
      <Field label="Observation date" name="observedAt" type="date" required />
      <Field label="Growth stage" name="growthStage" placeholder="e.g. Flowering" />
      <label className="block text-sm font-medium text-[#344238]">Plant condition<select name="plantCondition" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="healthy">Healthy</option><option value="watch">Needs monitoring</option><option value="poor">Poor</option><option value="unknown">Unknown</option></select></label>
      <label className="block text-sm font-medium text-[#344238] sm:col-span-2">Reported symptoms<textarea name="symptoms" rows={3} maxLength={2000} placeholder="Describe what you observed, without assuming a diagnosis" className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>
      <label className="block text-sm font-medium text-[#344238] sm:col-span-2">Pest observations<textarea name="pestObservations" rows={2} maxLength={2000} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>
      <label className="block text-sm font-medium text-[#344238] sm:col-span-2">Photo <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="mt-1.5 block w-full text-sm text-[#657168] file:mr-3 file:min-h-10 file:rounded-md file:border-0 file:bg-[#edf4e8] file:px-3 file:text-sm file:font-semibold file:text-[#365b3b]" /><span className="mt-1 block text-xs font-normal text-[#7d887e]">Optional · JPEG, PNG, or WebP · up to 5 MB</span></label>
    </div>
    <label className="block text-sm font-medium text-[#344238]">Notes<textarea name="notes" rows={2} maxLength={2000} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>
    <p className="border-l-2 border-[#d9c38b] pl-3 text-xs leading-5 text-[#766844]">Risk indicators are a simple monitoring aid, not a disease diagnosis. Contact an agricultural extension officer for crop-health concerns.</p>
    {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
    <div className="flex gap-3"><button disabled={pending} className="min-h-11 rounded-lg bg-[#245c3c] px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : "Save observation"}</button><Link href={`/farms/${farmId}/observations`} className="inline-flex min-h-11 items-center rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">Cancel</Link></div>
  </form>;
}

function Field({ label, name, type = "text", required = false, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} type={type} required={required} placeholder={placeholder} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>;
}