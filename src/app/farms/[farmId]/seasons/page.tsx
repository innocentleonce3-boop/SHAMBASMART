import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SeasonsPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: seasons, error }] = await Promise.all([
    supabase.from("farms").select("id, name").eq("id", farmId).maybeSingle(),
    supabase.from("crop_seasons").select("*").eq("farm_id", farmId).order("planting_date", { ascending: false }),
  ]);
  if (!farm) notFound();

  const cropIds = [...new Set((seasons ?? []).map((season) => season.crop_id))];
  const { data: crops } = cropIds.length ? await supabase.from("crops").select("id, name_en, name_sw").in("id", cropIds) : { data: [] };
  const cropNames = new Map((crops ?? []).map((crop) => [crop.id, `${crop.name_en} / ${crop.name_sw}`]));

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}`} className="text-sm font-semibold text-[#46554a]">← {farm.name}</Link><Link href="/farms" className="text-sm text-[#536257]">Farms</Link></header>
    <section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[#557d45]">Growing plan</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Crop seasons</h1></div><Link href={`/farms/${farmId}/seasons/new`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white"><Plus size={16} /> Add season</Link></div>
      {error ? <p role="alert" className="mt-8 bg-white p-5 text-sm text-red-800">Crop seasons could not be loaded. Check your connection and try again.</p> : !seasons?.length ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><h2 className="text-base font-semibold">No crop seasons yet</h2><p className="mt-2 text-sm text-[#657168]">Record a planting to begin tracking its growth and estimated harvest date.</p><Link href={`/farms/${farmId}/seasons/new`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#416b3e]">Add a crop season <ArrowRight size={15} /></Link></div> : <ul className="mt-8 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{seasons.map((season) => <li key={season.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"><div><p className="text-sm font-semibold">{season.season_name} · {cropNames.get(season.crop_id) ?? "Crop"}</p><p className="mt-1 text-xs text-[#657168]">Planted {season.planting_date} · {season.cultivated_area_hectares} ha · {season.status}</p></div><p className="text-right text-xs text-[#657168]">Estimated harvest<br /><span className="mt-1 inline-block font-semibold text-[#365b3b]">{season.expected_harvest_date ?? "Not available"}</span></p></li>)}</ul>}
      <p className="mt-4 text-xs text-[#818b82]">Harvest dates are estimates based on reference crop duration, not guarantees.</p>
    </section></main>;
}