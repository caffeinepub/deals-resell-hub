import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAllListings, useToggleListingActive } from "@/hooks/useQueries";
import { Category, Listing } from "@/backend";
import AddListingForm from "@/components/AddListingForm";
import EditListingForm from "@/components/EditListingForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Eye, EyeOff, Pencil, Zap, Package, Loader2 } from "lucide-react";

const categoryLabels: Record<Category, string> = {
  [Category.deal]: "Deal",
  [Category.loot]: "Loot",
  [Category.offer]: "Offer",
  [Category.flashSale]: "Flash Sale",
  [Category.quickSale]: "Quick Sale",
  [Category.resell]: "Resell",
};

export default function ListingsManagementPage() {
  const navigate = useNavigate();
  const { pin } = useAdminAuth();
  const { data: listings = [], isLoading } = useAllListings();
  const toggleActive = useToggleListingActive();

  const [addOpen, setAddOpen] = useState(false);
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    if (!pin) return;
    setTogglingId(id);
    try {
      await toggleActive.mutateAsync({ id, pin });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.11 0.014 265) 0%, oklch(0.13 0.02 250) 50%, oklch(0.12 0.018 280) 100%)",
      }}
    >
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.28 0.025 265) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: "/admin/dashboard" })}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: "oklch(0.18 0.022 265)",
                border: "1px solid oklch(0.25 0.022 265)",
                color: "oklch(0.55 0.02 265)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "oklch(0.68 0.14 195)";
                e.currentTarget.style.borderColor = "oklch(0.68 0.14 195 / 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "oklch(0.55 0.02 265)";
                e.currentTarget.style.borderColor = "oklch(0.25 0.022 265)";
              }}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1
                className="font-display text-2xl font-medium"
                style={{ color: "oklch(0.90 0.01 265)" }}
              >
                Listings
              </h1>
              <p className="text-xs" style={{ color: "oklch(0.45 0.015 265)" }}>
                {listings.length} total
              </p>
            </div>
          </div>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Listing
              </button>
            </DialogTrigger>
            <DialogContent
              className="max-w-lg max-h-[90vh] overflow-y-auto"
              style={{
                background: "oklch(0.15 0.018 265)",
                border: "1px solid oklch(0.24 0.022 265)",
              }}
            >
              <DialogHeader>
                <DialogTitle
                  className="font-display text-xl font-medium"
                  style={{ color: "oklch(0.90 0.01 265)" }}
                >
                  New Listing
                </DialogTitle>
              </DialogHeader>
              <AddListingForm onSuccess={() => setAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.15 0.018 265)",
            border: "1px solid oklch(0.22 0.02 265)",
          }}
        >
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="w-10 h-10 mx-auto mb-3" style={{ color: "oklch(0.35 0.02 265)" }} />
              <p className="text-sm" style={{ color: "oklch(0.45 0.015 265)" }}>
                No listings yet. Add your first deal!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid oklch(0.22 0.02 265)",
                      background: "oklch(0.13 0.016 265)",
                    }}
                  >
                    {["Title", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-widest"
                        style={{ color: "oklch(0.45 0.015 265)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="table-row-refined"
                      style={{ borderBottom: "1px solid oklch(0.19 0.018 265)" }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {listing.imageUrl ? (
                            <img
                              src={listing.imageUrl}
                              alt={listing.title}
                              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                              style={{ border: "1px solid oklch(0.25 0.022 265)" }}
                            />
                          ) : (
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: "oklch(0.20 0.022 265)" }}
                            >
                              <Zap className="w-4 h-4" style={{ color: "oklch(0.38 0.02 265)" }} />
                            </div>
                          )}
                          <span
                            className="text-sm font-medium line-clamp-1 max-w-[180px]"
                            style={{ color: "oklch(0.85 0.01 265)" }}
                          >
                            {listing.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="deal-badge px-2 py-1 rounded-md text-xs"
                          style={{
                            background: "oklch(0.68 0.14 195 / 0.1)",
                            color: "oklch(0.68 0.14 195)",
                            border: "1px solid oklch(0.68 0.14 195 / 0.2)",
                          }}
                        >
                          {categoryLabels[listing.category]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "oklch(0.68 0.14 195)" }}
                          >
                            ₹{listing.dealPrice.toLocaleString()}
                          </span>
                          <span
                            className="text-xs line-through ml-1.5"
                            style={{ color: "oklch(0.40 0.015 265)" }}
                          >
                            ₹{listing.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
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
                          {listing.stockQuantity.toString()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="deal-badge px-2 py-1 rounded-md text-xs"
                          style={
                            listing.isActive
                              ? {
                                  background: "oklch(0.65 0.18 160 / 0.1)",
                                  color: "oklch(0.65 0.18 160)",
                                  border: "1px solid oklch(0.65 0.18 160 / 0.25)",
                                }
                              : {
                                  background: "oklch(0.20 0.02 265)",
                                  color: "oklch(0.45 0.015 265)",
                                  border: "1px solid oklch(0.28 0.025 265)",
                                }
                          }
                        >
                          {listing.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggle(listing.id)}
                            disabled={togglingId === listing.id}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                            style={{
                              background: "oklch(0.20 0.022 265)",
                              border: "1px solid oklch(0.28 0.025 265)",
                              color: "oklch(0.55 0.02 265)",
                            }}
                            title={listing.isActive ? "Deactivate" : "Activate"}
                          >
                            {togglingId === listing.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : listing.isActive ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <Dialog
                            open={editListing?.id === listing.id}
                            onOpenChange={(open) => !open && setEditListing(null)}
                          >
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setEditListing(listing)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                                style={{
                                  background: "oklch(0.20 0.022 265)",
                                  border: "1px solid oklch(0.28 0.025 265)",
                                  color: "oklch(0.55 0.02 265)",
                                }}
                                title="Edit"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </DialogTrigger>
                            <DialogContent
                              className="max-w-lg max-h-[90vh] overflow-y-auto"
                              style={{
                                background: "oklch(0.15 0.018 265)",
                                border: "1px solid oklch(0.24 0.022 265)",
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle
                                  className="font-display text-xl font-medium"
                                  style={{ color: "oklch(0.90 0.01 265)" }}
                                >
                                  Edit Listing
                                </DialogTitle>
                              </DialogHeader>
                              {editListing && (
                                <EditListingForm
                                  listing={editListing}
                                  onSuccess={() => setEditListing(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
