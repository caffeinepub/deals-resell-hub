import { Link } from "@tanstack/react-router";
import { Category, Listing } from "@/backend";
import CountdownTimer from "./CountdownTimer";
import { Tag, TrendingDown } from "lucide-react";

interface ProductCardProps {
  listing: Listing;
}

const categoryConfig: Record<Category, { label: string; className: string }> = {
  [Category.deal]: { label: "Deal", className: "category-badge-deal" },
  [Category.loot]: { label: "Loot", className: "category-badge-loot" },
  [Category.offer]: { label: "Offer", className: "category-badge-offer" },
  [Category.flashSale]: { label: "Flash Sale", className: "category-badge-flashSale" },
  [Category.quickSale]: { label: "Quick Sale", className: "category-badge-quickSale" },
  [Category.resell]: { label: "Resell", className: "category-badge-resell" },
};

export default function ProductCard({ listing }: ProductCardProps) {
  const discountPercent = Math.round(
    ((listing.originalPrice - listing.dealPrice) / listing.originalPrice) * 100
  );

  const isTimedSale =
    listing.category === Category.flashSale ||
    listing.category === Category.quickSale;

  const isExpired =
    isTimedSale &&
    listing.expiryTimestamp !== undefined &&
    listing.expiryTimestamp !== null &&
    Number(listing.expiryTimestamp) < Date.now() * 1_000_000;

  const isOutOfStock = Number(listing.stockQuantity) === 0;
  const catConfig = categoryConfig[listing.category];

  return (
    <div className="deal-card group relative flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "oklch(0.18 0.022 265)" }}
          >
            <Tag className="w-10 h-10" style={{ color: "oklch(0.35 0.025 265)" }} />
          </div>
        )}

        {/* Overlay for expired/out-of-stock */}
        {(isExpired || isOutOfStock) && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "oklch(0.10 0.012 265 / 0.75)" }}
          >
            <span
              className="deal-badge px-3 py-1.5 rounded-lg"
              style={{
                background: "oklch(0.20 0.02 265)",
                color: "oklch(0.55 0.02 265)",
                border: "1px solid oklch(0.28 0.025 265)",
              }}
            >
              {isExpired ? "Expired" : "Out of Stock"}
            </span>
          </div>
        )}

        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3">
            <span className="discount-badge flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {discountPercent}% off
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`deal-badge px-2 py-1 rounded-md ${catConfig.className}`}
          >
            {catConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Countdown */}
        {isTimedSale && listing.expiryTimestamp && !isExpired && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: "oklch(0.58 0.20 25 / 0.08)",
              border: "1px solid oklch(0.58 0.20 25 / 0.2)",
            }}
          >
            <span
              className="text-xs font-medium"
              style={{ color: "oklch(0.58 0.20 25)" }}
            >
              Ends in
            </span>
            <CountdownTimer
              expiryTimestamp={listing.expiryTimestamp}
              compact
            />
          </div>
        )}

        {/* Title */}
        <h3
          className="font-display text-lg font-medium leading-snug line-clamp-2"
          style={{ color: "oklch(0.90 0.01 265)" }}
        >
          {listing.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span
            className="text-xl font-semibold"
            style={{ color: "oklch(0.68 0.14 195)" }}
          >
            ₹{listing.dealPrice.toLocaleString()}
          </span>
          {listing.originalPrice > listing.dealPrice && (
            <span
              className="text-sm line-through"
              style={{ color: "oklch(0.42 0.015 265)" }}
            >
              ₹{listing.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs"
            style={{
              color:
                Number(listing.stockQuantity) > 5
                  ? "oklch(0.65 0.18 160)"
                  : Number(listing.stockQuantity) > 0
                  ? "oklch(0.78 0.14 80)"
                  : "oklch(0.55 0.18 25)",
            }}
          >
            {Number(listing.stockQuantity) > 0
              ? `${listing.stockQuantity} in stock`
              : "Out of stock"}
          </span>
        </div>

        {/* CTA */}
        <Link
          to="/listing/$id"
          params={{ id: listing.id }}
          className="btn-primary text-center mt-1 block"
          style={
            isExpired || isOutOfStock
              ? { opacity: 0.4, pointerEvents: "none" }
              : {}
          }
        >
          View Deal
        </Link>
      </div>
    </div>
  );
}
