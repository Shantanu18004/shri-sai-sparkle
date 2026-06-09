
-- 1. Remove orders from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.orders;

-- 2. Restrict certificates bucket — split storage SELECT policy
DROP POLICY IF EXISTS "Public read storage assets" ON storage.objects;
CREATE POLICY "Public read product and banner images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = ANY (ARRAY['product-images'::text, 'banner-images'::text]));
CREATE POLICY "Admins read certificates"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3. Lock down internal SECURITY DEFINER trigger functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- 4. Replace always-true inquiry INSERT policy with input validation
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry"
  ON public.inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 200
    AND length(btrim(email)) BETWEEN 3 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(btrim(message)) BETWEEN 1 AND 5000
    AND (phone IS NULL OR length(phone) <= 50)
    AND status = 'new'
  );
