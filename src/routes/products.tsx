import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { SiteHeader } from "@/components/SiteHeader";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

type ProductSearch = { category: string; q: string };

const searchSchema = z.object({
  category: fallback(z.string(), "").default(""),
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/products")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Products — Shri Sai Jewellers" },
      { name: "description", content: "Browse our collection of fine gold and diamond jewellery." },
    ],
  }),
  component: ProductsPage,
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found.</div>,
});

function ProductsPage() {
  const { category, q } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [search, setSearch] = useState(q);

  const cats = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const selectedCat = useMemo(
    () => cats.data?.find((c) => c.slug === category) ?? null,
    [cats.data, category],
  );

  const products = useQuery({
    queryKey: ["products", { categoryId: selectedCat?.id ?? null }],
    queryFn: () => getProducts(selectedCat ? { categoryId: selectedCat.id } : undefined),
  });

  const filtered = useMemo(() => {
    if (!products.data) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return products.data;
    return products.data.filter(
      (p) =>
        p.product_name.toLowerCase().includes(needle) ||
        p.sku.toLowerCase().includes(needle) ||
        (p.description ?? "").toLowerCase().includes(needle),
    );
  }, [products.data, q]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Products</h1>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ search: (prev: ProductSearch) => ({ ...prev, q: search }) });
            }}
            className="w-full md:max-w-sm"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU…"
            />
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ search: (prev: ProductSearch) => ({ ...prev, category: "" }) })}
            className={`rounded-full border px-3 py-1 text-sm ${!category ? "bg-primary text-primary-foreground" : "bg-background"}`}
          >
            All
          </button>
          {cats.data?.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate({ search: (prev: ProductSearch) => ({ ...prev, category: c.slug }) })}
              className={`rounded-full border px-3 py-1 text-sm ${category === c.slug ? "bg-primary text-primary-foreground" : "bg-background"}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {products.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {filtered.map((p) => {
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
                      <div className="text-xs text-muted-foreground">
                        {p.gold_weight}g · {p.gold_purity}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}