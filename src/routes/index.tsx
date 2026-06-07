import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shri Sai Jewellers" },
      { name: "description", content: "Timeless gold and diamond jewellery from Shri Sai Jewellers." },
      { property: "og:title", content: "Shri Sai Jewellers" },
      { property: "og:description", content: "Timeless gold and diamond jewellery from Shri Sai Jewellers." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Shri Sai Jewellers</h1>
          <nav className="flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && <span className="text-xs text-muted-foreground">Admin</span>}
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-semibold tracking-tight">Backend ready ✨</h2>
        <p className="mt-4 text-muted-foreground">
          Your Lovable Cloud backend is live: products, categories, gold rates, cart,
          wishlist, orders, inquiries, banners, storage, and realtime are all wired up.
          Next, ask me to build the storefront UI and admin dashboard.
        </p>
      </main>
    </div>
  );
}
