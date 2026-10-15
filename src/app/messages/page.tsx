import Link from "next/link";
import { MessageCircle, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: memberships, error: membershipError } = await supabase.from("conversation_members").select("conversation_id").eq("user_id", user.id);
  const conversationIds = [...new Set((memberships ?? []).map((item) => item.conversation_id))];
  const { data: conversations, error } = conversationIds.length ? await supabase.from("conversations").select("*").in("id", conversationIds).order("created_at", { ascending: false }) : { data: [], error: null };

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/dashboard" className="text-sm font-semibold text-[#46554a]">← Dashboard</Link><Link href="/settings" className="text-sm text-[#536257]">Settings</Link></header><section className="mx-auto max-w-[850px] px-5 py-10 sm:px-9 sm:py-14"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-[#557d45]">Help and conversations</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Messages</h1></div><Link href="/messages/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white"><Plus size={16} /> Contact support</Link></div>
    {membershipError || error ? <p role="alert" className="mt-8 bg-white p-5 text-sm text-red-800">Conversations could not be loaded. Check your access and try again.</p> : !conversations?.length ? <div className="mt-8 border border-dashed border-[#cfd9cc] bg-white px-6 py-12 text-center"><MessageCircle className="mx-auto text-[#527d3e]" /><h2 className="mt-4 text-base font-semibold">No conversations yet</h2><p className="mt-2 text-sm text-[#657168]">Contact support when you need help with your workspace.</p></div> : <ul className="mt-8 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{conversations.map((conversation) => <li key={conversation.id}><Link href={`/messages/${conversation.id}`} className="block px-5 py-4 hover:bg-[#fafbf8]"><p className="text-sm font-semibold">{conversation.subject}</p><p className="mt-1 text-xs text-[#7d887e]">Opened {new Date(conversation.created_at).toLocaleDateString()}</p></Link></li>)}</ul>}
  </section></main>;
}