import { supabase } from "@/integrations/supabase/client";

export async function getWishlist(customerId: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .select("*, products(*, product_images(*))")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addToWishlist(customerId: string, productId: string) {
  const { data, error } = await supabase
    .from("wishlist")
    .upsert({ customer_id: customerId, product_id: productId }, { onConflict: "customer_id,product_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeFromWishlist(customerId: string, productId: string) {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("customer_id", customerId)
    .eq("product_id", productId);
  if (error) throw error;
}