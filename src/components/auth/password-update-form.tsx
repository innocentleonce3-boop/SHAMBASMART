"use client";

import { useActionState } from "react";
import { updatePassword, type AuthFormState } from "@/app/auth/actions";

const initialState: AuthFormState = {};

export function PasswordUpdateForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);
  return <form action={formAction} className="mt-7 space-y-4"><label className="block text-sm font-medium text-[#344238]">New password<input required minLength={8} name="password" type="password" autoComplete="new-password" className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label>{state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}<button disabled={pending} className="min-h-11 w-full rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Updating..." : "Update password"}</button></form>;
}