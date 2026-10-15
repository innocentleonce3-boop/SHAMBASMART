import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordResetForm } from "@/components/auth/password-reset-form";

export default function ForgotPasswordPage() {
  return <AuthLayout title="Reset your password" description="We will send a reset link if an account matches that email address."><PasswordResetForm /></AuthLayout>;
}