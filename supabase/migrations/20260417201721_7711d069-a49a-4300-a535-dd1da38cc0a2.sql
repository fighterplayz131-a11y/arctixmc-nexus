-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;$$;

-- Store config (single row)
CREATE TABLE public.store_config (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
ALTER TABLE public.store_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read store config" ON public.store_config
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update store config" ON public.store_config
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert store config" ON public.store_config
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_store_config_updated
  BEFORE UPDATE ON public.store_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.store_config (id,data) VALUES (1,'{}'::jsonb);

-- Tickets
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no SERIAL UNIQUE,
  username TEXT NOT NULL,
  contact TEXT,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can create tickets" ON public.tickets
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can read tickets" ON public.tickets
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update tickets" ON public.tickets
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete tickets" ON public.tickets
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE INDEX idx_tickets_username ON public.tickets(lower(username));
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for rank images
INSERT INTO storage.buckets (id,name,public) VALUES ('rank-images','rank-images',true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Rank images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'rank-images');
CREATE POLICY "Admins upload rank images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'rank-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update rank images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'rank-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete rank images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'rank-images' AND public.has_role(auth.uid(),'admin'));

-- Auto-grant admin role on signup for the configured admin email
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'admin@arctixmc.net' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;$$;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();