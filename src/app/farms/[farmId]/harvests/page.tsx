import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HarvestsPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: harvests, error }, { data: seasons }] = await Promise.all([
    supabase.from("farms").select("id, name").eq("id", farmId).maybeSingle(),
    supabase.from("harvests").select("*").eq("farm_id", farmId).order("harvested_on", { ascending: false }),
    supabase.from("crop_seasons").select("id, season_name, cultivated_area_hectares").eq("farm_id", farmId),
  ]);
  if (!farm) notFound();
  const seasonById = new Map((seasons ?? []).map((season) => [season.id, season]));
  const totalByUnit = new Map<string, number>();
  for (const harvest of harvests ?? []) totalByUnit.set(harvest.unit, (totalByUnit.get(harvest.unit) ?? 0) + harvest.quantity);

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}`} className="text-sm font-semibold text-[#46554a]">← {farm.name}</Link><Link href={`/farms/${farmId}/finance`} className="text-sm text-[#536257]">Finance</Link></header><section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[#557d45]">Production records</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Harvests</h1></div><Link href={`/farms/${farmId}/harvests/new`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white"><Plus size={16} /> Record harvest</Link></div>
    {error ? <p role="alert" className="mt-8 bg-white p-5 text-sm text-red-800">Harvests could not be loaded. Check your connection and try again.</p> : <><div className="mt-6 flex flex-wrap gap-3">{[...totalByUnit].map(([unit, total]) => <div key={unit} className="min-w-36 border-t border-[#cfd9cc] pt-3"><p className="text-xs text-[#657168]">Recorded total · {unit}</p><p className="mt-1 text-xl font-semibold">{total.toLocaleString()}</p></div>)}</div>{!harvests?.length ? <div className="mt-6 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><h2 className="text-base font-semibold">No harvest records yet</h2><p className="mt-2 text-sm text-[#657168]">Record harvested quantities to follow production by season.</p></div> : <ul className="mt-6 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{harvests.map((harvest) => { const season = seasonById.get(harvest.crop_season_id); const yieldPerHa = season && season.cultivated_area_hectares > 0 ? harvest.quantity / season.cultivated_area_hectares : null; return <li key={harvest.id} className="flex flex-wrap justify-between gap-3 px-5 py-4"><div><p className="text-sm font-semibold">{harvest.quantity} {harvest.unit} · {season?.season_name ?? "Crop season"}</p><p className="mt-1 text-xs text-[#657168]">{harvest.harvested_on} · Damaged: {harvest.damaged_quantity} {harvest.unit}</p></div>{yieldPerHa !== null && <p className="text-right text-xs text-[#657168]">Recorded yield<br /><span className="mt-1 inline-block font-semibold">{yieldPerHa.toFixed(2)} {harvest.unit}/ha</span></p>}</li>; })}</ul>}</>}
  </section></main>;
}