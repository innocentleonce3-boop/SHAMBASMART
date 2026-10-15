"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, MessageCircle, Settings, Sprout, Wheat } from "lucide-react";
import en from "@/messages/en";
import sw from "@/messages/sw";

const links = [
  { href: "/dashboard", key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/farms", key: "farms" as const, icon: Sprout },
  { href: "/messages", key: "messages" as const, icon: MessageCircle },
  { href: "/notifications", key: "notifications" as const, icon: Bell },
];

export function WorkspaceShell({ children, locale }: { children: React.ReactNode; locale: "en" | "sw" }) {
  const pathname = usePathname();
  const isWorkspace = ["/dashboard", "/farms", "/messages", "/notifications", "/settings", "/admin"].some((path) => pathname.startsWith(path));
  if (!isWorkspace) return children;
  const messages = locale === "sw" ? sw : en;

  return <div className="min-h-screen lg:pl-[236px]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] flex-col border-r border-[#e1e7de] bg-white px-4 py-5 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3 px-2"><span className="grid size-9 place-items-center rounded-lg bg-[#245c3c] text-white"><Sprout size={19} /></span><span className="text-sm font-semibold">shamba<span className="text-[#608c45]">smart</span></span></Link>
      <p className="mb-2 mt-10 px-3 text-[10px] font-semibold uppercase text-[#879188]">{messages.workspace}</p>
      <nav className="space-y-1">{links.map(({ href, key, icon: Icon }) => { const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium ${active ? "bg-[#edf4e8] text-[#245c3c]" : "text-[#58655b] hover:bg-[#f6f8f4]"}`}><Icon size={17} />{messages[key]}</Link>; })}</nav>
      <div className="mt-auto space-y-1 border-t border-[#edf0eb] pt-3"><Link href="/admin" className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#58655b] hover:bg-[#f6f8f4]"><Wheat size={17} />{messages.administration}</Link><Link href="/settings" aria-current={pathname.startsWith("/settings") ? "page" : undefined} className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-[#58655b] hover:bg-[#f6f8f4]"><Settings size={17} />{messages.settings}</Link></div>
    </aside>
    <div className="min-h-screen pb-16 lg:pb-0">{children}</div>
    <nav aria-label="Workspace navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#e1e7de] bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-1 lg:hidden">{links.map(({ href, key, icon: Icon }) => { const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[10px] font-medium ${active ? "text-[#245c3c]" : "text-[#6b776d]"}`}><Icon size={18} />{messages[key]}</Link>; })}</nav>
  </div>;
}