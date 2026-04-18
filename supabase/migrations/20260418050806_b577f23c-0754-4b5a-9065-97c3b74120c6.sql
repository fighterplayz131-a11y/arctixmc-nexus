-- Ticket attachments
CREATE TABLE public.ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.ticket_replies(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read attachments" ON public.ticket_attachments FOR SELECT USING (true);
CREATE POLICY "Anyone upload attachments" ON public.ticket_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins delete attachments" ON public.ticket_attachments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Coupons
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percent', -- 'percent' | 'fixed'
  discount_value NUMERIC NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read redemptions" ON public.coupon_redemptions FOR SELECT USING (true);
CREATE POLICY "Anyone create redemptions" ON public.coupon_redemptions FOR INSERT WITH CHECK (true);

-- Daily rewards claims
CREATE TABLE public.daily_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  reward_type TEXT NOT NULL DEFAULT 'coins',
  amount INTEGER NOT NULL DEFAULT 100,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_daily_rewards_user_time ON public.daily_rewards(username, claimed_at DESC);
ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read daily rewards" ON public.daily_rewards FOR SELECT USING (true);
CREATE POLICY "Anyone claim daily rewards" ON public.daily_rewards FOR INSERT WITH CHECK (true);

-- Flash sales
CREATE TABLE public.flash_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER NOT NULL DEFAULT 10,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read flash sales" ON public.flash_sales FOR SELECT USING (true);
CREATE POLICY "Admins manage flash sales" ON public.flash_sales FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Bundles
CREATE TABLE public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read bundles" ON public.bundles FOR SELECT USING (true);
CREATE POLICY "Admins manage bundles" ON public.bundles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Wishlist
CREATE TABLE public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (username, item_id)
);
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read wishlist" ON public.wishlist FOR SELECT USING (true);
CREATE POLICY "Anyone manage wishlist" ON public.wishlist FOR ALL USING (true) WITH CHECK (true);

-- Player profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  loyalty_points INTEGER NOT NULL DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone create profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update profiles" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  variant TEXT NOT NULL DEFAULT 'info',
  active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_username TEXT NOT NULL,
  referred_username TEXT NOT NULL,
  reward_granted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (referrer_username, referred_username)
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read referrals" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Anyone create referrals" ON public.referrals FOR INSERT WITH CHECK (true);

-- Loyalty ledger
CREATE TABLE public.loyalty_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.loyalty_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read loyalty ledger" ON public.loyalty_ledger FOR SELECT USING (true);
CREATE POLICY "Anyone insert loyalty ledger" ON public.loyalty_ledger FOR INSERT WITH CHECK (true);

-- Storage bucket for ticket files
INSERT INTO storage.buckets (id, name, public, file_size_limit) VALUES ('ticket-files', 'ticket-files', true, 20971520) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public read ticket files" ON storage.objects FOR SELECT USING (bucket_id = 'ticket-files');
CREATE POLICY "Anyone upload ticket files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ticket-files');
CREATE POLICY "Admins delete ticket files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ticket-files' AND has_role(auth.uid(), 'admin'));