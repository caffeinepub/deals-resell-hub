import { useState, useMemo } from "react";
import { useActiveListings } from "@/hooks/useQueries";
import { Category } from "@/backend";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Package, TrendingDown, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const { data: listings = [], isLoading } = useActiveListings();

  const filteredListings = useMemo(() => {
    const nowNs = BigInt(Date.now()) * BigInt(1_000_000);
    const visible = listings.filter((l) => {
      if (
        (l.category === Category.flashSale || l.category === Category.quickSale) &&
        l.expiryTimestamp !== undefined &&
        l.expiryTimestamp !== null &&
        l.expiryTimestamp < nowNs
      ) {
        return false;
      }
      return true;
    });

    if (selectedCategory === "all") return visible;
    return visible.filter((l) => l.category === selectedCategory);
  }, [listings, selectedCategory]);

  const stats = useMemo(() => {
    const nowNs = BigInt(Date.now()) * BigInt(1_000_000);
    const active = listings.filter((l) => {
      if (
        (l.category === Category.flashSale || l.category === Category.quickSale) &&
        l.expiryTimestamp !== undefined &&
        l.expiryTimestamp !== null &&
        l.expiryTimestamp < nowNs
      )
        return false;
      return true;
    });
    const avgDiscount =
      active.length > 0
        ? Math.round(
            active.reduce(
              (sum, l) => sum + ((l.originalPrice - l.dealPrice) / l.originalPrice) * 100,
              0
            ) / active.length
          )
        : 0;
    const flashSales = active.filter(
      (l) => l.category === Category.flashSale || l.category === Category.quickSale
    ).length;
    return { total: active.length, avgDiscount, flashSales };
  }, [listings]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.015 265) 0%, oklch(0.14 0.025 250) 50%, oklch(0.13 0.02 280) 100%)",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(0.30 0.025 265) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "oklch(0.68 0.14 195)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "oklch(0.62 0.16 285)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: "oklch(0.68 0.14 195 / 0.1)",
                border: "1px solid oklch(0.68 0.14 195 / 0.25)",
                color: "oklch(0.68 0.14 195)",
              }}
            >
              <Zap className="w-3 h-3" />
              Curated Deals, Every Day
            </div>
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-tight mb-5"
              style={{ color: "oklch(0.93 0.01 265)" }}
            >
              Discover
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.68 0.14 195), oklch(0.62 0.16 285))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Exceptional
              </span>
              <br />
              Deals
            </h1>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "oklch(0.58 0.02 265)" }}
            >
              Premium products at unbeatable prices. Flash sales, exclusive offers, and curated loots — all in one place.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: <ShoppingBag className="w-4 h-4" />, value: stats.total, label: "Active Deals" },
                { icon: <TrendingDown className="w-4 h-4" />, value: `${stats.avgDiscount}%`, label: "Avg. Savings" },
                { icon: <Zap className="w-4 h-4" />, value: stats.flashSales, label: "Flash Sales" },
              ].map(({ icon, value, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "oklch(0.68 0.14 195 / 0.1)",
                      color: "oklch(0.68 0.14 195)",
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      className="text-lg font-semibold leading-none"
                      style={{ color: "oklch(0.90 0.01 265)" }}
                    >
                      {value}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "oklch(0.48 0.015 265)" }}>
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="divider-refined" />

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="mb-8">
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ background: "oklch(0.16 0.018 265)" }}
              >
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-24">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "oklch(0.18 0.022 265)" }}
            >
              <Package className="w-8 h-8" style={{ color: "oklch(0.38 0.02 265)" }} />
            </div>
            <h3
              className="font-display text-2xl font-medium mb-2"
              style={{ color: "oklch(0.65 0.02 265)" }}
            >
              No deals found
            </h3>
            <p className="text-sm" style={{ color: "oklch(0.42 0.015 265)" }}>
              {selectedCategory === "all"
                ? "Check back soon for new deals."
                : "No deals in this category right now."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
