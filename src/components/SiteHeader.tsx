import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getGoldRates } from "@/lib/api/goldRates";
import { subscribeToGoldRates } from "@/lib/api/realtime";

export function GoldRateTicker() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["gold_rates"], queryFn: getGoldRates });

  useEffect(() => {
    return subscribeToGoldRates(() => {
      qc.invalidateQueries({ queryKey: ["gold_rates"] });
    });
  }, [qc]);

  if (!data || data.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span className="font-medium text-muted-foreground">Live Gold Rate:</span>
      {data.map((r) => (
        <span key={r.id} className="rounded-full bg-accent px-3 py-1 font-medium">
          {r.purity}: ₹{Number(r.rate_per_gram).toLocaleString("en-IN")}/g
        </span>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Shri Sai Jewellers
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-primary [&.active]:text-primary">Home</Link>
            <Link to="/products" className="hover:text-primary [&.active]:text-primary">Products</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && <span className="text-xs text-muted-foreground">Admin</span>}
              <span className="hidden text-sm text-muted-foreground md:inline">{user.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>
          )}
        </div>
      </div>
      <div className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-2">
          <GoldRateTicker />
        </div>
      </div>
    </header>
  );
}