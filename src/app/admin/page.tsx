import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/dashboard");
  const [{ data: overview }, { data: profiles, error }] = await Promise.all([
    supabase.rpc("admin_overview_counts").maybeSingle(),
    supabase.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false }).limit(100),
  ]);

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/dashboard" className="text-sm font-semibold text-[#46554a]">← Dashboard</Link><Link href="/admin/support" className="text-sm text-[#536257]">Support inbox</Link></header><section className="mx-auto max-w-[1050px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Authorized operations</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Administration</h1><p className="mt-2 text-sm text-[#657168]">Summary counts are aggregated. Private farm records are not included in this view.</p>{overview && <div className="mt-7 grid grid-cols-2 gap-5 border-y border-[#dfe6dd] py-5 sm:grid-cols-4"><Metric label="Users" value={overview.users_count} /><Metric label="Farms" value={overview.farms_count} /><Metric label="Active seasons" value={overview.active_crop_seasons_count} /><Metric label="Support threads" value={overview.support_conversations_count} /></div>}<h2 className="mt-10 text-lg font-semibold">Recent user accounts</h2>{error ? <p role="alert" className="mt-4 text-sm text-red-800">User list could not be loaded.</p> : <ul className="mt-4 divide-y divide-[#edf0eb] border-y border-[#dfe6dd]">{profiles?.map((item) => <li key={item.id} className="flex flex-wrap justify-between gap-2 py-3"><span className="text-sm font-medium">{item.full_name || "Name not provided"}</span><span className="text-xs capitalize text-[#7d887e]">{item.role} · {new Date(item.created_at).toLocaleDateString()}</span></li>)}</ul>}<p className="mt-5 text-xs leading-5 text-[#818b82]">Administrator role assignment is managed through trusted Supabase operations, never through account registration.</p></section></main>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div><p className="text-xs text-[#657168]">{label}</p><p className="mt-1 text-2xl font-semibold">{value.toLocaleString()}</p></div>; }