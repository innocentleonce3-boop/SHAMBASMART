import Link from "next/link";
import { FarmForm } from "@/components/farms/farm-form";

export default function NewFarmPage() {
  return <main className="min-h-screen bg-[#f7f8f4]">
    <header className="flex h-16 items-center border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href="/farms" className="text-sm font-semibold text-[#46554a] hover:text-[#245c3c]">← Farms</Link></header>
    <section className="mx-auto max-w-[760px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Farm details</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Add a farm</h1><p className="mt-2 text-sm text-[#657168]">Location and size help organize your farm records. Coordinates can be added later.</p><FarmForm /></section>
  </main>;
}