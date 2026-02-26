import { Category } from "@/backend";
import { Flame, Tag, Gift, Zap, Clock, RefreshCw, LayoutGrid } from "lucide-react";

interface CategoryFilterProps {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

const categories: {
  value: Category | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "All Deals", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { value: Category.flashSale, label: "Flash Sales", icon: <Flame className="w-3.5 h-3.5" /> },
  { value: Category.deal, label: "Deals", icon: <Tag className="w-3.5 h-3.5" /> },
  { value: Category.loot, label: "Loots", icon: <Gift className="w-3.5 h-3.5" /> },
  { value: Category.offer, label: "Offers", icon: <Zap className="w-3.5 h-3.5" /> },
  { value: Category.quickSale, label: "Quick Sales", icon: <Clock className="w-3.5 h-3.5" /> },
  { value: Category.resell, label: "Resell", icon: <RefreshCw className="w-3.5 h-3.5" /> },
];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = selected === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, oklch(0.68 0.14 195), oklch(0.62 0.16 210))",
                      color: "oklch(0.12 0.015 265)",
                      boxShadow: "0 4px 16px oklch(0.68 0.14 195 / 0.3)",
                    }
                  : {
                      background: "oklch(0.18 0.022 265)",
                      color: "oklch(0.60 0.02 265)",
                      border: "1px solid oklch(0.25 0.022 265)",
                    }
              }
            >
              {cat.icon}
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
