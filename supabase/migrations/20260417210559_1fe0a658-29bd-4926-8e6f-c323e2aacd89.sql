
-- Ticket replies (conversation between user & admin)
CREATE TABLE public.ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_type TEXT NOT NULL CHECK (author_type IN ('user', 'admin')),
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ticket_replies_ticket ON public.ticket_replies(ticket_id, created_at);
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read replies" ON public.ticket_replies
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can post replies" ON public.ticket_replies
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can delete replies" ON public.ticket_replies
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Invoices (created on checkout)
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no SERIAL UNIQUE NOT NULL,
  username TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_invoices_username ON public.invoices(username);
CREATE INDEX idx_invoices_created ON public.invoices(created_at DESC);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read invoices" ON public.invoices
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create invoices" ON public.invoices
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins update invoices" ON public.invoices
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete invoices" ON public.invoices
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
