import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { getFeaturedProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

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
  const featured = useQuery({ queryKey: ["products", "featured"], queryFn: () => getFeaturedProducts(8) });
  const cats = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="text-center">
          <h2 className="text-4xl font-semibold tracking-tight">Timeless Jewellery, Crafted with Care</h2>
          <p className="mt-3 text-muted-foreground">Discover our exquisite collection of gold and diamond jewellery.</p>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="text-2xl font-semibold">Shop by Category</h3>
            <Link to="/products" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {cats.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {cats.data?.map((c) => (
                <Link
                  key={c.id}
                  to="/products"
                  search={{ category: c.slug }}
                  className="group overflow-hidden rounded-lg border bg-card transition hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">{c.name}</div>
                    )}
                  </div>
                  <div className="p-3 text-center text-sm font-medium">{c.name}</div>
                </Link>
              ))}
              {cats.data?.length === 0 && <p className="text-sm text-muted-foreground">No categories yet.</p>}
            </div>
          )}
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="text-2xl font-semibold">Featured Products</h3>
            <Link to="/products" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {featured.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.data?.map((p) => {
                const img = (p as any).product_images?.find((i: any) => i.is_primary) ?? (p as any).product_images?.[0];
                return (
                  <Link
                    key={p.id}
                    to="/products/$id"
                    params={{ id: p.id }}
                    className="group overflow-hidden rounded-lg border bg-card transition hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      {img?.image_url ? (
                        <img src={img.image_url} alt={p.product_name} className="h-full w-full object-cover transition group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No image</div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="truncate text-sm font-medium">{p.product_name}</div>
                      <div className="text-xs text-muted-foreground">{p.gold_weight}g · {p.gold_purity}</div>
                    </div>
                  </Link>
                );
              })}
              {featured.data?.length === 0 && <p className="text-sm text-muted-foreground">No featured products yet.</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
