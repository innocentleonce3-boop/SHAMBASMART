"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type AuthFormState } from "@/app/auth/actions";

const initialState: AuthFormState = {};

export function PasswordResetForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);
  return <form action={formAction} className="mt-7 space-y-4">
    <label className="block text-sm font-medium text-[#344238]">Email address<input required name="email" type="email" autoComplete="email" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm outline-none focus:border-[#5d8a4a] focus:ring-2 focus:ring-[#dcebd2]" /></label>
    {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
    {state.success && <p role="status" className="rounded-md border border-[#dce8d5] bg-[#eef5e8] px-3 py-2 text-sm text-[#385b38]">{state.success}</p>}
    <button disabled={pending} className="min-h-11 w-full rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white hover:bg-[#19492e] disabled:opacity-60">{pending ? "Sending..." : "Send reset link"}</button>
    <p className="text-center text-sm"><Link href="/login" className="font-semibold text-[#416b3e] hover:underline">Back to sign in</Link></p>
  </form>;
}