import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGoldRates, updateGoldRate } from "@/lib/api/goldRates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/gold-rates")({
  component: AdminGoldRatesPage,
});

const PURITIES = ["24K", "22K", "18K", "14K"];

function AdminGoldRatesPage() {
  const qc = useQueryClient();
  const { data: rates } = useQuery({ queryKey: ["gold_rates"], queryFn: getGoldRates });
  const [values, setValues] = useState<Record<string, string>>({});

  const save = useMutation({
    mutationFn: ({ purity, rate }: { purity: string; rate: number }) => updateGoldRate(purity, rate),
    onSuccess: () => { toast.success("Gold rate updated"); qc.invalidateQueries({ queryKey: ["gold_rates"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl text-dark">Gold Rates</h1>
      <p className="mb-6 text-sm text-muted-foreground">Updates broadcast live to the storefront ticker.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {PURITIES.map((purity) => {
          const existing = rates?.find((r) => r.purity === purity);
          const value = values[purity] ?? (existing ? String(existing.rate_per_gram) : "");
          return (
            <div key={purity} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-xl text-gold">{purity}</div>
                <div className="text-xs text-muted-foreground">
                  {existing ? `Updated ${new Date(existing.updated_at).toLocaleString()}` : "Not set"}
                </div>
              </div>
              <Label className="mt-4 block text-xs">Rate per gram (₹)</Label>
              <div className="mt-1 flex gap-2">
                <Input
                  type="number" min="0" step="1" value={value}
                  onChange={(e) => setValues({ ...values, [purity]: e.target.value })}
                />
                <Button
                  className="bg-gold text-primary-foreground hover:bg-gold/90"
                  disabled={!value || save.isPending}
                  onClick={() => save.mutate({ purity, rate: Number(value) })}
                >Save</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}