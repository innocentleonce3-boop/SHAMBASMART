import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityForm } from "@/components/activities/activity-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewActivityPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: seasons }] = await Promise.all([
    supabase.from("farms").select("id, name").eq("id", farmId).maybeSingle(),
    supabase.from("crop_seasons").select("*").eq("farm_id", farmId).neq("status", "cancelled").order("planting_date", { ascending: false }),
  ]);
  if (!farm) notFound();
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}/activities`} className="text-sm font-semibold text-[#46554a]">← Activities</Link></header><section className="mx-auto max-w-[760px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">{farm.name}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Record an activity</h1><p className="mt-2 text-sm text-[#657168]">Add a task, date, status, and any recorded cost.</p><ActivityForm farmId={farmId} seasons={seasons ?? []} /></section></main>;
}