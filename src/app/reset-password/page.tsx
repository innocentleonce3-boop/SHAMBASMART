import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordUpdateForm } from "@/components/auth/password-update-form";

export default function ResetPasswordPage() {
  return <AuthLayout title="Choose a new password" description="Set a new password for your ShambaSmart account."><PasswordUpdateForm /></AuthLayout>;
}