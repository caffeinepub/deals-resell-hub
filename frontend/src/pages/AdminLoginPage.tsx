import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useActor } from "@/hooks/useActor";
import { Loader2, Lock, Zap, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { actor } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pin.trim()) {
      setError("Please enter your PIN.");
      return;
    }
    if (!actor) {
      setError("Connection not ready. Please wait.");
      return;
    }
    setIsVerifying(true);
    try {
      // Validate PIN by attempting a protected backend call
      await actor.getAllOrders(pin);
      login(pin);
      navigate({ to: "/admin/dashboard" });
    } catch {
      setError("Invalid PIN. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "oklch(0.15 0.018 265)",
            border: "1px solid oklch(0.24 0.022 265)",
            boxShadow: "0 24px 80px oklch(0 0 0 / 0.5)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, oklch(0.68 0.14 195), oklch(0.62 0.16 285))",
                boxShadow: "0 8px 24px oklch(0.68 0.14 195 / 0.3)",
              }}
            >
              <ShieldCheck className="w-7 h-7" style={{ color: "oklch(0.12 0.015 265)" }} />
            </div>
            <h1
              className="font-display text-2xl font-medium"
              style={{ color: "oklch(0.90 0.01 265)" }}
            >
              Admin Access
            </h1>
            <p className="text-sm mt-1" style={{ color: "oklch(0.48 0.015 265)" }}>
              Enter your PIN to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs font-medium mb-2 uppercase tracking-widest"
                style={{ color: "oklch(0.50 0.02 265)" }}
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Security PIN
                </span>
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(""); }}
                placeholder="Enter PIN"
                autoFocus
                style={{
                  background: "oklch(0.18 0.02 265)",
                  border: `1px solid ${error ? "oklch(0.55 0.18 25 / 0.6)" : "oklch(0.28 0.025 265)"}`,
                  color: "oklch(0.90 0.01 265)",
                  borderRadius: "0.625rem",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  letterSpacing: "0.2em",
                  width: "100%",
                  outline: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "oklch(0.68 0.14 195 / 0.6)";
                  e.target.style.boxShadow = "0 0 0 3px oklch(0.68 0.14 195 / 0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error
                    ? "oklch(0.55 0.18 25 / 0.6)"
                    : "oklch(0.28 0.025 265)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {error && (
                <p
                  className="text-xs mt-2 flex items-center gap-1"
                  style={{ color: "oklch(0.58 0.20 25)" }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !actor}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "oklch(0.35 0.015 265)" }}>
          DealDrop Admin Panel
        </p>
      </div>
    </div>
  );
}
