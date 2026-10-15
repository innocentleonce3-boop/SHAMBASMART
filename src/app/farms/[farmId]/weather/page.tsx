import Link from "next/link";
import { CloudSun, MapPin } from "lucide-react";
import { z } from "zod";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const forecastSchema = z.object({
  current: z.object({ time: z.string(), temperature_2m: z.number(), precipitation: z.number(), wind_speed_10m: z.number() }),
  daily: z.object({ time: z.array(z.string()), temperature_2m_max: z.array(z.number()), temperature_2m_min: z.array(z.number()), precipitation_sum: z.array(z.number()), wind_speed_10m_max: z.array(z.number()) }),
});

type Forecast = z.infer<typeof forecastSchema>;
const provider = "open-meteo";

export default async function WeatherPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const supabase = await createClient();
  const { data: farm } = await supabase.from("farms").select("id, name, region, latitude, longitude").eq("id", farmId).maybeSingle();
  if (!farm) notFound();

  let forecast: Forecast | null = null;
  let errorMessage: string | null = null;
  let isStale = false;
  if (farm.latitude === null || farm.longitude === null) {
    errorMessage = "Add farm coordinates to see a local forecast. No weather values are estimated from the region name.";
  } else {
    const cacheCutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentCache } = await supabase.from("weather_cache").select("payload, fetched_at").eq("farm_id", farmId).eq("provider", provider).gte("fetched_at", cacheCutoff).order("forecast_for");
    const cachedForecast = recentCache?.[0]?.payload;
    const parsedCache = cachedForecast ? forecastSchema.safeParse(cachedForecast) : null;
    if (parsedCache?.success) forecast = parsedCache.data;

    if (!forecast) {
      try {
        const query = new URLSearchParams({
          latitude: String(farm.latitude), longitude: String(farm.longitude),
          current: "temperature_2m,precipitation,wind_speed_10m",
          daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
          forecast_days: "7", timezone: "auto",
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { next: { revalidate: 3600 } });
        if (!response.ok) throw new Error("Weather provider unavailable");
        const result = forecastSchema.safeParse(await response.json());
        if (!result.success) throw new Error("Weather provider returned unexpected data");
        forecast = result.data;
        isStale = Date.now() - new Date(`${forecast.current.time}:00Z`).getTime() > 60 * 60 * 1000;
      } catch {
        const { data: staleRows } = await supabase.from("weather_cache").select("payload").eq("farm_id", farmId).eq("provider", provider).order("fetched_at", { ascending: false }).limit(1);
        const staleCache = staleRows?.[0]?.payload;
        const parsedStale = staleCache ? forecastSchema.safeParse(staleCache) : null;
        if (parsedStale?.success) {
          forecast = parsedStale.data;
          isStale = true;
        } else {
          errorMessage = "The weather forecast is unavailable right now. Check your connection and try again.";
        }
      }
    }
  }

  return <main className="min-h-screen bg-[#f7f8f4]"><header className="flex h-16 items-center justify-between border-b border-[#e4e9e1] bg-white px-5 sm:px-9"><Link href={`/farms/${farmId}`} className="text-sm font-semibold text-[#46554a]">← {farm.name}</Link><Link href="/farms" className="text-sm text-[#536257]">Farms</Link></header><section className="mx-auto max-w-[960px] px-5 py-10 sm:px-9 sm:py-14"><p className="text-sm font-medium text-[#557d45]">Farm conditions</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Weather</h1><p className="mt-2 flex items-center gap-1.5 text-sm text-[#657168]"><MapPin size={14} />{farm.name} · {farm.region}</p>
    {errorMessage && <p role={forecast ? "status" : "alert"} className="mt-6 border-l-4 border-[#78a94c] bg-white px-5 py-4 text-sm text-[#536257]">{errorMessage}</p>}
    {forecast && <><div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-y border-[#dfe6dd] py-5"><div><p className="text-xs font-medium text-[#657168]">Current conditions · {forecast.current.time.replace("T", " ")}</p><p className="mt-2 text-4xl font-semibold">{forecast.current.temperature_2m}°C</p></div><div className="flex gap-6 text-sm"><p><span className="block text-xs text-[#7d887e]">Precipitation</span><span className="mt-1 block font-semibold">{forecast.current.precipitation} mm</span></p><p><span className="block text-xs text-[#7d887e]">Wind</span><span className="mt-1 block font-semibold">{forecast.current.wind_speed_10m} km/h</span></p></div><span className="inline-flex items-center gap-1.5 text-xs text-[#657168]"><CloudSun size={15} />{isStale ? "Cached forecast · may be stale" : "Open-Meteo forecast"}</span></div><div className="mt-7 divide-y divide-[#e5eae2]">{forecast.daily.time.map((date, index) => <div key={date} className="grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-2 py-4 text-sm"><span className="font-medium">{date}</span><span className="text-[#536257]">{forecast.daily.temperature_2m_min[index]}° / {forecast.daily.temperature_2m_max[index]}°C</span><span className="text-[#536257]">{forecast.daily.precipitation_sum[index]} mm rain</span><span className="text-right text-[#536257]">{forecast.daily.wind_speed_10m_max[index]} km/h wind</span></div>)}</div><p className="mt-5 text-xs leading-5 text-[#818b82]">Forecasts are provided by Open-Meteo. They are not observed farm measurements and may change over time.</p></>}
  </section></main>;
}