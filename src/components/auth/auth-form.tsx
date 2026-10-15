"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthFormState } from "@/app/auth/actions";

const initialState: AuthFormState = {};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      {mode === "register" && <Field label="Your name" name="fullName" autoComplete="name" />}
      <Field label="Email address" name="email" type="email" autoComplete="email" />
      <Field label="Password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} />
      {mode === "login" && <div className="-mt-1 text-right"><Link href="/forgot-password" className="text-sm font-medium text-[#416b3e] hover:underline">Forgot password?</Link></div>}
      {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>}
      <button disabled={pending} className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white hover:bg-[#19492e] disabled:cursor-wait disabled:opacity-60">
        {pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="pt-2 text-center text-sm text-[#657168]">
        {mode === "login" ? <>New to ShambaSmart? <Link className="font-semibold text-[#416b3e] hover:underline" href="/register">Create an account</Link></> : <>Already have an account? <Link className="font-semibold text-[#416b3e] hover:underline" href="/login">Sign in</Link></>}
      </p>
    </form>
  );
}

function Field({ label, name, type = "text", autoComplete }: { label: string; name: string; type?: string; autoComplete: string }) {
  return <label className="block text-sm font-medium text-[#344238]">{label}<input required name={name} type={type} autoComplete={autoComplete} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm outline-none transition focus:border-[#5d8a4a] focus:ring-2 focus:ring-[#dcebd2]" /></label>;
}