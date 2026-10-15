import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") notFound();
  const { data: conversations, error } = await supabase.from("conversations").select("*").like("subject", "Support:%").order("created_at", { ascending: false });
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/admin" className="text-sm font-semibold text-[#46554a]">← Administration</Link><Link href="/messages" className="text-sm text-[#536257]">Messages</Link></header><section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Authorized support</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Support inbox</h1><p className="mt-2 text-sm text-[#657168]">Only conversations explicitly created for support are visible here.</p>{error ? <p role="alert" className="mt-8 bg-white p-5 text-sm text-red-800">Support conversations could not be loaded.</p> : !conversations?.length ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><h2 className="text-base font-semibold">No support conversations</h2></div> : <ul className="mt-8 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{conversations.map((conversation) => <li key={conversation.id}><Link href={`/messages/${conversation.id}`} className="flex justify-between gap-3 px-5 py-4"><span className="text-sm font-semibold">{conversation.subject}</span><time className="shrink-0 text-xs text-[#7d887e]">{new Date(conversation.created_at).toLocaleDateString()}</time></Link></li>)}</ul>}</section></main>;
}