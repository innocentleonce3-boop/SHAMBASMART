"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createField, type FieldFormState } from "@/features/fields/actions";

const initialState: FieldFormState = {};

export function FieldForm({ farmId }: { farmId: string }) {
  const [state, action, pending] = useActionState(createField, initialState);
  return <form action={action} className="mt-7 space-y-5"><input type="hidden" name="farmId" value={farmId} /><div className="grid gap-4 sm:grid-cols-2"><Field label="Field name" name="name" required /><Field label="Area (hectares)" name="areaHectares" type="number" min="0.001" step="0.001" required /><Field label="Soil type" name="soilType" /></div><label className="block text-sm font-medium text-[#344238]">Notes<textarea name="notes" rows={3} maxLength={2000} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>{state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}<div className="flex gap-3"><button disabled={pending} className="min-h-11 rounded-lg bg-[#245c3c] px-5 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : "Add field"}</button><Link href={`/farms/${farmId}/fields`} className="inline-flex min-h-11 items-center rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">Cancel</Link></div></form>;
}

function Field({ label, name, type = "text", min, step, required = false }: { label: string; name: string; type?: string; min?: string; step?: string; required?: boolean }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} type={type} min={min} step={step} required={required} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>;
}