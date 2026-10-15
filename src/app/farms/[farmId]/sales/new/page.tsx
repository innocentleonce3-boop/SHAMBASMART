import Link from "next/link";
import { notFound } from "next/navigation";
import { SaleForm } from "@/components/finance/record-forms";
import { createClient } from "@/lib/supabase/server";

export default async function NewSalePage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: harvests }] = await Promise.all([
    supabase.from("farms").select("id, name").eq("id", farmId).maybeSingle(),
    supabase.from("harvests").select("*").eq("farm_id", farmId).order("harvested_on", { ascending: false }),
  ]);
  if (!farm) notFound();
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}/finance`} className="text-sm font-semibold text-[#46554a]">← Finance</Link></header><section className="mx-auto max-w-[760px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">{farm.name}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Record a sale</h1><div className="mt-7"><SaleForm farmId={farmId} harvests={harvests ?? []} /></div></section></main>;
}