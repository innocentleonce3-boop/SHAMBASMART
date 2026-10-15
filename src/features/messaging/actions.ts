"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MessageFormState = { error?: string };

export async function createSupportConversation(_state: MessageFormState, formData: FormData): Promise<MessageFormState> {
  const parsed = z.object({ subject: z.string().trim().min(3).max(120), body: z.string().trim().min(1).max(10000) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a subject and message." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { data: conversation, error } = await supabase.from("conversations").insert({ subject: `Support: ${parsed.data.subject}`, created_by: user.id }).select("id").single();
  if (error || !conversation) return { error: "A support conversation could not be started. Try again." };
  const { error: messageError } = await supabase.from("messages").insert({ conversation_id: conversation.id, sender_id: user.id, body: parsed.data.body });
  if (messageError) return { error: "The conversation was started, but the first message could not be sent." };
  redirect(`/messages/${conversation.id}`);
}

export async function sendMessage(_state: MessageFormState, formData: FormData): Promise<MessageFormState> {
  const parsed = z.object({ conversationId: z.uuid(), body: z.string().trim().min(1).max(10000) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a message." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session has expired. Sign in again to continue." };
  const { error } = await supabase.from("messages").insert({ conversation_id: parsed.data.conversationId, sender_id: user.id, body: parsed.data.body });
  if (error) return { error: "Message could not be sent. Check conversation access and try again." };
  redirect(`/messages/${parsed.data.conversationId}`);
}