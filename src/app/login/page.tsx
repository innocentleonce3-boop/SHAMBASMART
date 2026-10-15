import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; setup?: string; "password-updated"?: string }> }) {
  const { error, setup, "password-updated": passwordUpdated } = await searchParams;
  return <AuthLayout title="Welcome back" description="Sign in to your farm workspace.">
    {setup === "supabase" && <p role="status" className="mt-5 rounded-md border border-[#dce8d5] bg-[#eef5e8] px-3 py-2 text-sm text-[#385b38]">Add the Supabase URL and publishable key to .env.local before using farm accounts.</p>}
    {passwordUpdated && <p role="status" className="mt-5 rounded-md border border-[#dce8d5] bg-[#eef5e8] px-3 py-2 text-sm text-[#385b38]">Password updated. Sign in with your new password.</p>}
    {error === "auth-callback" && <p role="alert" className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">That sign-in link could not be verified. Please try again.</p>}
    <AuthForm mode="login" />
  </AuthLayout>;
}