
-- 1) Move pg_net from public to extensions schema (DROP + CREATE since SET SCHEMA is unsupported)
CREATE SCHEMA IF NOT EXISTS extensions;
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION pg_net WITH SCHEMA extensions;

-- Re-schedule the cron job using the fully-qualified function
SELECT cron.unschedule('update-gold-rates-every-5min')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'update-gold-rates-every-5min');

SELECT cron.schedule(
  'update-gold-rates-every-5min',
  '*/5 * * * *',
  $$
  SELECT extensions.http_post(
    url := 'https://shri-sai-sparkle.lovable.app/api/public/hooks/update-gold-rates',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- 2) Default-deny realtime.messages (we don't use broadcast/presence)
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny all realtime messages select" ON realtime.messages;
DROP POLICY IF EXISTS "Deny all realtime messages insert" ON realtime.messages;

CREATE POLICY "Deny all realtime messages select"
  ON realtime.messages FOR SELECT TO authenticated, anon
  USING (false);

CREATE POLICY "Deny all realtime messages insert"
  ON realtime.messages FOR INSERT TO authenticated, anon
  WITH CHECK (false);
