import { createFileRoute } from "@tanstack/react-router";

const TROY_OUNCE_IN_GRAMS = 31.1034768;

async function fetchGoldUsdPerOunce(): Promise<number> {
  const res = await fetch("https://api.gold-api.com/price/XAU", { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`gold-api ${res.status}`);
  const j = (await res.json()) as { price: number };
  if (!j.price || j.price <= 0) throw new Error("Invalid gold price");
  return j.price;
}

async function fetchUsdToInr(): Promise<number> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`fx ${res.status}`);
  const j = (await res.json()) as { rates?: { INR?: number } };
  const inr = j.rates?.INR;
  if (!inr || inr <= 0) throw new Error("Invalid FX rate");
  return inr;
}

async function handler() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [usdPerOz, usdInr] = await Promise.all([fetchGoldUsdPerOunce(), fetchUsdToInr()]);
  const inrPerGram24 = (usdPerOz / TROY_OUNCE_IN_GRAMS) * usdInr;

  const purities: { purity: "24K" | "22K" | "18K"; rate: number }[] = [
    { purity: "24K", rate: inrPerGram24 },
    { purity: "22K", rate: inrPerGram24 * (22 / 24) },
    { purity: "18K", rate: inrPerGram24 * (18 / 24) },
  ];

  // Only update rows that are NOT manually overridden
  const updated: string[] = [];
  const skipped: string[] = [];
  for (const { purity, rate } of purities) {
    const rounded = Math.round(rate * 100) / 100;
    const { data, error } = await supabaseAdmin
      .from("gold_rates")
      .update({ rate_per_gram: rounded, updated_at: new Date().toISOString() })
      .eq("purity", purity)
      .eq("is_manual", false)
      .select("purity");
    if (error) throw error;
    if (data && data.length > 0) updated.push(purity);
    else skipped.push(purity);
  }

  return new Response(
    JSON.stringify({
      success: true,
      source: { usdPerOz, usdInr },
      updated,
      skipped_manual: skipped,
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

export const Route = createFileRoute("/api/public/hooks/update-gold-rates")({
  server: {
    handlers: {
      GET: async () => {
        try { return await handler(); }
        catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          return new Response(JSON.stringify({ success: false, error: msg }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      },
      POST: async () => {
        try { return await handler(); }
        catch (e) {
          const msg = e instanceof Error ? e.message : "Unknown error";
          return new Response(JSON.stringify({ success: false, error: msg }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      },
    },
  },
});