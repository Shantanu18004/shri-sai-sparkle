import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/api/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; slug: string; description: string | null; image_url: string | null } | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "" });

  function openCreate() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image_url: "" });
    setOpen(true);
  }

  function openEdit(c: NonNullable<typeof categories>[number]) {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      image_url: c.image_url ?? "",
    });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
      };
      if (!payload.name) throw new Error("Name required");
      if (editing) return updateCategory(editing.id, payload);
      return addCategory(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Created");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["categories"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-dark">Categories</h1>
        <Button onClick={openCreate} className="bg-gold text-primary-foreground hover:bg-gold/90">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Description</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {categories?.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.slug}</td>
                <td className="p-3 text-muted-foreground">{c.description ?? "—"}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => remove.mutate(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-gold text-primary-foreground hover:bg-gold/90">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}