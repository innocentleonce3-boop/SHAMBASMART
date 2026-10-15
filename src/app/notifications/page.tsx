import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: notifications, error } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/dashboard" className="text-sm font-semibold text-[#46554a]">← Dashboard</Link><Link href="/settings" className="text-sm text-[#536257]">Settings</Link></header><section className="mx-auto max-w-[850px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Updates</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Notifications</h1>{error ? <p role="alert" className="mt-8 bg-white p-5 text-sm text-red-800">Notifications could not be loaded. Check your connection and try again.</p> : !notifications?.length ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><h2 className="text-base font-semibold">You are all caught up</h2><p className="mt-2 text-sm text-[#657168]">Farm reminders and updates will appear here when available.</p></div> : <ul className="mt-8 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{notifications.map((notice) => <li key={notice.id} className="px-5 py-4"><div className="flex justify-between gap-3"><p className="text-sm font-semibold">{notice.title}</p><time className="shrink-0 text-xs text-[#7d887e]">{new Date(notice.created_at).toLocaleDateString()}</time></div><p className="mt-1 text-sm text-[#657168]">{notice.body}</p></li>)}</ul>}</section></main>;
}