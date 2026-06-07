import { supabase } from "@/integrations/supabase/client";

export function subscribeToGoldRates(onChange: () => void) {
  const ch = supabase
    .channel("realtime:gold_rates")
    .on("postgres_changes", { event: "*", schema: "public", table: "gold_rates" }, onChange)
    .subscribe();
  return () => {
    supabase.removeChannel(ch);
  };
}

export function subscribeToProducts(onChange: () => void) {
  const ch = supabase
    .channel("realtime:products")
    .on("postgres_changes", { event: "*", schema: "public", table: "products" }, onChange)
    .subscribe();
  return () => {
    supabase.removeChannel(ch);
  };
}

export function subscribeToMyOrders(customerId: string, onChange: () => void) {
  const ch = supabase
    .channel(`realtime:orders:${customerId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders", filter: `customer_id=eq.${customerId}` },
      onChange,
    )
    .subscribe();
  return () => {
    supabase.removeChannel(ch);
  };
}