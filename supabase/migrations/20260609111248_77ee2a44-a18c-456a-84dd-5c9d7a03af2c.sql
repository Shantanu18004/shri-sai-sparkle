ALTER TABLE public.gold_rates ADD COLUMN IF NOT EXISTS is_manual boolean NOT NULL DEFAULT false;

-- Seed rows for purities we display (no-op if already present)
INSERT INTO public.gold_rates (purity, rate_per_gram, is_manual)
VALUES ('24K', 0, false), ('22K', 0, false), ('18K', 0, false)
ON CONFLICT (purity) DO NOTHING;