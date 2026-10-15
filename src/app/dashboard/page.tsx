import Link from "next/link";
import { ArrowRight, Bell, Settings } from "lucide-react";
import { getMessages } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  let userName = "Farmer";
  let setupMessage: string | null = null;
  let snapshot: Awaited<ReturnType<typeof loadSnapshot>> | null = null;
  const messages = await getMessages();

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) setupMessage = "Your session could not be verified. Sign in again to continue.";
    else {
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      userName = profile?.full_name || user.user_metadata.full_name || user.email || "Farmer";
      snapshot = await loadSnapshot(supabase);
    }
  } catch {
    setupMessage = "Connect Supabase to use your secure farm workspace.";
  }

  return <main className="min-h-screen bg-[#f7f8f4]">
    <header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><div><p className="text-xs text-[#7d887e]">{messages.dashboard}</p><p className="mt-0.5 text-sm font-semibold">{userName}</p></div><div className="flex gap-2"><Link aria-label={messages.notifications} title={messages.notifications} href="/notifications" className="grid size-9 place-items-center rounded-lg border border-[#e1e7de] text-[#536257]"><Bell size={17} /></Link><Link aria-label={messages.settings} title={messages.settings} href="/settings" className="grid size-9 place-items-center rounded-lg border border-[#e1e7de] text-[#536257]"><Settings size={17} /></Link></div></header>
    <section className="mx-auto max-w-[1100px] px-5 py-10 sm:px-9 sm:py-14">
      <p className="text-sm font-medium text-[#557d45]">{messages.farmWorkspace}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {userName}</h1>
      {setupMessage ? <div role="status" className="mt-8 border-l-4 border-[#78a94c] bg-white px-5 py-4"><p className="text-sm font-semibold">Workspace setup required</p><p className="mt-1 text-sm text-[#657168]">{setupMessage}</p><Link href="/login" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#416b3e]">Continue to sign in <ArrowRight size={15} /></Link></div> : snapshot?.error ? <div role="alert" className="mt-8 border-l-4 border-red-500 bg-white px-5 py-4"><p className="text-sm font-semibold">Dashboard records could not be loaded</p><p className="mt-1 text-sm text-[#657168]">Check your database connection and row access policies, then refresh. No sample totals are shown.</p></div> : snapshot && snapshot.farmCount === 0 ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><h2 className="text-base font-semibold">{messages.noFarms}</h2><p className="mt-2 text-sm text-[#657168]">Add a farm to start recording fields, crops, and farm work.</p><Link href="/farms/new" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white">{messages.addFarm} <ArrowRight size={15} /></Link></div> : snapshot && <>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 border-y border-[#dfe6dd] py-5 sm:grid-cols-3 lg:grid-cols-6"><Metric label={messages.farms} value={snapshot.farmCount} /><Metric label={messages.activeSeasons} value={snapshot.activeSeasonCount} /><Metric label={messages.cultivatedArea} value={`${snapshot.cultivatedArea.toLocaleString()} ha`} /><Metric label={messages.upcomingTasks} value={snapshot.upcomingActivities.length} /><Metric label={messages.recentHarvest} value={snapshot.harvestCount} /><Metric label={messages.estimatedBalance} value={`TZS ${snapshot.netRecorded.toLocaleString("en-TZ", { maximumFractionDigits: 0 })}`} /></div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_.9fr]"><section><div className="flex items-end justify-between"><h2 className="text-lg font-semibold">{messages.upcomingTasks}</h2><Link href="/farms" className="text-xs font-semibold text-[#416b3e]">{messages.farms} <ArrowRight className="inline" size={13} /></Link></div>{snapshot.upcomingActivities.length ? <ul className="mt-4 divide-y divide-[#edf0eb] border-y border-[#dfe6dd]">{snapshot.upcomingActivities.map((activity) => <li key={activity.id} className="flex justify-between gap-3 py-3"><span className="text-sm font-medium">{activity.title}</span><span className="shrink-0 text-xs text-[#657168]">{activity.activity_date}</span></li>)}</ul> : <p className="mt-4 border-y border-[#dfe6dd] py-4 text-sm text-[#657168]">No upcoming activities have been recorded.</p>}</section><section><h2 className="text-lg font-semibold">Recorded finances</h2><div className="mt-4 space-y-3 border-y border-[#dfe6dd] py-4"><Summary label={messages.recordedRevenue} value={snapshot.revenue} /><Summary label={messages.recordedExpenses} value={snapshot.expenses} /></div><p className="mt-3 text-xs leading-5 text-[#818b82]">Profit estimates depend on complete records. Activity costs are not added to expenses, to avoid double-counting.</p></section></div>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/farms" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white">{messages.farms} <ArrowRight size={15} /></Link><Link href="/messages" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">{messages.messages}</Link></div>
      </>}
    </section>
  </main>;
}

async function loadSnapshot(supabase: Awaited<ReturnType<typeof createClient>>) {
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: farms, error: farmsError }, { data: seasons, error: seasonsError }, { data: activities, error: activitiesError }, { data: harvests, error: harvestsError }, { data: sales, error: salesError }, { data: expenses, error: expensesError }] = await Promise.all([
    supabase.from("farms").select("id, area_hectares"),
    supabase.from("crop_seasons").select("id, cultivated_area_hectares, status").eq("status", "active"),
    supabase.from("farm_activities").select("id, title, activity_date").in("status", ["planned", "in_progress"]).gte("activity_date", today).order("activity_date").limit(5),
    supabase.from("harvests").select("id"),
    supabase.from("sales").select("total_tzs"),
    supabase.from("expenses").select("amount_tzs"),
  ]);
  const error = [farmsError, seasonsError, activitiesError, harvestsError, salesError, expensesError].some(Boolean);
  const revenueCents = (sales ?? []).reduce((sum, sale) => sum + Math.round(sale.total_tzs * 100), 0);
  const expenseCents = (expenses ?? []).reduce((sum, item) => sum + Math.round(item.amount_tzs * 100), 0);
  return {
    error,
    farmCount: farms?.length ?? 0,
    activeSeasonCount: seasons?.length ?? 0,
    cultivatedArea: (seasons ?? []).reduce((sum, season) => sum + season.cultivated_area_hectares, 0),
    upcomingActivities: activities ?? [],
    harvestCount: harvests?.length ?? 0,
    revenue: revenueCents / 100,
    expenses: expenseCents / 100,
    netRecorded: (revenueCents - expenseCents) / 100,
  };
}

function Metric({ label, value }: { label: string; value: string | number }) { return <div><p className="text-xs text-[#657168]">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>; }
function Summary({ label, value }: { label: string; value: number }) { return <div className="flex justify-between gap-3 text-sm"><span className="text-[#657168]">{label}</span><span className="font-semibold">TZS {value.toLocaleString("en-TZ", { maximumFractionDigits: 2 })}</span></div>; }