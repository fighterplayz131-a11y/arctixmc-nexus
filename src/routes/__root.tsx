import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { StoreProvider } from "@/lib/store-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/PageTransition";

function NotFoundComponent() {
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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ArctixMC — Premium Minecraft Survival Server Store" },
      { name: "description", content: "Join ArctixMC, the ultimate Minecraft survival experience. Buy ranks, coins, and crate keys. IP: play.arctixmc.net" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@500;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Layout() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");
  return (
    <div className="flex min-h-screen flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        {isAdmin ? <Outlet /> : <PageTransition><Outlet /></PageTransition>}
      </main>
      {!isAdmin && <Footer />}
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

function RootComponent() {
  return (
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
}
