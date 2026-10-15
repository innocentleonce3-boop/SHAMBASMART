import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SeasonForm } from "@/components/crops/season-form";

export default async function NewSeasonPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: crops }, { data: fields }] = await Promise.all([
    supabase.from("farms").select("id, name, area_hectares").eq("id", farmId).maybeSingle(),
    supabase.from("crops").select("*").eq("is_active", true).order("name_en"),
    supabase.from("fields").select("*").eq("farm_id", farmId).order("name"),
  ]);
  if (!farm) notFound();

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}/seasons`} className="text-sm font-semibold text-[#46554a]">← Crop seasons</Link></header><section className="mx-auto max-w-[760px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">{farm.name}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Add crop season</h1><p className="mt-2 text-sm text-[#657168]">Harvest timing is an estimate based on the crop reference duration.</p><SeasonForm farmId={farmId} crops={crops ?? []} fields={fields ?? []} maxArea={farm.area_hectares} /></section></main>;
}