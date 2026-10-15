import Link from "next/link";
import { redirect } from "next/navigation";
import { saveLanguage, signOut, updateProfile } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getMessages } from "@/lib/i18n";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ "language-error"?: string; "language-saved"?: string; "profile-error"?: string; "profile-saved"?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, locale, messages, query] = await Promise.all([
    supabase.from("profiles").select("full_name, phone, preferred_language").eq("id", user.id).maybeSingle(),
    getLocale(), getMessages(), searchParams,
  ]);

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/dashboard" className="text-sm font-semibold text-[#46554a]">← {messages.dashboard}</Link><Link href="/farms" className="text-sm text-[#536257]">{messages.farms}</Link></header><section className="mx-auto max-w-[760px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">{messages.settings}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{messages.settings}</h1><p className="mt-2 text-sm text-[#657168]">{user.email}</p>
    {query["language-saved"] && <p role="status" className="mt-5 rounded-md bg-[#eef5e8] px-3 py-2 text-sm text-[#385b38]">Language preference saved.</p>}{query["language-error"] && <p role="alert" className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">Language preference could not be saved.</p>}
    <form action={saveLanguage} className="mt-8 max-w-sm"><label className="block text-sm font-medium text-[#344238]">{messages.language}<select name="language" defaultValue={profile?.preferred_language ?? locale} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm"><option value="en">English</option><option value="sw">Kiswahili</option></select></label><button className="mt-4 min-h-10 rounded-lg bg-[#245c3c] px-4 text-sm font-semibold text-white">{messages.save}</button></form>
    <div className="mt-10 border-t border-[#dfe6dd] pt-6"><p className="text-sm font-medium">Profile</p>{query["profile-saved"] && <p role="status" className="mt-3 text-sm text-[#385b38]">Profile saved.</p>}{query["profile-error"] && <p role="alert" className="mt-3 text-sm text-red-800">Profile could not be saved. Check the details and try again.</p>}<form action={updateProfile} className="mt-4 grid max-w-sm gap-4"><label className="text-sm font-medium text-[#344238]">Full name<input name="fullName" required minLength={2} maxLength={100} defaultValue={profile?.full_name ?? ""} className="mt-1.5 min-h-10 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label><label className="text-sm font-medium text-[#344238]">Phone number<input name="phone" maxLength={30} defaultValue={profile?.phone ?? ""} className="mt-1.5 min-h-10 w-full rounded-lg border border-[#d9e1d7] bg-white px-3 text-sm" /></label><button className="min-h-10 justify-self-start rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">Save profile</button></form></div>
    <form action={signOut} className="mt-10 border-t border-[#dfe6dd] pt-6"><button className="min-h-10 rounded-lg border border-[#d9e1d7] bg-white px-4 text-sm font-semibold text-[#46554a]">{messages.signOut}</button></form>
  </section></main>;
}