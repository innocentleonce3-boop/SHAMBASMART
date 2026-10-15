"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createSupportConversation, sendMessage, type MessageFormState } from "@/features/messaging/actions";

const initialState: MessageFormState = {};

export function SupportForm() {
  const [state, action, pending] = useActionState(createSupportConversation, initialState);
  return <form action={action} className="mt-6 space-y-4"><Field label="Subject" name="subject" required /><label className="block text-sm font-medium text-[#344238]">Message<textarea required name="body" rows={5} maxLength={10000} className="mt-1.5 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" /></label>{state.error && <p role="alert" className="text-sm text-red-800">{state.error}</p>}<button disabled={pending} className="min-h-10 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Sending..." : "Start support conversation"}</button><Link href="/messages" className="ml-3 text-sm text-[#657168]">Cancel</Link></form>;
}

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const [state, action, pending] = useActionState(sendMessage, initialState);
  return <form action={action} className="mt-5 border-t border-[#e4e9e1] pt-5"><input type="hidden" name="conversationId" value={conversationId} /><label className="sr-only" htmlFor="message-body">Write a message</label><textarea id="message-body" required name="body" rows={3} maxLength={10000} placeholder="Write a reply..." className="w-full rounded-lg border border-[#d9e1d7] bg-white px-3 py-2 text-sm" />{state.error && <p role="alert" className="mt-2 text-sm text-red-800">{state.error}</p>}<div className="mt-3 flex justify-end"><button disabled={pending} className="min-h-10 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Sending..." : "Send message"}</button></div></form>;
}

function Field({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input name={name} required={required} className="mt-1.5 min-h-10 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>;
}