import { useState } from "react";
import { usePlaceOrder } from "@/hooks/useQueries";
import { Listing } from "@/backend";
import { CheckCircle, Loader2, ShoppingCart, User, Phone, MapPin, Package } from "lucide-react";

interface OrderFormProps {
  listing: Listing;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  quantity: number;
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  quantity?: string;
}

export default function OrderForm({ listing }: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    quantity: 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const placeOrderMutation = usePlaceOrder();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Name is required";
    if (!formData.customerPhone.trim()) newErrors.customerPhone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\s/g, "")))
      newErrors.customerPhone = "Enter a valid 10-digit phone number";
    if (!formData.customerAddress.trim()) newErrors.customerAddress = "Address is required";
    if (formData.quantity < 1) newErrors.quantity = "Quantity must be at least 1";
    if (formData.quantity > Number(listing.stockQuantity))
      newErrors.quantity = `Only ${listing.stockQuantity} in stock`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const id = `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    try {
      await placeOrderMutation.mutateAsync({
        id,
        listingId: listing.id,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        quantity: BigInt(formData.quantity),
        timestamp: BigInt(Date.now()),
      });
      setOrderId(id);
      setOrderSuccess(true);
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  if (orderSuccess) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: "oklch(0.65 0.18 160 / 0.06)",
          border: "1px solid oklch(0.65 0.18 160 / 0.25)",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "oklch(0.65 0.18 160 / 0.15)" }}
        >
          <CheckCircle className="w-7 h-7" style={{ color: "oklch(0.65 0.18 160)" }} />
        </div>
        <h3 className="font-display text-2xl font-medium mb-2" style={{ color: "oklch(0.90 0.01 265)" }}>
          Order Placed!
        </h3>
        <p className="text-sm mb-5" style={{ color: "oklch(0.58 0.02 265)" }}>
          Your order has been received. We'll contact you shortly.
        </p>
        <div
          className="rounded-xl p-4 text-left space-y-2"
          style={{
            background: "oklch(0.16 0.018 265)",
            border: "1px solid oklch(0.25 0.022 265)",
          }}
        >
          <div className="flex justify-between text-sm">
            <span style={{ color: "oklch(0.50 0.02 265)" }}>Order ID</span>
            <span className="font-mono text-xs" style={{ color: "oklch(0.68 0.14 195)" }}>{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "oklch(0.50 0.02 265)" }}>Item</span>
            <span style={{ color: "oklch(0.85 0.01 265)" }}>{listing.title}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "oklch(0.50 0.02 265)" }}>Qty</span>
            <span style={{ color: "oklch(0.85 0.01 265)" }}>{formData.quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "oklch(0.50 0.02 265)" }}>Total</span>
            <span className="font-semibold" style={{ color: "oklch(0.68 0.14 195)" }}>
              ₹{(listing.dealPrice * formData.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = {
    background: "oklch(0.16 0.018 265)",
    border: "1px solid oklch(0.25 0.022 265)",
    color: "oklch(0.90 0.01 265)",
    borderRadius: "0.625rem",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    color: "oklch(0.50 0.02 265)",
    marginBottom: "0.375rem",
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label style={labelStyle}>
          <User className="w-3 h-3" />
          Full Name
        </label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          placeholder="Your full name"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "oklch(0.68 0.14 195 / 0.6)";
            e.target.style.boxShadow = "0 0 0 3px oklch(0.68 0.14 195 / 0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "oklch(0.25 0.022 265)";
            e.target.style.boxShadow = "none";
          }}
        />
        {errors.customerName && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.58 0.20 25)" }}>{errors.customerName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>
          <Phone className="w-3 h-3" />
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          placeholder="10-digit mobile number"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "oklch(0.68 0.14 195 / 0.6)";
            e.target.style.boxShadow = "0 0 0 3px oklch(0.68 0.14 195 / 0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "oklch(0.25 0.022 265)";
            e.target.style.boxShadow = "none";
          }}
        />
        {errors.customerPhone && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.58 0.20 25)" }}>{errors.customerPhone}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label style={labelStyle}>
          <MapPin className="w-3 h-3" />
          Delivery Address
        </label>
        <textarea
          value={formData.customerAddress}
          onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
          placeholder="Full delivery address"
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => {
            e.target.style.borderColor = "oklch(0.68 0.14 195 / 0.6)";
            e.target.style.boxShadow = "0 0 0 3px oklch(0.68 0.14 195 / 0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "oklch(0.25 0.022 265)";
            e.target.style.boxShadow = "none";
          }}
        />
        {errors.customerAddress && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.58 0.20 25)" }}>{errors.customerAddress}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label style={labelStyle}>
          <Package className="w-3 h-3" />
          Quantity
        </label>
        <input
          type="number"
          min={1}
          max={Number(listing.stockQuantity)}
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
          style={{ ...inputStyle, width: "8rem" }}
          onFocus={(e) => {
            e.target.style.borderColor = "oklch(0.68 0.14 195 / 0.6)";
            e.target.style.boxShadow = "0 0 0 3px oklch(0.68 0.14 195 / 0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "oklch(0.25 0.022 265)";
            e.target.style.boxShadow = "none";
          }}
        />
        {errors.quantity && (
          <p className="text-xs mt-1" style={{ color: "oklch(0.58 0.20 25)" }}>{errors.quantity}</p>
        )}
      </div>

      {/* Total */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{
          background: "oklch(0.68 0.14 195 / 0.06)",
          border: "1px solid oklch(0.68 0.14 195 / 0.2)",
        }}
      >
        <span className="text-sm" style={{ color: "oklch(0.58 0.02 265)" }}>Total Amount</span>
        <span className="text-lg font-semibold" style={{ color: "oklch(0.68 0.14 195)" }}>
          ₹{(listing.dealPrice * formData.quantity).toLocaleString()}
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={placeOrderMutation.isPending}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {placeOrderMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Placing Order…
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Place Order
          </>
        )}
      </button>

      {placeOrderMutation.isError && (
        <p
          className="text-sm text-center px-4 py-2 rounded-lg"
          style={{
            background: "oklch(0.55 0.18 25 / 0.1)",
            border: "1px solid oklch(0.55 0.18 25 / 0.25)",
            color: "oklch(0.58 0.20 25)",
          }}
        >
          Failed to place order. Please try again.
        </p>
      )}
    </form>
  );
}
