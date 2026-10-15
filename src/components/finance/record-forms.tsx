"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createExpense, createHarvest, createSale, type RecordFormState } from "@/features/finance/actions";
import type { Database } from "@/lib/supabase/database.types";

type Season = Database["public"]["Tables"]["crop_seasons"]["Row"];
type Harvest = Database["public"]["Tables"]["harvests"]["Row"];
const initialState: RecordFormState = {};
const UNIT_OPTIONS = [["kg", "Kilograms"], ["tonne", "Tonnes"], ["bag", "Bags"], ["crate", "Crates"], ["piece", "Pieces"]];

export function HarvestForm({ farmId, seasons }: { farmId: string; seasons: Season[] }) {
  const [state, action, pending] = useActionState(createHarvest, initialState);
  return <form action={action} className="space-y-4"><input type="hidden" name="farmId" value={farmId} /><Select label="Crop season" name="cropSeasonId" required options={seasons.map((season) => [season.id, season.season_name])} /><div className="grid gap-4 sm:grid-cols-2"><Field label="Harvest date" name="harvestedOn" type="date" required /><Field label="Quantity" name="quantity" type="number" min="0" step="0.001" required /><Field label="Damaged quantity" name="damagedQuantity" type="number" min="0" step="0.001" defaultValue="0" /><Select label="Unit" name="unit" required options={UNIT_OPTIONS} /><Field label="Quality grade" name="qualityGrade" placeholder="Optional" /></div>{state.error && <ErrorText text={state.error} />}<SubmitButton pending={pending} label="Save harvest" /><Link href={`/farms/${farmId}/harvests`} className="ml-3 text-sm font-medium text-[#657168]">Cancel</Link></form>;
}

export function SaleForm({ farmId, harvests }: { farmId: string; harvests: Harvest[] }) {
  const [state, action, pending] = useActionState(createSale, initialState);
  return <form action={action} className="space-y-4"><input type="hidden" name="farmId" value={farmId} /><Select label="Harvest record" name="harvestId" options={harvests.map((harvest) => [harvest.id, `${harvest.harvested_on} · ${harvest.quantity} ${harvest.unit}`])} /><div className="grid gap-4 sm:grid-cols-2"><Field label="Sale date" name="soldOn" type="date" required /><Field label="Quantity sold" name="quantity" type="number" min="0.001" step="0.001" required /><Select label="Unit" name="unit" required options={UNIT_OPTIONS} /><Field label="Unit price (TZS)" name="unitPriceTzs" type="number" min="0" step="0.01" required /><Field label="Buyer" name="buyer" /></div>{state.error && <ErrorText text={state.error} />}<SubmitButton pending={pending} label="Record sale" /></form>;
}

export function ExpenseForm({ farmId, seasons }: { farmId: string; seasons: Season[] }) {
  const [state, action, pending] = useActionState(createExpense, initialState);
  return <form action={action} className="space-y-4"><input type="hidden" name="farmId" value={farmId} /><div className="grid gap-4 sm:grid-cols-2"><Select label="Expense type" name="expenseType" required options={[["input", "Farm input"], ["labor", "Labor"], ["transport", "Transport"], ["equipment", "Equipment"], ["other", "Other"]]} /><Select label="Crop season" name="cropSeasonId" options={seasons.map((season) => [season.id, season.season_name])} /><Field label="Description" name="description" required /><Field label="Amount (TZS)" name="amountTzs" type="number" min="0" step="0.01" required /><Field label="Date" name="spentOn" type="date" required /></div>{state.error && <ErrorText text={state.error} />}<SubmitButton pending={pending} label="Record expense" /></form>;
}

function Field({ label, name, type = "text", required = false, min, step, defaultValue, placeholder }: { label: string; name: string; type?: string; required?: boolean; min?: string; step?: string; defaultValue?: string; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} type={type} required={required} min={min} step={step} defaultValue={defaultValue} placeholder={placeholder} className="mt-1.5 min-h-10 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>;
}

function Select({ label, name, options, required = false }: { label: string; name: string; options: string[][]; required?: boolean }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<select name={name} required={required} defaultValue="" className="mt-1.5 min-h-10 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="">{required ? "Choose one" : "None / not linked"}</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
}

function ErrorText({ text }: { text: string }) { return <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{text}</p>; }
function SubmitButton({ pending, label }: { pending: boolean; label: string }) { return <button disabled={pending} className="min-h-10 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : label}</button>; }