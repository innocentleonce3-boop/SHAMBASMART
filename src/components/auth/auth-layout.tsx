import Link from "next/link";
import { Sprout } from "lucide-react";

export function AuthLayout({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-[#f7f8f4] lg:grid-cols-[1fr_.86fr]">
      <section className="flex min-h-[260px] flex-col justify-between bg-[#214f36] px-6 py-7 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-10">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold"><span className="grid size-10 place-items-center rounded-xl bg-white/10"><Sprout size={20} /></span>shambasmart</Link>
        <div className="max-w-[470px] py-12 lg:py-0"><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#c4d9b3]">Farm management for Tanzania</p><p className="mt-4 text-3xl font-semibold leading-tight">Good seasons start with a clear picture.</p><p className="mt-4 max-w-[390px] text-sm leading-6 text-[#d5e2d0]">Keep the work, the crops, and the numbers that matter connected.</p></div>
        <p className="hidden text-xs text-[#c4d9b3] lg:block">ShambaSmart · Tanzania</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]"><Link href="/" className="text-sm font-medium text-[#657168] hover:text-[#245c3c]">← Home</Link><h1 className="mt-8 text-2xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-[#657168]">{description}</p>{children}</div>
      </section>
    </main>
  );
}