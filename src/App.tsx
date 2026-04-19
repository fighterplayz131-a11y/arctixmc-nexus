import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { StoreProvider, useStore } from "@/lib/store-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/PageTransition";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";

import HomePage from "@/pages/Home";
import StorePage from "@/pages/Store";
import CartPage from "@/pages/Cart";
import ProfilePage from "@/pages/Profile";
import TicketsPage from "@/pages/Tickets";
import AdminPage from "@/pages/Admin";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist or has been moved.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ReferralCapture() {
  const loc = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(loc.search);
    const ref = params.get("ref");
    if (ref) {
      try { localStorage.setItem("arctix:ref", ref); } catch { /* ignore */ }
    }
  }, [loc.search]);
  return null;
}

function ThemeApplier() {
  useEffect(() => {
    const saved = localStorage.getItem("arctix:theme");
    if (saved === "light") document.documentElement.classList.add("light");
    else document.documentElement.classList.remove("light");
  }, []);
  return null;
}

function Layout() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");
  const { username } = useStore();
  return (
    <WishlistProvider username={username}>
      <div className="flex min-h-screen flex-col">
        <ThemeApplier />
        <ReferralCapture />
        {!isAdmin && <AnnouncementBanner />}
        {!isAdmin && <Navbar />}
        <main className="flex-1">
          {isAdmin ? (
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          ) : (
            <PageTransition>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          )}
        </main>
        {!isAdmin && <Footer />}
        <Toaster position="top-right" theme="dark" />
      </div>
    </WishlistProvider>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
}
