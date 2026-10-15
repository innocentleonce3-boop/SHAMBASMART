import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { ExpenseForm, SaleForm } from "@/components/finance/record-forms";
import { createClient } from "@/lib/supabase/server";

export default async function FinancePage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const [{ data: farm }, { data: sales, error: salesError }, { data: expenses, error: expensesError }, { data: seasons }, { data: harvests }] = await Promise.all([
    supabase.from("farms").select("id, name").eq("id", farmId).maybeSingle(),
    supabase.from("sales").select("*").eq("farm_id", farmId).order("sold_on", { ascending: false }),
    supabase.from("expenses").select("*").eq("farm_id", farmId).order("spent_on", { ascending: false }),
    supabase.from("crop_seasons").select("*").eq("farm_id", farmId).order("planting_date", { ascending: false }),
    supabase.from("harvests").select("*").eq("farm_id", farmId).order("harvested_on", { ascending: false }),
  ]);
  if (!farm) notFound();
  const revenue = (sales ?? []).reduce((sum, sale) => sum + sale.total_tzs, 0);
  const cost = (expenses ?? []).reduce((sum, expense) => sum + expense.amount_tzs, 0);
  const recordsError = salesError || expensesError;

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}`} className="text-sm font-semibold text-[#46554a]">← {farm.name}</Link><Link href={`/farms/${farmId}/harvests`} className="text-sm text-[#536257]">Harvests</Link></header><section className="mx-auto max-w-[1100px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Recorded farm finances</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Sales & expenses</h1><p className="mt-2 text-sm text-[#657168]">Profit is an estimate based on recorded sales and expense entries only.</p>
    {recordsError ? <p role="alert" className="mt-6 bg-white p-5 text-sm text-red-800">Financial records could not be loaded. Totals are hidden until both sales and expenses are available.</p> : <div className="mt-7 grid gap-5 sm:grid-cols-3"><Summary label="Recorded revenue" value={revenue} /><Summary label="Recorded expenses" value={cost} /><Summary label="Estimated balance" value={revenue - cost} /></div>}
    <div className="mt-10 grid gap-8 lg:grid-cols-2"><section><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Sales history</h2><Link href={`/farms/${farmId}/sales/new`} className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-[#245c3c] px-3 text-xs font-semibold text-white"><Plus size={14} /> Add sale</Link></div>{!sales?.length ? <p className="mt-4 border-t border-[#dfe6dd] py-4 text-sm text-[#657168]">No sales recorded.</p> : <ul className="mt-4 divide-y divide-[#edf0eb] border-y border-[#dfe6dd]">{sales.map((sale) => <li key={sale.id} className="flex justify-between gap-3 py-3"><span><span className="block text-sm font-medium">{sale.quantity} {sale.unit} · {sale.sold_on}</span><span className="mt-1 block text-xs text-[#7d887e]">{sale.buyer || "Buyer not recorded"} · TZS {sale.unit_price_tzs.toLocaleString("en-TZ")}/{sale.unit}</span></span><span className="text-sm font-semibold">TZS {sale.total_tzs.toLocaleString("en-TZ")}</span></li>)}</ul>}</section>
      <section><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Expense history</h2><a href="#expense-form" className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-[#d9e1d7] bg-white px-3 text-xs font-semibold text-[#365b3b]"><Plus size={14} /> Add expense</a></div>{!expenses?.length ? <p className="mt-4 border-t border-[#dfe6dd] py-4 text-sm text-[#657168]">No expenses recorded.</p> : <ul className="mt-4 divide-y divide-[#edf0eb] border-y border-[#dfe6dd]">{expenses.map((expense) => <li key={expense.id} className="flex justify-between gap-3 py-3"><span><span className="block text-sm font-medium">{expense.description}</span><span className="mt-1 block text-xs capitalize text-[#7d887e]">{expense.expense_type} · {expense.spent_on}</span></span><span className="text-sm font-semibold">TZS {expense.amount_tzs.toLocaleString("en-TZ")}</span></li>)}</ul>}</section></div>
    <div className="mt-10 grid gap-8 border-t border-[#dfe6dd] pt-8 lg:grid-cols-2"><section><h2 className="text-lg font-semibold">Record a sale</h2><p className="mt-1 text-xs text-[#7d887e]">Totals are calculated from quantity × unit price.</p><div className="mt-4"><SaleForm farmId={farmId} harvests={harvests ?? []} /></div></section><section id="expense-form"><h2 className="text-lg font-semibold">Record an expense</h2><p className="mt-1 text-xs text-[#7d887e]">Do not also record this same cost as an expense elsewhere.</p><div className="mt-4"><ExpenseForm farmId={farmId} seasons={seasons ?? []} /></div></section></div>
    <Link href={`/farms/${farmId}/harvests`} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#416b3e]">Review recorded harvests <ArrowRight size={15} /></Link>
  </section></main>;
}

function Summary({ label, value }: { label: string; value: number }) { return <div className="border-t border-[#cfd9cc] pt-3"><p className="text-xs text-[#657168]">{label}</p><p className="mt-1 text-2xl font-semibold">TZS {value.toLocaleString("en-TZ", { maximumFractionDigits: 2 })}</p></div>; }