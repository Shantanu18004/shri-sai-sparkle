import { supabase } from "@/integrations/supabase/client";

export async function getGoldRates() {
  const { data, error } = await supabase
    .from("gold_rates")
    .select("*")
    .order("purity", { ascending: true });
  if (error) throw error;
  return data;
}

export async function updateGoldRate(purity: string, rate_per_gram: number) {
  const { data, error } = await supabase
    .from("gold_rates")
    .upsert({ purity, rate_per_gram, updated_at: new Date().toISOString() }, { onConflict: "purity" })
    .select()
    .single();
  if (error) throw error;
  return data;
}