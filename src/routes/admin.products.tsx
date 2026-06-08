import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { uploadProductImage } from "@/lib/api/storage";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsPage,
});

type ProductWithExtras = Product & {
  product_images?: { id: string; image_url: string; is_primary: boolean }[];
  categories?: { name: string; slug: string } | null;
};

type FormState = {
  product_name: string;
  sku: string;
  category_id: string;
  description: string;
  gold_purity: string;
  gold_weight: string;
  making_charges: string;
  stone_charges: string;
  stock: string;
  featured: boolean;
  status: boolean;
};

const emptyForm: FormState = {
  product_name: "",
  sku: "",
  category_id: "",
  description: "",
  gold_purity: "22K",
  gold_weight: "0",
  making_charges: "0",
  stone_charges: "0",
  stock: "0",
  featured: false,
  status: true,
};

function AdminProductsPage() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts() as Promise<ProductWithExtras[]>,
  });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductWithExtras | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFiles([]);
    setOpen(true);
  }

  function openEdit(p: ProductWithExtras) {
    setEditing(p);
    setForm({
      product_name: p.product_name,
      sku: p.sku,
      category_id: p.category_id ?? "",
      description: p.description ?? "",
      gold_purity: p.gold_purity ?? "22K",
      gold_weight: String(p.gold_weight),
      making_charges: String(p.making_charges),
      stone_charges: String(p.stone_charges),
      stock: String(p.stock),
      featured: p.featured,
      status: p.status,
    });
    setFiles([]);
    setOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        product_name: form.product_name.trim(),
        sku: form.sku.trim(),
        category_id: form.category_id || null,
        description: form.description.trim() || null,
        gold_purity: form.gold_purity,
        gold_weight: Number(form.gold_weight) || 0,
        making_charges: Number(form.making_charges) || 0,
        stone_charges: Number(form.stone_charges) || 0,
        stock: Number(form.stock) || 0,
        featured: form.featured,
        status: form.status,
      };
      if (!payload.product_name) throw new Error("Product name is required");
      if (!payload.sku) throw new Error("SKU is required");

      const product = editing
        ? await updateProduct(editing.id, payload)
        : await addProduct(payload);

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          const isPrimary = !editing && i === 0;
          await uploadProductImage(product.id, f, isPrimary);
        }
      }
      return product;
    },
    onSuccess: () => {
      toast.success(editing ? "Product updated" : "Product created");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      setDeleteId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteImage = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase.from("product_images").delete().eq("id", imageId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Image removed");
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-dark">Products</h1>
          <p className="text-sm text-muted-foreground">{products?.length ?? 0} products</p>
        </div>
        <Button onClick={openCreate} className="bg-gold text-primary-foreground hover:bg-gold/90">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Purity</th>
              <th className="p-3 text-right">Weight (g)</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && (products?.length ?? 0) === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No products yet.</td></tr>
            )}
            {products?.map((p) => {
              const primary = p.product_images?.find((i) => i.is_primary) ?? p.product_images?.[0];
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3">
                    {primary ? (
                      <img src={primary.image_url} alt={p.product_name} className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-xs text-muted-foreground">—</div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.product_name}</td>
                  <td className="p-3 text-muted-foreground">{p.sku}</td>
                  <td className="p-3">{p.categories?.name ?? "—"}</td>
                  <td className="p-3">{p.gold_purity ?? "—"}</td>
                  <td className="p-3 text-right">{Number(p.gold_weight).toFixed(2)}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Field label="Product Name *" className="sm:col-span-2">
              <Input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} required maxLength={200} />
            </Field>
            <Field label="SKU *">
              <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required maxLength={64} />
            </Field>
            <Field label="Category">
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={2000} />
            </Field>
            <Field label="Gold Purity">
              <Select value={form.gold_purity} onValueChange={(v) => setForm({ ...form, gold_purity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24K">24K</SelectItem>
                  <SelectItem value="22K">22K</SelectItem>
                  <SelectItem value="18K">18K</SelectItem>
                  <SelectItem value="14K">14K</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Gold Weight (g)">
              <Input type="number" min="0" step="0.001" value={form.gold_weight} onChange={(e) => setForm({ ...form, gold_weight: e.target.value })} />
            </Field>
            <Field label="Making Charges (₹)">
              <Input type="number" min="0" step="1" value={form.making_charges} onChange={(e) => setForm({ ...form, making_charges: e.target.value })} />
            </Field>
            <Field label="Stone Charges (₹)">
              <Input type="number" min="0" step="1" value={form.stone_charges} onChange={(e) => setForm({ ...form, stone_charges: e.target.value })} />
            </Field>
            <Field label="Stock Quantity">
              <Input type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </Field>
            <Field label="Flags">
              <div className="flex items-center gap-4 pt-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.status} onChange={(e) => setForm({ ...form, status: e.target.checked })} />
                  Active
                </label>
              </div>
            </Field>

            <div className="sm:col-span-2">
              <Label className="mb-2 block text-sm">Product Images</Label>
              {editing && editing.product_images && editing.product_images.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {editing.product_images.map((img) => (
                    <div key={img.id} className="group relative">
                      <img src={img.image_url} alt="" className="h-16 w-16 rounded border object-cover" />
                      <button
                        type="button"
                        onClick={() => deleteImage.mutate(img.id)}
                        className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 group-hover:opacity-100"
                        aria-label="Delete image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                <Upload className="h-4 w-4" />
                <span>{files.length > 0 ? `${files.length} file(s) ready` : "Click to add images"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
              </label>
            </div>

            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="bg-gold text-primary-foreground hover:bg-gold/90">
                {saveMutation.isPending ? "Saving…" : editing ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm">{label}</Label>
      {children}
    </div>
  );
}