import { supabase } from "@/integrations/supabase/client";

export type Coupon = {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  active: boolean;
};

export async function validateCoupon(code: string): Promise<{ ok: true; coupon: Coupon; discount: number } | { ok: false; error: string }> {
  if (!code.trim()) return { ok: false, error: "Enter a coupon code" };
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", code.trim())
    .maybeSingle();
  if (error || !data) return { ok: false, error: "Coupon not found" };
  const c = data as Coupon;
  if (!c.active) return { ok: false, error: "Coupon is inactive" };
  if (c.expires_at && new Date(c.expires_at) < new Date()) return { ok: false, error: "Coupon expired" };
  if (c.max_uses != null && c.used_count >= c.max_uses) return { ok: false, error: "Coupon usage limit reached" };
  return { ok: true, coupon: c, discount: 0 };
}

export function applyCoupon(coupon: Coupon, total: number): number {
  if (coupon.discount_type === "percent") {
    return Math.round((total * coupon.discount_value) / 100);
  }
  return Math.min(total, coupon.discount_value);
}
