import Link from "next/link";
import { redirect } from "next/navigation";
import { SupportForm } from "@/components/messaging/message-form";
import { createClient } from "@/lib/supabase/server";

export default async function NewMessagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/messages" className="text-sm font-semibold text-[#46554a]">← Messages</Link></header><section className="mx-auto max-w-[700px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Support</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Start a conversation</h1><SupportForm /></section></main>;
}