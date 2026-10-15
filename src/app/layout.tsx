import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getLocale } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShambaSmart | Farm management",
  description: "A clear picture of your farm, from planting to harvest.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body><WorkspaceShell locale={locale}>{children}</WorkspaceShell></body>
    </html>
  );
}