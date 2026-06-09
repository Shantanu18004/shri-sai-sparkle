import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getGoldRates } from "@/lib/api/goldRates";
import { subscribeToGoldRates } from "@/lib/api/realtime";
import { Search, Heart, ShoppingBag, Sparkles, Phone } from "lucide-react";

export function GoldRateTicker() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["gold_rates"], queryFn: getGoldRates });

  useEffect(() => {
    return subscribeToGoldRates(() => {
      qc.invalidateQueries({ queryKey: ["gold_rates"] });
    });
  }, [qc]);

  if (!data || data.length === 0) return null;
  const latest = data.reduce<string | null>((acc, r) => {
    if (!acc || new Date(r.updated_at) > new Date(acc)) return r.updated_at;
    return acc;
  }, null);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
      <span className="font-medium text-gold">Live Gold Rate:</span>
      {data.map((r) => (
        <span key={r.id} className="rounded-full border border-gold/30 bg-dark/40 px-3 py-1 font-medium text-dark-foreground">
          {r.purity}: ₹{Number(r.rate_per_gram).toLocaleString("en-IN")}/g
        </span>
      ))}
      {latest && (
        <span className="text-[11px] text-dark-foreground/60">
          Updated {new Date(latest).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </div>
  );
}

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-dark text-dark-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-xs">
          <div className="flex items-center gap-2 text-gold-light">
            <Sparkles className="h-3 w-3" />
            <span className="tracking-wide">Certified Purity · Trusted Since 1995</span>
            <Sparkles className="h-3 w-3" />
          </div>
          <a href="tel:+919651732538" className="flex items-center gap-1.5 text-gold-light hover:text-gold">
            <Phone className="h-3 w-3" />
            +91 96517 32538
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <div className="leading-none">
              <div className="font-serif text-xl font-bold tracking-wider text-gold">SHRI SAI</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">JEWELLERS</div>
            </div>
            <Sparkles className="h-4 w-4 text-gold" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide md:flex">
            <Link to="/" className="hover:text-gold [&.active]:text-gold [&.active]:underline [&.active]:underline-offset-8 [&.active]:decoration-2">HOME</Link>
            <a href="/#about" className="hover:text-gold">ABOUT US</a>
            <a href="/#categories" className="hover:text-gold">CATEGORIES</a>
            <Link to="/products" className="hover:text-gold [&.active]:text-gold">PRODUCTS</Link>
            <a href="/#why-us" className="hover:text-gold">WHY US</a>
            <a href="/#contact" className="hover:text-gold">CONTACT</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-foreground hover:text-gold" aria-label="Search"><Search className="h-5 w-5" /></button>
            <button className="text-foreground hover:text-gold" aria-label="Wishlist"><Heart className="h-5 w-5" /></button>
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 rounded bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-gold/90"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    ADMIN
                  </Link>
                )}
                <button onClick={signOut} className="text-xs text-muted-foreground hover:text-gold">Sign out</button>
              </div>
            ) : (
              <Link to="/auth" className="inline-flex items-center gap-1.5 rounded bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-gold/90">
                <ShoppingBag className="h-4 w-4" />
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}