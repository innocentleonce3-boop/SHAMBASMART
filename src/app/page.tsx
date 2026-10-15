import Link from "next/link";
import { ArrowRight, BarChart3, Sprout, Sun, Wheat } from "lucide-react";

const highlights = [
  { icon: Sprout, label: "Plan the season", detail: "Keep fields, crops, and planting dates together." },
  { icon: Sun, label: "Stay a step ahead", detail: "Track farm work and see local forecasts in one place." },
  { icon: BarChart3, label: "Know your numbers", detail: "Record harvests, sales, and costs as they happen." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-9 lg:px-14">
        <Link href="/" className="flex items-center gap-3" aria-label="ShambaSmart home">
          <span className="grid size-10 place-items-center rounded-xl bg-[#245c3c] text-white"><Sprout size={21} strokeWidth={2.2} /></span>
          <span className="text-[17px] font-semibold tracking-[-.02em]">shamba<span className="text-[#608c45]">smart</span></span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-[#46554a] hover:bg-white">Log in</Link>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-[#245c3c] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#19492e]">Get started <ArrowRight size={15} /></Link>
        </nav>
      </header>

      <section className="dashboard-grid relative mx-auto mt-4 grid min-h-[510px] grid-cols-1 max-w-[1440px] items-center overflow-hidden border-y border-[#e4e9e1] px-5 py-16 sm:px-9 lg:grid-cols-[1.05fr_.95fr] lg:px-14 lg:py-20">
        <div className="enter relative z-10 min-w-0 max-w-[620px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9e4d1] bg-[#f7f8f4]/90 px-3 py-1.5 text-xs font-semibold text-[#416b3e]"><span className="size-1.5 rounded-full bg-[#78a94c]" /> Built for the people who grow Tanzania</div>
          <h1 className="max-w-[590px] text-[clamp(2.7rem,5.4vw,5rem)] font-semibold leading-[1.02] tracking-[-.055em] text-[#202923]">Your farm, in a <span className="text-[#527d3e]">clearer</span> season.</h1>
          <p className="mt-6 max-w-[480px] text-base leading-7 text-[#657168] sm:text-lg">A practical place to plan farm work, follow crops, and understand what each harvest is really worth.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#245c3c] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#19492e]">Create your farm workspace <ArrowRight size={16} /></Link>
            <Link href="/login" className="inline-flex min-h-12 items-center rounded-lg border border-[#d8dfd6] bg-white/80 px-5 text-sm font-semibold text-[#35453a] hover:bg-white">Sign in</Link>
          </div>
          <p className="mt-5 text-xs text-[#7b867d]">Designed for smallholder farms, managers, and extension teams.</p>
        </div>

        <div className="enter-delay relative mx-auto mt-14 w-full min-w-0 max-w-[490px] lg:mt-0 lg:justify-self-end">
          <div className="absolute -right-12 -top-12 size-48 rounded-full border border-[#dce6d5]" />
          <div className="absolute -bottom-10 -left-8 size-36 rounded-full border border-[#dce6d5]" />
          <div className="relative overflow-hidden rounded-[18px] border border-[#e0e6dd] bg-white shadow-[0_24px_70px_-42px_rgba(31,65,42,.4)]">
            <div className="flex items-center justify-between border-b border-[#edf0eb] px-5 py-4">
              <div><p className="text-xs font-medium text-[#7d887e]">FARM OVERVIEW</p><p className="mt-1 text-sm font-semibold">A calmer view of the season</p></div>
              <span className="grid size-9 place-items-center rounded-lg bg-[#edf4e8] text-[#4d7b3d]"><Wheat size={18} /></span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#edf0eb]">
              <PreviewMetric label="Crop seasons" value="—" note="Your active plantings" />
              <PreviewMetric label="Farm activities" value="—" note="Tasks and field work" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Season at a glance</p><p className="mt-1 text-xs text-[#7d887e]">Your records, all in one view</p></div><span className="rounded-md bg-[#f3f6f1] px-2 py-1 text-[11px] font-medium text-[#5e765a]">Workspace preview</span></div>
              <div className="mt-5 flex h-[104px] items-end gap-2 border-b border-[#e9ede7] px-1">
                {[35, 50, 43, 72, 62, 88, 70, 100, 78, 91, 66, 82].map((height, index) => <span key={index} className="flex-1 rounded-t-[3px] bg-[#dce9d2]" style={{ height: `${height}%` }} />)}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-[#8a948b]"><span>Plant</span><span>Grow</span><span>Harvest</span></div>
            </div>
          </div>
          <p className="relative mt-3 text-center text-[11px] text-[#7d887e]">Illustrative preview. Farm data appears after you connect your workspace.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:grid-cols-3 sm:gap-5 sm:px-9 lg:px-14 lg:py-16">
        {highlights.map(({ icon: Icon, label, detail }) => <article key={label} className="flex gap-4 border-t border-[#dfe6dd] pt-5"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#eaf1e5] text-[#3e7144]"><Icon size={19} /></span><div><h2 className="text-sm font-semibold">{label}</h2><p className="mt-1.5 max-w-[270px] text-sm leading-6 text-[#6c786e]">{detail}</p></div></article>)}
      </section>
      <footer className="border-t border-[#e4e9e1] px-5 py-5 text-center text-xs text-[#818b82]">ShambaSmart · Farm management made practical · Tanzania</footer>
    </main>
  );
}

function PreviewMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="bg-white px-5 py-4"><p className="text-xs font-medium text-[#78847a]">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-[11px] text-[#929b93]">{note}</p></div>;
}