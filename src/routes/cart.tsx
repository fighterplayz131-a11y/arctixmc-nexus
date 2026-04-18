import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Tag, Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { LoginDialog } from "@/components/LoginDialog";
import { toast } from "sonner";
import { validateCoupon, applyCoupon, type Coupon } from "@/lib/coupons";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — ArctixMC" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, removeFromCart, updateQuantity, username, clearCart } = useStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function handleCheckout() {
    if (!username) { setLoginOpen(true); return; }
    setCheckoutOpen(true);
  }

  async function placeOrder() {
    if (!username) return;
    setSubmitting(true);
    const itemLines = cart.map((i) => `• ${i.name} × ${i.quantity} — रु ${i.price * i.quantity}`).join("\n");
    const description = `Order placed by ${username}\n\nItems:\n${itemLines}\n\nTotal: रु ${total}\n\nPlease deliver these items in-game.`;
    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({
        username,
        category: "Purchase Issue",
        subject: `Order — ${cart.length} item${cart.length > 1 ? "s" : ""} (रु ${total})`,
        description,
        priority: "normal",
      })
      .select("id,ticket_no")
      .single();
    if (error || !ticket) {
      setSubmitting(false);
      toast.error("Could not create order ticket. Please try again.");
      return;
    }
    // Also create invoice record
    await supabase.from("invoices").insert({
      username,
      items: cart.map((i) => ({ id: i.id, name: i.name, type: i.type, price: i.price, quantity: i.quantity })),
      total,
      status: "pending",
      ticket_id: ticket.id,
    });
    setSubmitting(false);
    toast.success(`Order placed! Ticket #${ticket.ticket_no} created.`);
    clearCart();
    setCheckoutOpen(false);
    navigate({ to: "/tickets" });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-12 animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="rounded-xl bg-card/70 border border-border p-12 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display text-xl font-bold mb-2">Cart is empty</h2>
          <p className="text-muted-foreground mb-5 text-sm">Looks like you haven't added anything yet.</p>
          <Link to="/store"><Button className="gradient-primary text-primary-foreground">Browse Store</Button></Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="rounded-lg bg-card/80 border border-border p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shrink-0">
                  {item.type === "rank" ? "R" : item.type === "coins" ? "C" : "K"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">रु {item.price} each</div>
                </div>
                <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                </div>
                <div className="font-bold text-foreground w-20 text-right text-sm">रु {item.price * item.quantity}</div>
                <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-card/80 border border-border p-5 h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-lg font-bold mb-4 text-foreground">Order Summary</h3>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>रु {total}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-baseline mb-5">
              <span className="font-semibold">Total</span>
              <span className="font-display text-xl font-bold text-foreground">रु {total}</span>
            </div>
            <Button onClick={handleCheckout} className="w-full gradient-primary text-primary-foreground h-10">
              <CreditCard className="h-4 w-4 mr-2" /> Checkout
            </Button>
            {!username && <p className="text-xs text-muted-foreground text-center mt-3">Login required to checkout</p>}
            <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
              On checkout, a support ticket is auto-created so staff can deliver your items in-game.
            </p>
          </div>
        </div>
      )}

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider">Confirm Order</DialogTitle>
            <DialogDescription>A support ticket will be created automatically with your order details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md bg-muted/50 p-3 flex justify-between">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="font-medium">{username}</span>
            </div>
            <div className="rounded-md bg-muted/50 p-3 space-y-2">
              {cart.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.name} × {i.quantity}</span>
                  <span className="text-primary">रु {i.price * i.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-baseline px-1">
              <span className="font-semibold">Total</span>
              <span className="font-display text-lg font-bold text-foreground">रु {total}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCheckoutOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={placeOrder} disabled={submitting} className="gradient-primary text-primary-foreground">
              {submitting ? "Placing…" : "Place Order & Open Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
