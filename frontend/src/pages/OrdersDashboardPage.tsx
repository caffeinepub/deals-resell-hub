import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useQueries";
import { OrderStatus } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ClipboardList } from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string }> = {
  [OrderStatus.pending]: { label: "Pending" },
  [OrderStatus.processing]: { label: "Processing" },
  [OrderStatus.fulfilled]: { label: "Fulfilled" },
  [OrderStatus.cancelled]: { label: "Cancelled" },
};

export default function OrdersDashboardPage() {
  const navigate = useNavigate();
  const { pin } = useAdminAuth();
  const { data: orders = [], isLoading } = useAllOrders(pin || "");
  const updateStatus = useUpdateOrderStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sorted = [...orders].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  const counts = {
    pending: orders.filter((o) => o.status === OrderStatus.pending).length,
    processing: orders.filter((o) => o.status === OrderStatus.processing).length,
    fulfilled: orders.filter((o) => o.status === OrderStatus.fulfilled).length,
    cancelled: orders.filter((o) => o.status === OrderStatus.cancelled).length,
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!pin) return;
    setUpdatingId(orderId);
    try {
      await updateStatus.mutateAsync({ orderId, newStatus, pin });
    } finally {
      setUpdatingId(null);
    }
  };

  const summaryItems = [
    {
      label: "Pending",
      count: counts.pending,
      style: {
        background: "oklch(0.78 0.14 80 / 0.1)",
        border: "1px solid oklch(0.78 0.14 80 / 0.25)",
        color: "oklch(0.78 0.14 80)",
      },
    },
    {
      label: "Processing",
      count: counts.processing,
      style: {
        background: "oklch(0.60 0.18 250 / 0.1)",
        border: "1px solid oklch(0.60 0.18 250 / 0.25)",
        color: "oklch(0.60 0.18 250)",
      },
    },
    {
      label: "Fulfilled",
      count: counts.fulfilled,
      style: {
        background: "oklch(0.65 0.18 160 / 0.1)",
        border: "1px solid oklch(0.65 0.18 160 / 0.25)",
        color: "oklch(0.65 0.18 160)",
      },
    },
    {
      label: "Cancelled",
      count: counts.cancelled,
      style: {
        background: "oklch(0.55 0.18 25 / 0.1)",
        border: "1px solid oklch(0.55 0.18 25 / 0.25)",
        color: "oklch(0.55 0.18 25)",
      },
    },
  ];

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
        <div className="flex items-center gap-3 mb-8">
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
              Orders
            </h1>
            <p className="text-xs" style={{ color: "oklch(0.45 0.015 265)" }}>
              {orders.length} total orders
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {summaryItems.map(({ label, count, style }) => (
            <div key={label} className="rounded-xl px-4 py-4 text-center" style={style}>
              <div className="text-2xl font-semibold font-display mb-0.5">{count}</div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-80">{label}</div>
            </div>
          ))}
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
          ) : sorted.length === 0 ? (
            <div className="py-20 text-center">
              <ClipboardList
                className="w-10 h-10 mx-auto mb-3"
                style={{ color: "oklch(0.35 0.02 265)" }}
              />
              <p className="text-sm" style={{ color: "oklch(0.45 0.015 265)" }}>
                No orders yet.
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
                    {["Customer", "Phone", "Listing", "Qty", "Date", "Status"].map((h) => (
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
                  {sorted.map((order) => {
                    const date = new Date(Number(order.timestamp));
                    return (
                      <tr
                        key={order.id}
                        className="table-row-refined"
                        style={{ borderBottom: "1px solid oklch(0.19 0.018 265)" }}
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p
                              className="text-sm font-medium"
                              style={{ color: "oklch(0.85 0.01 265)" }}
                            >
                              {order.customerName}
                            </p>
                            <p
                              className="text-xs mt-0.5 line-clamp-1 max-w-[160px]"
                              style={{ color: "oklch(0.45 0.015 265)" }}
                            >
                              {order.customerAddress}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm" style={{ color: "oklch(0.65 0.02 265)" }}>
                            {order.customerPhone}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="text-xs font-mono"
                            style={{ color: "oklch(0.55 0.02 265)" }}
                          >
                            {order.listingId.length > 14
                              ? `${order.listingId.slice(0, 14)}…`
                              : order.listingId}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm" style={{ color: "oklch(0.70 0.02 265)" }}>
                            {order.quantity.toString()}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs" style={{ color: "oklch(0.48 0.015 265)" }}>
                            {date.toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="text-xs font-medium rounded-lg px-2.5 py-1.5 transition-all duration-200"
                            style={{
                              background: "oklch(0.18 0.022 265)",
                              border: "1px solid oklch(0.28 0.025 265)",
                              color: "oklch(0.75 0.02 265)",
                              outline: "none",
                              cursor: updatingId === order.id ? "not-allowed" : "pointer",
                              opacity: updatingId === order.id ? 0.5 : 1,
                            }}
                          >
                            {Object.values(OrderStatus).map((s) => (
                              <option
                                key={s}
                                value={s}
                                style={{ background: "oklch(0.18 0.022 265)" }}
                              >
                                {statusConfig[s].label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
