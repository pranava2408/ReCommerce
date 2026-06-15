import { useState, useEffect } from "react";
import { Zap, ShoppingCart, Truck, Clock } from "lucide-react";
import { toast } from "sonner";

interface Deal {
  product_id: string;
  category: string;
  specs: string;
  original_price: number;
  deviate_price: number;
  distance_km: number;
  estimated_delivery_days: string;
  semantic_match_score: number;
}

export function QuickDelivery() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Defaulting to our mock user that we seeded in the backend
    const userId = "buyer-la-001";
    
    fetch(`https://ballap-second-life-api.hf.space/api/buyer-deals/${userId}?lat=34.0522&lon=-118.2437`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch deals");
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setDeals(data.deals);
        }
      })
      .catch((err) => {
        console.error("QuickDelivery Fetch Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleQuickAdd = (deal: Deal, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const existingCart = JSON.parse(localStorage.getItem("recommerce_cart") || "[]");
      const newCartItem = {
        id: `qd-${deal.product_id}-${Date.now()}`,
        title: deal.specs,
        condition: "New (Quick Delivery)",
        price: deal.deviate_price,
        originalPrice: deal.original_price,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80",
        co2Saved: "12.5 kg",
        greenCreditsEarned: Math.round(deal.deviate_price * 0.01),
        quantity: 1
      };
      localStorage.setItem("recommerce_cart", JSON.stringify([...existingCart, newCartItem]));
      window.dispatchEvent(new Event("storage"));
      toast.success(`Added ${deal.specs.substring(0, 20)}... to Cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 mt-6">
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-40 bg-gray-200 rounded w-48"></div>
            <div className="h-40 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return null; // Hide section if no deals match the user
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 mt-6">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-sm shadow-sm border border-blue-800">
        <div className="flex justify-between items-center mb-4 border-b border-blue-700/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-1.5 rounded-full text-white">
              <Zap className="h-4 w-4 fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Quick Delivery Deals <Truck className="h-4 w-4" />
              </h2>
              <p className="text-xs text-blue-200">
                Products located just miles away. Arrives faster than standard shipping!
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {deals.map((deal) => {
            const disc = Math.round(((deal.original_price - deal.deviate_price) / deal.original_price) * 100);
            return (
              <div 
                key={deal.product_id}
                className="bg-white text-gray-900 shrink-0 w-64 rounded-md p-4 border border-blue-200 shadow-md hover:ring-2 hover:ring-blue-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {deal.estimated_delivery_days}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                    {deal.specs}
                  </h3>
                  <p className="text-[10px] text-gray-500 mb-3">{deal.category}</p>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-3">
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-lg font-black text-gray-900">₹{deal.deviate_price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">₹{deal.original_price.toLocaleString()}</span>
                  </div>
                  <div className="text-xs font-bold text-green-600 mb-3">Save {disc}% instantly</div>
                  <button
                    onClick={(e) => handleQuickAdd(deal, e)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded transition-colors shadow-sm cursor-pointer flex justify-center items-center gap-2"
                  >
                    <ShoppingCart className="h-3 w-3" /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
