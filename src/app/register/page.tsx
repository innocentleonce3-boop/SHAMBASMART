import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ "check-email"?: string }> }) {
  const { "check-email": checkEmail } = await searchParams;
  return <AuthLayout title={checkEmail ? "Check your email" : "Create your account"} description={checkEmail ? "Use the confirmation link we sent to finish setting up your account." : "Start with an account. You can add your farm workspace next."}>
    {checkEmail ? <p className="mt-6 rounded-md border border-[#dce8d5] bg-[#eef5e8] px-4 py-3 text-sm leading-6 text-[#385b38]">If the address is registered, a confirmation message will arrive shortly. Check your inbox and spam folder.</p> : <AuthForm mode="register" />}
  </AuthLayout>;
}