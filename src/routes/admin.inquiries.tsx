import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getInquiries, updateInquiryStatus } from "@/lib/api/inquiries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiriesPage,
});

const STATUSES = ["new", "in_progress", "resolved", "closed"];

function AdminInquiriesPage() {
  const qc = useQueryClient();
  const { data: inquiries, isLoading } = useQuery({ queryKey: ["admin-inquiries"], queryFn: getInquiries });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateInquiryStatus(id, status),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-inquiries"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-dark">Inquiries</h1>
      <div className="space-y-3">
        {isLoading && <div className="text-muted-foreground">Loading…</div>}
        {!isLoading && (inquiries?.length ?? 0) === 0 && <div className="text-muted-foreground">No inquiries yet.</div>}
        {inquiries?.map((i) => (
          <div key={i.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.email} {i.phone && `· ${i.phone}`}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString()}</span>
                <Select value={i.status} onValueChange={(v) => update.mutate({ id: i.id, status: v })}>
                  <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{i.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}