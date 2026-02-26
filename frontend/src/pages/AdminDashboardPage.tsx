import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LayoutList, ClipboardList, LogOut, Zap } from "lucide-react";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.11 0.014 265) 0%, oklch(0.13 0.02 250) 50%, oklch(0.12 0.018 280) 100%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.28 0.025 265) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, oklch(0.68 0.14 195), oklch(0.62 0.16 285))",
              }}
            >
              <Zap className="w-5 h-5" style={{ color: "oklch(0.12 0.015 265)" }} />
            </div>
            <div>
              <h1
                className="font-display text-2xl font-medium"
                style={{ color: "oklch(0.90 0.01 265)" }}
              >
                Admin Dashboard
              </h1>
              <p className="text-xs" style={{ color: "oklch(0.45 0.015 265)" }}>
                DealDrop Management
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: "oklch(0.18 0.022 265)",
              border: "1px solid oklch(0.25 0.022 265)",
              color: "oklch(0.55 0.02 265)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.55 0.18 25 / 0.4)";
              e.currentTarget.style.color = "oklch(0.58 0.20 25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.25 0.022 265)";
              e.currentTarget.style.color = "oklch(0.55 0.02 265)";
            }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Nav cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            {
              icon: <LayoutList className="w-8 h-8" />,
              title: "Listings",
              description: "Manage your product listings, add new deals, and toggle visibility.",
              path: "/admin/listings" as const,
              accentR: "0.68",
              accentC: "0.14",
              accentH: "195",
            },
            {
              icon: <ClipboardList className="w-8 h-8" />,
              title: "Orders",
              description: "View and manage customer orders, update statuses, and track fulfillment.",
              path: "/admin/orders" as const,
              accentR: "0.62",
              accentC: "0.16",
              accentH: "285",
            },
          ].map(({ icon, title, description, path, accentR, accentC, accentH }) => {
            const accentColor = `oklch(${accentR} ${accentC} ${accentH})`;
            return (
              <button
                key={path}
                onClick={() => navigate({ to: path })}
                className="admin-nav-card text-left group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `oklch(${accentR} ${accentC} ${accentH} / 0.12)`,
                    color: accentColor,
                  }}
                >
                  {icon}
                </div>
                <h2
                  className="font-display text-xl font-medium mb-2"
                  style={{ color: "oklch(0.88 0.01 265)" }}
                >
                  {title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.48 0.015 265)" }}>
                  {description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
