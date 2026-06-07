
-- Fix mutable search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- calculate_product_price only reads public tables; downgrade to INVOKER
CREATE OR REPLACE FUNCTION public.calculate_product_price(_product_id uuid)
RETURNS TABLE (
  product_id uuid,
  gold_value numeric,
  making_charges numeric,
  stone_charges numeric,
  subtotal numeric,
  gst numeric,
  total numeric
)
LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public AS $$
DECLARE
  p record;
  rate numeric := 0;
  gv numeric := 0;
  sub numeric := 0;
  gst_amt numeric := 0;
BEGIN
  SELECT * INTO p FROM public.products WHERE id = _product_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT rate_per_gram INTO rate FROM public.gold_rates
    WHERE purity = p.gold_purity ORDER BY updated_at DESC LIMIT 1;
  rate := COALESCE(rate, 0);

  gv := p.gold_weight * rate;
  sub := gv + p.making_charges + p.stone_charges;
  gst_amt := round(sub * 0.03, 2);

  RETURN QUERY SELECT
    p.id, gv, p.making_charges, p.stone_charges, sub, gst_amt, sub + gst_amt;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.calculate_product_price(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.calculate_product_price(uuid) TO authenticated;

-- Storage RLS: public read; admin write across the 3 buckets
CREATE POLICY "Public read storage assets" ON storage.objects
  FOR SELECT USING (bucket_id IN ('product-images','banner-images','certificates'));

CREATE POLICY "Admins upload storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('product-images','banner-images','certificates')
             AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update storage" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('product-images','banner-images','certificates')
         AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id IN ('product-images','banner-images','certificates')
              AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('product-images','banner-images','certificates')
         AND public.has_role(auth.uid(),'admin'));
