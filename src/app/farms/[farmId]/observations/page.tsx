import Link from "next/link";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ObservationsPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: observations, error }] = await Promise.all([
    supabase.from("farms").select("id, name").eq("id", farmId).maybeSingle(),
    supabase.from("crop_observations").select("*").eq("farm_id", farmId).order("observed_at", { ascending: false }),
  ]);
  if (!farm) notFound();
  const observationIds = (observations ?? []).map((item) => item.id);
  const { data: assessments } = observationIds.length ? await supabase.from("disease_risk_assessments").select("observation_id, risk_level, indicators, disclaimer").in("observation_id", observationIds) : { data: [] };
  const riskByObservation = new Map((assessments ?? []).map((item) => [item.observation_id, item]));

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}`} className="text-sm font-semibold text-[#46554a]">← {farm.name}</Link><Link href="/farms" className="text-sm text-[#536257]">Farms</Link></header><section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[#557d45]">Crop monitoring</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Observations</h1></div><Link href={`/farms/${farmId}/observations/new`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white"><Plus size={16} /> Add observation</Link></div>
    {error ? <p role="alert" className="mt-8 bg-white p-5 text-sm text-red-800">Observations could not be loaded. Check your connection and try again.</p> : !observations?.length ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><h2 className="text-base font-semibold">No observations yet</h2><p className="mt-2 text-sm text-[#657168]">Record crop condition and symptoms as you inspect the fields.</p></div> : <ul className="mt-8 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{observations.map((observation) => { const risk = riskByObservation.get(observation.id); return <li key={observation.id} className="px-5 py-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold">{observation.observed_at.slice(0, 10)} · {observation.growth_stage || "Growth stage not recorded"}</p><p className="mt-1 text-xs capitalize text-[#657168]">Condition: {observation.plant_condition ?? "unknown"}</p></div>{risk && <span className="rounded-md bg-[#f3f4e8] px-2.5 py-1 text-xs font-semibold capitalize text-[#6b6539]">Risk indicators: {risk.risk_level}</span>}</div>{observation.symptoms && <p className="mt-3 text-sm leading-6 text-[#536257]">{observation.symptoms}</p>}{risk && <p className="mt-3 text-xs leading-5 text-[#7d887e]">{risk.disclaimer}</p>}</li>; })}</ul>}
  </section></main>;
}