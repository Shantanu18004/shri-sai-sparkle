import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Tags, ShoppingCart, Coins, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

async function getStats() {
  const [products, categories, orders, inquiries] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);
  return {
    products: products.count ?? 0,
    categories: categories.count ?? 0,
    orders: orders.count ?? 0,
    inquiries: inquiries.count ?? 0,
  };
}

function AdminDashboard() {
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: getStats });

  const cards = [
    { to: "/admin/products", label: "Products", value: data?.products ?? "—", icon: Package },
    { to: "/admin/categories", label: "Categories", value: data?.categories ?? "—", icon: Tags },
    { to: "/admin/orders", label: "Orders", value: data?.orders ?? "—", icon: ShoppingCart },
    { to: "/admin/inquiries", label: "New Inquiries", value: data?.inquiries ?? "—", icon: Mail },
    { to: "/admin/gold-rates", label: "Gold Rates", value: "Manage", icon: Coins },
  ] as const;

  return (
    <div>
      <h1 className="font-serif text-3xl text-dark">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your jewellery store from one place.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-xl border border-border bg-card p-5 transition hover:border-gold hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="mt-2 font-serif text-3xl text-dark">{c.value}</div>
              </div>
              <div className="rounded-lg bg-gold/10 p-3 text-gold group-hover:bg-gold group-hover:text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}