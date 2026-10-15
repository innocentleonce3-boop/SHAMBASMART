"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error?: string; success?: string };

async function authClient() {
  try {
    return await createClient();
  } catch {
    return null;
  }
}

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

const emailSchema = z.object({ email: z.email("Enter a valid email address.") });

export async function signIn(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };

  const supabase = await authClient();
  if (!supabase) return { error: "Authentication is not configured yet. Add the Supabase URL and publishable key to .env.local." };
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "We could not sign you in with those details." };

  redirect("/dashboard");
}

export async function signUp(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };

  const supabase = await authClient();
  if (!supabase) return { error: "Authentication is not configured yet. Add the Supabase URL and publishable key to .env.local." };
  const origin = (await headers()).get("origin");
  if (!origin) return { error: "This request could not be verified. Reload the page and try again." };
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });
  if (error) return { error: "We could not create your account. Check the details or try signing in." };

  if (!data.session) redirect("/register?check-email=1");
  redirect("/dashboard");
}

export async function requestPasswordReset(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = emailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };

  const supabase = await authClient();
  if (!supabase) return { error: "Authentication is not configured yet. Add the Supabase URL and publishable key to .env.local." };
  const origin = (await headers()).get("origin");
  if (!origin) return { error: "This request could not be verified. Reload the page and try again." };
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: "We could not send a reset link right now. Try again later." };
  return { success: "If an account uses that address, a password reset link is on its way." };
}

export async function updatePassword(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = z.object({ password: z.string().min(8, "Use at least 8 characters.") }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your password." };
  const supabase = await authClient();
  if (!supabase) return { error: "Authentication is not configured yet. Add the Supabase URL and publishable key to .env.local." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "This reset link is invalid or expired. Request a new one." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "Your password could not be updated. Request a new reset link." };
  redirect("/login?password-updated=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveLanguage(formData: FormData): Promise<void> {
  const parsed = z.enum(["en", "sw"]).safeParse(formData.get("language"));
  if (!parsed.success) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("profiles").update({ preferred_language: parsed.data, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error) redirect("/settings?language-error=1");
  (await cookies()).set("shamba-locale", parsed.data, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  redirect("/settings?language-saved=1");
}

export async function updateProfile(formData: FormData): Promise<void> {
  const parsed = z.object({
    fullName: z.string().trim().min(2).max(100),
    phone: z.string().trim().max(30),
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/settings?profile-error=1");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("profiles").update({ full_name: parsed.data.fullName, phone: parsed.data.phone || null, updated_at: new Date().toISOString() }).eq("id", user.id);
  redirect(error ? "/settings?profile-error=1" : "/settings?profile-saved=1");
}