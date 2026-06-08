import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getOrders, updateOrderStatus } from "@/lib/api/orders";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function AdminOrdersPage() {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: getOrders });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => { toast.success("Order updated"); qc.invalidateQueries({ queryKey: ["admin-orders"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-dark">Orders</h1>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Order #</th><th className="p-3">Customer</th><th className="p-3">Items</th>
              <th className="p-3 text-right">Total</th><th className="p-3">Status</th><th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && (orders?.length ?? 0) === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No orders yet.</td></tr>
            )}
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{o.order_number}</td>
                <td className="p-3">
                  <div className="font-medium">{o.customers?.name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{o.customers?.email}</div>
                </td>
                <td className="p-3 text-muted-foreground">{o.order_items?.length ?? 0}</td>
                <td className="p-3 text-right font-medium">₹{Number(o.total).toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <Select value={o.status} onValueChange={(v) => update.mutate({ id: o.id, status: v })}>
                    <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}