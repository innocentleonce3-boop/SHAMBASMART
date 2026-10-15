"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createActivity, type ActivityFormState } from "@/features/activities/actions";
import type { Database } from "@/lib/supabase/database.types";

type Season = Database["public"]["Tables"]["crop_seasons"]["Row"];
const initialState: ActivityFormState = {};
const activityTypes = ["planting", "irrigation", "fertilization", "weeding", "pest_management", "disease_treatment", "labor", "equipment", "harvesting", "other"];

export function ActivityForm({ farmId, seasons }: { farmId: string; seasons: Season[] }) {
  const [state, formAction, pending] = useActionState(createActivity, initialState);
  return <form action={formAction} className="mt-7 space-y-5"><input type="hidden" name="farmId" value={farmId} />
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-[#344238]">Activity type<select name="activityType" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm">{activityTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
      <label className="block text-sm font-medium text-[#344238]">Crop season<select name="cropSeasonId" defaultValue="" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="">Farm-wide</option>{seasons.map((season) => <option key={season.id} value={season.id}>{season.season_name}</option>)}</select></label>
      <Field label="Task name" name="title" required placeholder="e.g. Apply compost" />
      <Field label="Activity date" name="activityDate" type="date" required />
      <label className="block text-sm font-medium text-[#344238]">Status<select name="status" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></label>
      <Field label="Recorded cost (TZS)" name="costTzs" type="number" min="0" step="0.01" placeholder="Optional" />
    </div>
    <label className="block text-sm font-medium text-[#344238]">Notes<textarea name="description" rows={3} maxLength={2000} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>
    {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
    <div className="flex gap-3"><button disabled={pending} className="min-h-11 rounded-lg bg-[#245c3c] px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : "Save activity"}</button><Link href={`/farms/${farmId}/activities`} className="inline-flex min-h-11 items-center rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">Cancel</Link></div>
  </form>;
}

function Field({ label, name, type = "text", required = false, min, step, placeholder }: { label: string; name: string; type?: string; required?: boolean; min?: string; step?: string; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} type={type} required={required} min={min} step={step} placeholder={placeholder} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>;
}