import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Package, Tags, ShoppingCart, Coins, Mail, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Shri Sai Jewellers" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/gold-rates", label: "Gold Rates", icon: Coins },
  { to: "/admin/inquiries", label: "Inquiries", icon: Mail },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-serif text-2xl">Not authorized</h1>
        <p className="text-muted-foreground">Your account doesn't have admin access.</p>
        <Link to="/" className="text-gold underline">Return home</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-dark text-dark-foreground md:flex">
        <div className="border-b border-dark-foreground/10 px-6 py-5">
          <div className="font-serif text-lg font-bold text-gold">SHRI SAI</div>
          <div className="text-[10px] tracking-[0.3em] text-dark-foreground/60">ADMIN PANEL</div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as "/admin"}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active ? "bg-gold text-primary-foreground" : "text-dark-foreground/80 hover:bg-dark-foreground/5 hover:text-gold"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-dark-foreground/10 p-3">
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-dark-foreground/70 hover:text-gold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-6 md:p-8">
        <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
          {nav.map((item) => (
            <Link key={item.to} to={item.to as "/admin"} className="whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs">
              {item.label}
            </Link>
          ))}
        </div>
        <Outlet />
      </main>
    </div>
  );
}