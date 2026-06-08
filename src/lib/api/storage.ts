import { supabase } from "@/integrations/supabase/client";

type Bucket = "product-images" | "banner-images" | "certificates";

export async function uploadFile(bucket: Bucket, file: File, path?: string) {
  const ext = file.name.split(".").pop();
  const key = path ?? `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(key, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  // Buckets are private — issue a long-lived signed URL (10 years).
  const { data, error: signErr } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, 60 * 60 * 24 * 365 * 10);
  if (signErr) throw signErr;
  return { path: key, url: data.signedUrl };
}

export async function uploadProductImage(productId: string, file: File, isPrimary = false) {
  const { url } = await uploadFile("product-images", file, `${productId}/${crypto.randomUUID()}-${file.name}`);
  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, image_url: url, is_primary: isPrimary })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStorageFile(bucket: Bucket, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}