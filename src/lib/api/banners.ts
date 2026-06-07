import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export async function getActiveBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addBanner(input: TablesInsert<"banners">) {
  const { data, error } = await supabase.from("banners").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateBanner(id: string, patch: TablesUpdate<"banners">) {
  const { data, error } = await supabase.from("banners").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw error;
}