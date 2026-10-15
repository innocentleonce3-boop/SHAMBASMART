import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FieldsPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: fields, error }] = await Promise.all([
    supabase.from("farms").select("id, name, area_hectares").eq("id", farmId).maybeSingle(),
    supabase.from("fields").select("*").eq("farm_id", farmId).order("name"),
  ]);
  if (!farm) notFound();
  const allocatedArea = (fields ?? []).reduce((sum, field) => sum + field.area_hectares, 0);
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}`} className="text-sm font-semibold text-[#46554a]">← {farm.name}</Link><Link href={`/farms/${farmId}/seasons`} className="text-sm text-[#536257]">Crop seasons</Link></header><section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[#557d45]">Farm layout</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Fields</h1><p className="mt-2 text-sm text-[#657168]">{allocatedArea} of {farm.area_hectares} hectares allocated.</p></div><Link href={`/farms/${farmId}/fields/new`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white"><Plus size={16} /> Add field</Link></div>{error ? <p role="alert" className="mt-8 bg-white p-5 text-sm text-red-800">Fields could not be loaded.</p> : !fields?.length ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><h2 className="text-base font-semibold">No fields recorded</h2><p className="mt-2 text-sm text-[#657168]">Add fields to assign crop seasons and track cultivated area.</p></div> : <ul className="mt-8 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{fields.map((field) => <li key={field.id} className="flex justify-between gap-3 px-5 py-4"><span><span className="block text-sm font-semibold">{field.name}</span>{field.soil_type && <span className="mt-1 block text-xs text-[#7d887e]">{field.soil_type}</span>}</span><span className="text-sm font-medium">{field.area_hectares} ha</span></li>)}</ul>}</section></main>;
}