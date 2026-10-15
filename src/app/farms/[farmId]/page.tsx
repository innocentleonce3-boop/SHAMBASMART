import Link from "next/link";
import { ArrowRight, ClipboardList, CloudSun, MapPin, Sprout, Wheat, PanelsTopLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FarmDetailPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const { data: farm } = await supabase.from("farms").select("*").eq("id", farmId).maybeSingle();
  if (!farm) notFound();

  const [{ count: seasonCount }, { count: activityCount }] = await Promise.all([
    supabase.from("crop_seasons").select("id", { count: "exact", head: true }).eq("farm_id", farmId),
    supabase.from("farm_activities").select("id", { count: "exact", head: true }).eq("farm_id", farmId),
  ]);

  const sections = [
    { href: `/farms/${farmId}/fields`, icon: PanelsTopLeft, title: "Fields", count: null, label: "field layout" },
    { href: `/farms/${farmId}/seasons`, icon: Sprout, title: "Crop seasons", count: seasonCount ?? 0, label: "plantings recorded" },
    { href: `/farms/${farmId}/activities`, icon: ClipboardList, title: "Activities", count: activityCount ?? 0, label: "tasks recorded" },
    { href: `/farms/${farmId}/observations`, icon: ClipboardList, title: "Observations", count: null, label: "crop monitoring" },
    { href: `/farms/${farmId}/weather`, icon: CloudSun, title: "Weather", count: null, label: "local forecast" },
    { href: `/farms/${farmId}/harvests`, icon: Wheat, title: "Harvests", count: null, label: "yield records" },
    { href: `/farms/${farmId}/finance`, icon: ClipboardList, title: "Sales & expenses", count: null, label: "recorded finances" },
  ];

  return <main className="min-h-screen bg-[#f7f8f4]">
    <header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/farms" className="text-sm font-semibold text-[#46554a]">← Farms</Link><Link href="/dashboard" className="text-sm text-[#536257]">Dashboard</Link></header>
    <section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-[#557d45]">Farm overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{farm.name}</h1><p className="mt-3 flex items-center gap-1.5 text-sm text-[#657168]"><MapPin size={15} />{[farm.village, farm.district, farm.region].filter(Boolean).join(", ")}</p></div><Link href={`/farms/${farmId}/edit`} className="rounded-md border border-[#d9e1d7] bg-white px-3 py-2 text-sm font-semibold text-[#46554a]">Edit farm</Link></div><div className="mt-6 inline-flex items-baseline gap-2 border-t border-[#dfe6dd] pt-4"><span className="text-2xl font-semibold">{farm.area_hectares}</span><span className="text-sm text-[#657168]">hectares</span></div>
      <div className="mt-9 grid gap-3 sm:grid-cols-2">{sections.map(({ href, icon: Icon, title, count, label }) => <Link key={title} href={href} className="group flex items-center justify-between rounded-lg border border-[#e1e7de] bg-white p-5 hover:border-[#b7c9ad]"><span className="flex items-center gap-4"><span className="grid size-10 place-items-center rounded-lg bg-[#eaf1e5] text-[#3e7144]"><Icon size={19} /></span><span><span className="block text-sm font-semibold">{title}</span><span className="mt-1 block text-xs text-[#7d887e]">{count === null ? label : `${count} ${label}`}</span></span></span><ArrowRight size={16} className="text-[#89958a] transition group-hover:translate-x-0.5" /></Link>)}</div>
    </section>
  </main>;
}