import Link from "next/link";
import { ArrowRight, MapPin, Plus, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export default async function FarmsPage() {
  const supabase = await createClient();
  const { data: farms, error } = await supabase.from("farms").select("*").order("created_at", { ascending: false });
  const farmRows = (farms ?? []) as Database["public"]["Tables"]["farms"]["Row"][];

  return <main className="min-h-screen bg-[#f7f8f4]">
    <header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/dashboard" className="flex items-center gap-2.5 text-sm font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-[#245c3c] text-white"><Sprout size={17} /></span>shambasmart</Link><Link href="/dashboard" className="text-sm font-medium text-[#536257] hover:text-[#245c3c]">Dashboard</Link></header>
    <section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[#557d45]">Your workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Farms</h1><p className="mt-2 text-sm text-[#657168]">Manage places and growing operations you have access to.</p></div><Link href="/farms/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white hover:bg-[#19492e]"><Plus size={16} /> Add farm</Link></div>
      {error ? <div role="alert" className="mt-8 border-l-4 border-red-500 bg-white px-5 py-4"><p className="text-sm font-semibold">Farms could not be loaded</p><p className="mt-1 text-sm text-[#657168]">Check your connection and database setup, then refresh this page.</p></div> : farmRows.length === 0 ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-[#eaf1e5] text-[#3e7144]"><Sprout size={21} /></span><h2 className="mt-4 text-base font-semibold">No farms recorded yet</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#657168]">Add a farm to start organizing fields, crop seasons, and farm activities.</p><Link href="/farms/new" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#416b3e]">Create your first farm <ArrowRight size={15} /></Link></div> : <ul className="mt-8 grid gap-3 sm:grid-cols-2">{farmRows.map((farm) => <li key={farm.id} className="rounded-lg border border-[#e1e7de] bg-white p-5"><Link href={`/farms/${farm.id}`} className="block"><h2 className="text-base font-semibold">{farm.name}</h2><p className="mt-2 flex items-center gap-1.5 text-sm text-[#657168]"><MapPin size={14} />{[farm.village, farm.district, farm.region].filter(Boolean).join(", ")}</p><p className="mt-4 border-t border-[#edf0eb] pt-3 text-xs text-[#7d887e]">{farm.area_hectares} hectares</p></Link></li>)}</ul>}
    </section>
  </main>;
}