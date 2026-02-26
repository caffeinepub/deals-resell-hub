import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Zap } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const appId = encodeURIComponent(window.location.hostname || "dealdrop-app");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.12 0.015 265)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.13 0.016 265 / 0.95)",
          borderColor: "oklch(0.22 0.02 265)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, oklch(0.68 0.14 195), oklch(0.62 0.16 285))",
                }}
              >
                <Zap className="w-4 h-4" style={{ color: "oklch(0.12 0.015 265)" }} />
              </div>
              <span
                className="font-display text-xl font-medium tracking-tight"
                style={{ color: "oklch(0.93 0.01 265)" }}
              >
                Deal<span style={{ color: "oklch(0.68 0.14 195)" }}>Drop</span>
              </span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: "oklch(0.65 0.02 265)" }}
                activeProps={{
                  style: {
                    color: "oklch(0.68 0.14 195)",
                    background: "oklch(0.68 0.14 195 / 0.08)",
                  },
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Deals</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-16"
        style={{
          borderColor: "oklch(0.20 0.02 265)",
          background: "oklch(0.11 0.014 265)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, oklch(0.68 0.14 195), oklch(0.62 0.16 285))",
                }}
              >
                <Zap className="w-3 h-3" style={{ color: "oklch(0.12 0.015 265)" }} />
              </div>
              <span className="font-display text-base font-medium" style={{ color: "oklch(0.55 0.02 265)" }}>
                DealDrop
              </span>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.42 0.015 265)" }}>
              © {new Date().getFullYear()} DealDrop. Built with{" "}
              <span style={{ color: "oklch(0.58 0.20 25)" }}>♥</span>{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200"
                style={{ color: "oklch(0.68 0.14 195)" }}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
