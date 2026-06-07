import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;

export async function getProducts(opts?: { categoryId?: string; featured?: boolean }) {
  let q = supabase
    .from("products")
    .select("*, product_images(*), categories(name, slug)")
    .eq("status", true)
    .order("created_at", { ascending: false });
  if (opts?.categoryId) q = q.eq("category_id", opts.categoryId);
  if (opts?.featured) q = q.eq("featured", true);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function getFeaturedProducts(limit = 8) {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("status", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), categories(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProductPrice(productId: string) {
  const { data, error } = await supabase.rpc("calculate_product_price", { _product_id: productId });
  if (error) throw error;
  return data?.[0] ?? null;
}

// Admin
export async function addProduct(input: ProductInsert) {
  const { data, error } = await supabase.from("products").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, patch: ProductUpdate) {
  const { data, error } = await supabase.from("products").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}