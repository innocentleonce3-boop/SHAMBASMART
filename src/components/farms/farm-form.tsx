"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createFarm, type FarmFormState } from "@/features/farms/actions";

const initialState: FarmFormState = {};

export function FarmForm() {
  const [state, formAction, pending] = useActionState(createFarm, initialState);
  return <form action={formAction} className="mt-7 space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Farm name" name="name" required placeholder="e.g. Mlimani Farm" />
      <Field label="Region" name="region" required placeholder="e.g. Morogoro" />
      <Field label="District" name="district" placeholder="District" />
      <Field label="Village" name="village" placeholder="Village" />
      <Field label="Farm area (hectares)" name="areaHectares" type="number" required min="0.001" step="0.001" placeholder="e.g. 2.5" />
      <Field label="Latitude" name="latitude" type="number" min="-90" max="90" step="0.000001" placeholder="Optional coordinates" />
      <Field label="Longitude" name="longitude" type="number" min="-180" max="180" step="0.000001" placeholder="Optional coordinates" />
      <Field label="Soil type" name="soilType" placeholder="Optional" />
      <Field label="Irrigation type" name="irrigationType" placeholder="e.g. Rain-fed" />
    </div>
    <label className="block text-sm font-medium text-[#344238]">Description <textarea name="description" rows={3} maxLength={2000} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm outline-none focus:border-[#5d8a4a] focus:ring-2 focus:ring-[#dcebd2]" /></label>
    {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
    <div className="flex flex-wrap gap-3 pt-1"><button disabled={pending} className="min-h-11 rounded-lg bg-[#245c3c] px-5 text-sm font-semibold text-white hover:bg-[#19492e] disabled:opacity-60">{pending ? "Saving..." : "Create farm"}</button><Link href="/farms" className="inline-flex min-h-11 items-center rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">Cancel</Link></div>
  </form>;
}

function Field({ label, name, type = "text", required = false, min, max, step, placeholder }: { label: string; name: string; type?: string; required?: boolean; min?: string; max?: string; step?: string; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} type={type} required={required} min={min} max={max} step={step} placeholder={placeholder} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm outline-none focus:border-[#5d8a4a] focus:ring-2 focus:ring-[#dcebd2]" /></label>;
}