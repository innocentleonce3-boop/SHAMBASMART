"use client";

import { useActionState } from "react";
import { deleteFarm, updateFarm, type FarmFormState } from "@/features/farms/actions";
import type { Database } from "@/lib/supabase/database.types";

type Farm = Database["public"]["Tables"]["farms"]["Row"];
const initialState: FarmFormState = {};

export function FarmEditForm({ farm }: { farm: Farm }) {
  const [state, action, pending] = useActionState(updateFarm, initialState);
  return <form action={action} className="mt-7 space-y-5"><input type="hidden" name="farmId" value={farm.id} /><div className="grid gap-4 sm:grid-cols-2"><Field label="Farm name" name="name" defaultValue={farm.name} required /><Field label="Region" name="region" defaultValue={farm.region} required /><Field label="District" name="district" defaultValue={farm.district ?? ""} /><Field label="Village" name="village" defaultValue={farm.village ?? ""} /><Field label="Farm area (hectares)" name="areaHectares" type="number" defaultValue={String(farm.area_hectares)} min="0.001" step="0.001" required /><Field label="Latitude" name="latitude" type="number" defaultValue={farm.latitude === null ? "" : String(farm.latitude)} min="-90" max="90" step="0.000001" /><Field label="Longitude" name="longitude" type="number" defaultValue={farm.longitude === null ? "" : String(farm.longitude)} min="-180" max="180" step="0.000001" /><Field label="Soil type" name="soilType" defaultValue={farm.soil_type ?? ""} /><Field label="Irrigation type" name="irrigationType" defaultValue={farm.irrigation_type ?? ""} /></div><label className="block text-sm font-medium text-[#344238]">Description<textarea name="description" rows={3} maxLength={2000} defaultValue={farm.description ?? ""} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>{state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}<button disabled={pending} className="min-h-11 rounded-lg bg-[#245c3c] px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : "Save farm"}</button></form>;
}

export function DeleteFarmForm({ farmId }: { farmId: string }) {
  const [state, action, pending] = useActionState(deleteFarm, initialState);
  return <form action={action} onSubmit={(event) => { if (!window.confirm("Delete this farm and all of its recorded fields, seasons, activities, and harvests? This cannot be undone.")) event.preventDefault(); }} className="mt-8 border-t border-[#e4e9e1] pt-6"><input type="hidden" name="farmId" value={farmId} /><button disabled={pending} className="min-h-10 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-800 disabled:opacity-60">{pending ? "Deleting..." : "Delete farm"}</button>{state.error && <p role="alert" className="mt-3 text-sm text-red-800">{state.error}</p>}</form>;
}

function Field({ label, name, type = "text", defaultValue, min, max, step, required = false }: { label: string; name: string; type?: string; defaultValue: string; min?: string; max?: string; step?: string; required?: boolean }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} type={type} defaultValue={defaultValue} min={min} max={max} step={step} required={required} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>;
}