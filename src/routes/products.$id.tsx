import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getProductById, getProductPrice } from "@/lib/api/products";
import { subscribeToGoldRates } from "@/lib/api/realtime";

export const Route = createFileRoute("/products/$id")({
  head: () => ({ meta: [{ title: "Product — Shri Sai Jewellers" }] }),
  component: ProductDetail,
  errorComponent: ({ error }) => <div className="p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="p-8">
      Product not found. <Link to="/products" className="text-primary underline">Back to products</Link>
    </div>
  ),
});

const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function ProductDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const product = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const p = await getProductById(id);
      if (!p) throw notFound();
      return p;
    },
  });
  const price = useQuery({
    queryKey: ["product-price", id],
    queryFn: () => getProductPrice(id),
  });

  useEffect(() => {
    return subscribeToGoldRates(() => {
      qc.invalidateQueries({ queryKey: ["product-price", id] });
      qc.invalidateQueries({ queryKey: ["gold_rates"] });
    });
  }, [qc, id]);

  const images: { id: string; image_url: string }[] = (product.data as any)?.product_images ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {product.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !product.data ? (
          <p className="text-sm text-muted-foreground">Product not found.</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                {active?.image_url ? (
                  <img src={active.image_url} alt={product.data.product_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveIdx(i)}
                      className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${i === activeIdx ? "border-primary" : "border-transparent"}`}
                    >
                      <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {(product.data as any).categories?.name ?? "Jewellery"}
              </div>
              <h1 className="mt-1 text-3xl font-semibold">{product.data.product_name}</h1>
              <div className="mt-1 text-sm text-muted-foreground">SKU: {product.data.sku}</div>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border bg-card p-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="font-medium">{product.data.gold_weight} g</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Purity</dt>
                  <dd className="font-medium">{product.data.gold_purity ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Making Charges</dt>
                  <dd className="font-medium">{fmt(product.data.making_charges)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Stone Charges</dt>
                  <dd className="font-medium">{fmt(product.data.stone_charges)}</dd>
                </div>
              </dl>

              <div className="mt-6 rounded-lg border bg-card p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Live Price Breakdown
                </div>
                {price.isLoading || !price.data ? (
                  <p className="mt-2 text-sm text-muted-foreground">Calculating…</p>
                ) : (
                  <div className="mt-3 space-y-1.5 text-sm">
                    <Row label={`Gold (${product.data.gold_weight}g × rate)`} value={fmt(price.data.gold_value)} />
                    <Row label="Making Charges" value={fmt(price.data.making_charges)} />
                    <Row label="Stone Charges" value={fmt(price.data.stone_charges)} />
                    <div className="my-2 border-t" />
                    <Row label="Subtotal" value={fmt(price.data.subtotal)} />
                    <Row label="GST (3%)" value={fmt(price.data.gst)} />
                    <div className="my-2 border-t" />
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-semibold text-primary">{fmt(price.data.total)}</span>
                    </div>
                  </div>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Price updates live with the current gold rate.
                </p>
              </div>

              {product.data.description && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold">Description</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{product.data.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}