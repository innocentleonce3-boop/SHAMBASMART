import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ReplyForm } from "@/components/messaging/message-form";
import { createClient } from "@/lib/supabase/server";

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: conversation }, { data: messages, error }] = await Promise.all([
    supabase.from("conversations").select("*").eq("id", conversationId).maybeSingle(),
    supabase.from("messages").select("*").eq("conversation_id", conversationId).order("created_at"),
  ]);
  if (!conversation) notFound();

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/messages" className="text-sm font-semibold text-[#46554a]">← Messages</Link><Link href="/dashboard" className="text-sm text-[#536257]">Dashboard</Link></header><section className="mx-auto max-w-[800px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Conversation</p><h1 className="mt-2 text-2xl font-semibold">{conversation.subject}</h1>{error ? <p role="alert" className="mt-6 bg-white p-5 text-sm text-red-800">Messages could not be loaded.</p> : <ul className="mt-6 divide-y divide-[#edf0eb] rounded-lg border border-[#e1e7de] bg-white">{messages?.map((message) => <li key={message.id} className="px-5 py-4"><div className="flex justify-between gap-3"><p className="text-xs font-semibold">{message.sender_id === user.id ? "You" : "Support"}</p><time className="text-xs text-[#7d887e]">{new Date(message.created_at).toLocaleString()}</time></div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#46554a]">{message.body}</p></li>)}</ul>}<ReplyForm conversationId={conversationId} /></section></main>;
}