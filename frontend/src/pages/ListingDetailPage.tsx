import { useParams, useNavigate } from "@tanstack/react-router";
import { useListing } from "@/hooks/useQueries";
import { Category } from "@/backend";
import CountdownTimer from "@/components/CountdownTimer";
import OrderForm from "@/components/OrderForm";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Tag, TrendingDown, Package, Clock } from "lucide-react";

const categoryConfig: Record<Category, { label: string; colorClass: string }> = {
  [Category.deal]: { label: "Deal", colorClass: "category-badge-deal" },
  [Category.loot]: { label: "Loot", colorClass: "category-badge-loot" },
  [Category.offer]: { label: "Offer", colorClass: "category-badge-offer" },
  [Category.flashSale]: { label: "Flash Sale", colorClass: "category-badge-flashSale" },
  [Category.quickSale]: { label: "Quick Sale", colorClass: "category-badge-quickSale" },
  [Category.resell]: { label: "Resell", colorClass: "category-badge-resell" },
};

export default function ListingDetailPage() {
  const { id } = useParams({ from: "/public-layout/listing/$id" });
  const navigate = useNavigate();
  const { data: listing, isLoading, isError } = useListing(id);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "oklch(0.18 0.022 265)" }}
        >
          <Package className="w-8 h-8" style={{ color: "oklch(0.38 0.02 265)" }} />
        </div>
        <h2 className="font-display text-2xl font-medium mb-2" style={{ color: "oklch(0.65 0.02 265)" }}>
          Listing not found
        </h2>
        <p className="text-sm mb-6" style={{ color: "oklch(0.42 0.015 265)" }}>
          This deal may have expired or been removed.
        </p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Deals
        </button>
      </div>
    );
  }

  const discountPercent =
    listing.originalPrice > 0
      ? Math.round(((listing.originalPrice - listing.dealPrice) / listing.originalPrice) * 100)
      : 0;

  const isTimedSale =
    listing.category === Category.flashSale || listing.category === Category.quickSale;

  const nowNs = BigInt(Date.now()) * BigInt(1_000_000);
  const isExpired =
    isTimedSale &&
    listing.expiryTimestamp !== undefined &&
    listing.expiryTimestamp !== null &&
    listing.expiryTimestamp < nowNs;

  const isOutOfStock = Number(listing.stockQuantity) === 0;
  const catConfig = categoryConfig[listing.category];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <button
        onClick={() => navigate({ to: "/" })}
        className="flex items-center gap-2 text-sm mb-8 transition-colors duration-200"
        style={{ color: "oklch(0.50 0.02 265)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.68 0.14 195)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.50 0.02 265)")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deals
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Image */}
        <div>
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.16 0.018 265)",
              border: "1px solid oklch(0.25 0.022 265)",
              aspectRatio: "1/1",
            }}
          >
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag className="w-16 h-16" style={{ color: "oklch(0.30 0.02 265)" }} />
              </div>
            )}

            {/* Discount badge */}
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4">
                <span className="discount-badge flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {discountPercent}% off
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Category + status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`deal-badge px-2.5 py-1 rounded-md ${catConfig.colorClass}`}>
              {catConfig.label}
            </span>
            {isExpired && (
              <span
                className="deal-badge px-2.5 py-1 rounded-md"
                style={{
                  background: "oklch(0.20 0.02 265)",
                  color: "oklch(0.50 0.02 265)",
                  border: "1px solid oklch(0.28 0.025 265)",
                }}
              >
                Expired
              </span>
            )}
            {isOutOfStock && !isExpired && (
              <span
                className="deal-badge px-2.5 py-1 rounded-md"
                style={{
                  background: "oklch(0.55 0.18 25 / 0.1)",
                  color: "oklch(0.58 0.20 25)",
                  border: "1px solid oklch(0.55 0.18 25 / 0.3)",
                }}
              >
                Out of Stock
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="font-display text-3xl md:text-4xl font-medium leading-tight"
            style={{ color: "oklch(0.93 0.01 265)" }}
          >
            {listing.title}
          </h1>

          {/* Countdown */}
          {isTimedSale && listing.expiryTimestamp && !isExpired && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "oklch(0.58 0.20 25 / 0.06)",
                border: "1px solid oklch(0.58 0.20 25 / 0.2)",
              }}
            >
              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.58 0.20 25)" }} />
              <div>
                <p className="text-xs mb-1.5" style={{ color: "oklch(0.58 0.20 25)" }}>
                  Sale ends in
                </p>
                <CountdownTimer expiryTimestamp={listing.expiryTimestamp} />
              </div>
            </div>
          )}

          {/* Pricing */}
          <div
            className="flex items-baseline gap-3 px-4 py-4 rounded-xl"
            style={{
              background: "oklch(0.16 0.018 265)",
              border: "1px solid oklch(0.25 0.022 265)",
            }}
          >
            <span
              className="text-3xl font-semibold"
              style={{ color: "oklch(0.68 0.14 195)" }}
            >
              ₹{listing.dealPrice.toLocaleString()}
            </span>
            {listing.originalPrice > listing.dealPrice && (
              <>
                <span
                  className="text-lg line-through"
                  style={{ color: "oklch(0.40 0.015 265)" }}
                >
                  ₹{listing.originalPrice.toLocaleString()}
                </span>
                <span
                  className="text-sm font-medium px-2 py-0.5 rounded-md"
                  style={{
                    background: "oklch(0.65 0.18 160 / 0.12)",
                    color: "oklch(0.65 0.18 160)",
                  }}
                >
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" style={{ color: "oklch(0.45 0.02 265)" }} />
            <span
              className="text-sm"
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
                ? `${listing.stockQuantity} units available`
                : "Out of stock"}
            </span>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <hr className="divider-refined mb-4" />
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.58 0.02 265)" }}
              >
                {listing.description}
              </p>
            </div>
          )}

          {/* Order form */}
          {!isExpired && !isOutOfStock && (
            <div>
              <hr className="divider-refined mb-5" />
              <h2
                className="font-display text-xl font-medium mb-4"
                style={{ color: "oklch(0.85 0.01 265)" }}
              >
                Place Your Order
              </h2>
              <OrderForm listing={listing} />
            </div>
          )}

          {(isExpired || isOutOfStock) && (
            <div
              className="px-4 py-3 rounded-xl text-sm text-center"
              style={{
                background: "oklch(0.18 0.022 265)",
                border: "1px solid oklch(0.28 0.025 265)",
                color: "oklch(0.50 0.02 265)",
              }}
            >
              {isExpired ? "This deal has expired." : "This item is currently out of stock."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
