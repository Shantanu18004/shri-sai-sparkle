import { supabase } from "@/integrations/supabase/client";

export async function getCart(customerId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(*, product_images(*))")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addToCart(customerId: string, productId: string, quantity = 1) {
  const { data, error } = await supabase
    .from("cart_items")
    .upsert(
      { customer_id: customerId, product_id: productId, quantity },
      { onConflict: "customer_id,product_id" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCartQuantity(id: string, quantity: number) {
  const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
  if (error) throw error;
}

export async function removeFromCart(id: string) {
  const { error } = await supabase.from("cart_items").delete().eq("id", id);
  if (error) throw error;
}