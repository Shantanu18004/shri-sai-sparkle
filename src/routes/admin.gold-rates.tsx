import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGoldRates, updateGoldRate, setManualOverride } from "@/lib/api/goldRates";
import { subscribeToGoldRates } from "@/lib/api/realtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/gold-rates")({
  component: AdminGoldRatesPage,
});

const PURITIES = ["24K", "22K", "18K"];

function AdminGoldRatesPage() {
  const qc = useQueryClient();
  const { data: rates } = useQuery({ queryKey: ["gold_rates"], queryFn: getGoldRates });
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => subscribeToGoldRates(() => qc.invalidateQueries({ queryKey: ["gold_rates"] })), [qc]);

  const save = useMutation({
    mutationFn: ({ purity, rate }: { purity: string; rate: number }) => updateGoldRate(purity, rate, true),
    onSuccess: () => { toast.success("Manual rate saved & override locked"); qc.invalidateQueries({ queryKey: ["gold_rates"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleManual = useMutation({
    mutationFn: ({ purity, is_manual }: { purity: string; is_manual: boolean }) => setManualOverride(purity, is_manual),
    onSuccess: (_d, v) => {
      toast.success(v.is_manual ? "Manual override enabled" : "Auto-update enabled");
      qc.invalidateQueries({ queryKey: ["gold_rates"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const refreshNow = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/public/hooks/update-gold-rates", { method: "POST" });
      if (!res.ok) throw new Error(`Refresh failed (${res.status})`);
      return res.json();
    },
    onSuccess: () => { toast.success("Live rates refreshed from Gold API"); qc.invalidateQueries({ queryKey: ["gold_rates"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="mb-1 font-serif text-3xl text-dark">Gold Rates</h1>
          <p className="text-sm text-muted-foreground">
            Auto-refreshed every 5 min from gold-api.com. Enable manual override to lock a Kanpur-specific price.
          </p>
        </div>
        <Button
          onClick={() => refreshNow.mutate()}
          disabled={refreshNow.isPending}
          className="bg-gold text-primary-foreground hover:bg-gold/90"
        >
          {refreshNow.isPending ? "Refreshing…" : "Refresh from API now"}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PURITIES.map((purity) => {
          const existing = rates?.find((r) => r.purity === purity);
          const value = values[purity] ?? (existing ? String(existing.rate_per_gram) : "");
          const isManual = !!existing?.is_manual;
          return (
            <div key={purity} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-xl text-gold">{purity}</div>
                <div className="text-xs text-muted-foreground">
                  {existing ? `Updated ${new Date(existing.updated_at).toLocaleString()}` : "Not set"}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-background/50 px-3 py-2">
                <div>
                  <div className="text-xs font-medium">Manual override</div>
                  <div className="text-[11px] text-muted-foreground">
                    {isManual ? "Locked — auto-updates skip this purity" : "Auto-updating from Gold API"}
                  </div>
                </div>
                <Switch
                  checked={isManual}
                  disabled={!existing || toggleManual.isPending}
                  onCheckedChange={(checked) => toggleManual.mutate({ purity, is_manual: checked })}
                />
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
                >Save &amp; Lock</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}