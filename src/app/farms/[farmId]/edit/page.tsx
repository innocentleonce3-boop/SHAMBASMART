import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteFarmForm, FarmEditForm } from "@/components/farms/farm-edit-form";
import { createClient } from "@/lib/supabase/server";

export default async function EditFarmPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const { data: farm } = await supabase.from("farms").select("*").eq("id", farmId).maybeSingle();
  if (!farm) notFound();
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}`} className="text-sm font-semibold text-[#46554a]">← {farm.name}</Link></header><section className="mx-auto max-w-[760px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Farm details</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Edit farm</h1><FarmEditForm farm={farm} /><DeleteFarmForm farmId={farm.id} /></section></main>;
}