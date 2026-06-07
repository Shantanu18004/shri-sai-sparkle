import { supabase } from "@/integrations/supabase/client";

export interface CreateOrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export async function createOrder(
  customerId: string,
  items: CreateOrderItem[],
) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.03 * 100) / 100;
  const total = subtotal + gst;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({ customer_id: customerId, subtotal, gst, total })
    .select()
    .single();
  if (error) throw error;

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(items.map((i) => ({ order_id: order.id, ...i })));
  if (itemsErr) throw itemsErr;

  // Clear cart
  await supabase.from("cart_items").delete().eq("customer_id", customerId);

  return order;
}

export async function getMyOrders(customerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(product_name, sku))")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Admin
export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(name, email, phone), order_items(*, products(product_name, sku))")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(
  id: string,
  status: string,
  payment_status?: string,
) {
  const patch = payment_status ? { status, payment_status } : { status };
  const { data, error } = await supabase.from("orders").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}