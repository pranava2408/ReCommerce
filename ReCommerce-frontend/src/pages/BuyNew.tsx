import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronDown, MapPin, Search, Star, Lock, TrendingDown, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner"; // Imported toast to alert the user when items go into the cart

const predictiveInsights: Record<string, { risk: "low" | "medium" | "high"; returnRate: number; insight: string; refurbishedAlternative?: string; alternativePrice?: number }> = {
  "6":  { risk: "high",   returnRate: 47, insight: "Size 6 has a 47% return rate for this model — runners report it runs 1.5 sizes large.", refurbishedAlternative: "Nike Air Max 270 (Size 7) – Certified Refurbished", alternativePrice: 7200 },
  "7":  { risk: "medium", returnRate: 28, insight: "Size 7 returns are above average. Customers often exchange for Size 8 for this model.", refurbishedAlternative: "Nike Air Max 270 (Size 8) – Open Box", alternativePrice: 6800 },
  "8":  { risk: "high",   returnRate: 52, insight: "Customers with your foot profile (Size 9) return Size 8 52% of the time. We strongly recommend Size 9.", refurbishedAlternative: "Nike Air Max 97 (Size 9) – Open Box", alternativePrice: 8500 },
  "9":  { risk: "low",    returnRate: 4,  insight: "Size 9 matches your profile perfectly. Lowest return rate for this model." },
  "10": { risk: "medium", returnRate: 18, insight: "Size 10 returns are slightly above average. Profile suggests you may prefer Size 9." },
  "11": { risk: "high",   returnRate: 39, insight: "Size 11 has a high return rate for this model — buyers frequently downsize to 10.", refurbishedAlternative: "Nike Air Max 97 (Size 10) – Certified Refurbished", alternativePrice: 7900 },
  "12": { risk: "high",   returnRate: 44, insight: "Size 12 is the highest-returning size for this model. Consider Size 11 or consult the size chart.", refurbishedAlternative: "Nike Air Max 270 (Size 11) – Open Box", alternativePrice: 8100 },
};

export default function BuyNew() {
  const [selectedSize, setSelectedSize] = useState<string>("9");
  const [quantity, setQuantity] = useState<number>(1);
  
  const sizes = ["6", "7", "8", "9", "10", "11", "12"];

  // Custom addition function logic updating shared application store array via localStorage
  const handleAddToCart = (overrideProduct?: { name: string; price: number; condition: string }) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("recommerce_cart") || "[]");
      const activeInsight = predictiveInsights[selectedSize];

      // Format custom object variables to feed the global Cart state list seamlessly
      const cartItem = {
        id: `new-${selectedSize}-${Date.now()}`,
        title: overrideProduct?.name || "Nike Men's Air Max 2024 Running Shoe",
        condition: overrideProduct?.condition || `Brand New (UK Size ${selectedSize} - ${activeInsight?.risk || "low"} return risk)`,
        price: overrideProduct?.price || 14995,
        originalPrice: overrideProduct ? 14995 : 14995,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80", // fallback decorative premium item thumbnail
        co2Saved: overrideProduct ? "12.4 kg" : "0.0 kg (New Item Option)",
        greenCreditsEarned: overrideProduct ? 45 : 15,
        quantity: quantity
      };

      const updatedCart = [...existingCart, cartItem];
      localStorage.setItem("recommerce_cart", JSON.stringify(updatedCart));

      // Dispatches storage update for immediate layout header re-renders
      window.dispatchEvent(new Event("storage"));
      
      toast.success(`Successfully added ${quantity}x item(s) to your Eco-Cart!`);
    } catch (e) {
      console.error("Cart generation parsing crashed.", e);
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto bg-white p-4 pb-20">
      
      {/* Category Breadcrumbs */}
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <span className="hover:underline cursor-pointer">Clothing, Shoes & Jewelry</span>
        <span>›</span>
        <span className="hover:underline cursor-pointer">Men</span>
        <span>›</span>
        <span className="hover:underline cursor-pointer">Shoes</span>
        <span>›</span>
        <span className="hover:underline cursor-pointer">Athletic</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        
        {/* Left Column - Images */}
        <div className="w-full md:w-2/5 flex gap-4">
          <div className="w-12 space-y-2 hidden sm:block">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`aspect-square border rounded cursor-pointer flex items-center justify-center bg-gray-50 hover:border-primary ${i === 1 ? 'border-primary border-2 shadow-[0_0_4px_rgba(255,153,0,0.5)]' : 'border-gray-200'}`}>
                <Search className="h-4 w-4 text-gray-300" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded flex items-center justify-center min-h-[400px]">
            <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center shadow-inner">
               <span className="text-gray-400 font-bold">Product Image</span>
            </div>
          </div>
        </div>

        {/* Middle Column - Product Details */}
        <div className="w-full md:w-1/3 flex-1 flex flex-col">
          <h1 className="text-2xl font-normal text-gray-900 leading-tight">
            Nike Men's Air Max 2024 Running Shoe, Breathable Mesh Upper, Cushioned Midsole
          </h1>
          <a href="#" className="text-sm text-blue-600 hover:underline hover:text-orange-600 mb-1">Visit the Nike Store</a>
          
          <div className="flex items-center gap-4 mb-2 border-b border-gray-200 pb-2">
            <div className="flex items-center">
              <div className="flex text-orange-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current text-gray-300" />
              </div>
              <span className="text-blue-600 text-sm ml-2 hover:underline cursor-pointer">4,821 ratings</span>
            </div>
            <span className="text-sm font-bold text-gray-700">|</span>
            <span className="text-sm font-bold text-gray-700">Search this page</span>
          </div>

          <div className="mb-4">
            <div className="flex items-start gap-1">
              <span className="text-sm font-medium mt-1">₹</span>
              <span className="text-3xl font-medium">14,995</span>
              <span className="text-sm font-medium mt-1">00</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
            <p className="text-sm text-gray-600"><span className="font-bold">EMI</span> starts at ₹716. No Cost EMI available</p>
          </div>

          {/* Size Selector */}
          <div className="mb-6 space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-end">
              <h3 className="font-bold text-sm">Size (UK): <span className="font-normal ml-1">{selectedSize}</span></h3>
              <a href="#" className="text-sm text-blue-600 hover:underline">Size Chart</a>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-10 px-3 border text-sm rounded-sm transition-all
                    ${selectedSize === size 
                      ? 'border-primary border-2 bg-orange-50 shadow-[0_0_4px_rgba(255,153,0,0.5)] font-bold' 
                      : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium text-gray-700'
                    }
                  `}
                  data-testid={`button-size-${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
            
            {/* Embedded Profile context */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded text-sm text-gray-700 mt-2 w-fit">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-white">ME</span>
              </div>
              <span>Your Profile: Usually wears <strong>Size 9</strong> in this brand</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-800">
            <h4 className="font-bold mb-1">About this item</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Max Air cushioning for lightweight comfort</li>
              <li>Rubber outsole for durable traction</li>
              <li>Breathable mesh upper keeps feet cool</li>
              <li>Lace-up closure for a secure fit</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Buy Box */}
        <div className="w-full md:w-64 shrink-0">
          <div className="border border-gray-200 rounded p-4 shadow-sm bg-white sticky top-4">
            <div className="flex items-start gap-1 mb-2">
              <span className="text-sm font-medium mt-1">₹</span>
              <span className="text-2xl font-medium">14,995</span>
              <span className="text-sm font-medium mt-1">00</span>
            </div>
            
            <div className="text-sm mb-4 space-y-1">
              <p><span className="text-blue-600 hover:underline cursor-pointer">FREE delivery</span> <strong>Tomorrow, Oct 26</strong>. Order within 4 hrs 12 mins.</p>
              <div className="flex items-start gap-1 mt-2 text-gray-700">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="text-blue-600 hover:underline cursor-pointer">Deliver to John - Bangalore 560001</span>
              </div>
            </div>

            <p className="text-xl text-green-700 font-medium mb-4">In stock</p>

            <div className="mb-4">
              <select 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-gray-100 border border-gray-300 text-sm rounded px-2 py-1.5 shadow-sm outline-none w-16 focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            {/* PREDICTIVE RETURN PREVENTION — all sizes get tailored insight */}
            {(() => {
              const insight = predictiveInsights[selectedSize];
              if (!insight) return null;
              if (insight.risk === "low") {
                return (
                  <div className="bg-green-50 border border-green-300 p-3 mb-4 rounded animate-in fade-in duration-200" data-testid="banner-return-low">
                    <div className="flex gap-2 items-start">
                      <Sparkles className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-green-800">Great choice — Size {selectedSize} matches your profile</h4>
                        <p className="text-xs text-green-700 mt-0.5">{insight.insight}</p>
                        <p className="text-xs text-green-600 font-bold mt-0.5">Only {insight.returnRate}% return rate</p>
                      </div>
                    </div>
                  </div>
                );
              }
              const isHigh = insight.risk === "high";
              return (
                <div
                  className={`border-l-4 p-3 mb-4 rounded-r animate-in fade-in zoom-in-95 duration-200 ${isHigh ? "bg-red-50 border-red-500" : "bg-amber-100 border-amber-500"}`}
                  data-testid="banner-return-warning"
                >
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${isHigh ? "text-red-600" : "text-amber-600"}`} />
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold leading-tight ${isHigh ? "text-red-900" : "text-amber-900"}`}>
                          {isHigh ? "High Return Risk" : "Moderate Return Risk"}
                        </h4>
                        <span className={`text-xs font-black ${isHigh ? "text-red-700" : "text-amber-700"}`}>{insight.returnRate}% return rate</span>
                      </div>
                      <p className={`text-xs mt-1 leading-snug ${isHigh ? "text-red-800" : "text-amber-800"}`}>{insight.insight}</p>
                      {insight.refurbishedAlternative && (
                        <div className="mt-2 bg-white border border-gray-200 rounded p-2 flex items-center justify-between gap-2 text-left">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide flex items-center gap-1">
                              <TrendingDown className="h-3 w-3 text-green-600" /> AI Recommends Refurbished Alternative
                            </p>
                            <p className="text-xs font-medium text-gray-800 mt-0.5">{insight.refurbishedAlternative}</p>
                            <p className="text-xs font-black text-primary">₹{insight.alternativePrice?.toLocaleString()} <span className="text-gray-400 font-normal line-through">₹14,995</span></p>
                          </div>
                          <button 
                            className="shrink-0 flex items-center gap-0.5 text-xs font-bold text-blue-700 hover:underline" 
                            data-testid="button-view-alternative"
                            onClick={() => {
                              handleAddToCart({
                                name: insight.refurbishedAlternative || "Alternative Nike Air Max",
                                price: insight.alternativePrice || 7000,
                                condition: "Refurbished / Open Box (Eco Alternative Match)"
                              });
                            }}
                          >
                            View <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      {isHigh && (
                        <button
                          className="text-xs font-bold text-blue-700 hover:underline mt-2 block"
                          onClick={() => setSelectedSize("9")}
                          data-testid="button-switch-size"
                        >
                          Switch to Size 9 (recommended)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2 mb-4">
              <Button 
                className="w-full bg-primary hover:bg-accent text-black font-normal rounded-full border border-primary-border shadow-sm"
                onClick={() => handleAddToCart()}
              >
                Add to Cart
              </Button>
              <Button 
                className="w-full bg-accent hover:bg-orange-400 text-black font-normal rounded-full border border-accent-border shadow-sm"
                onClick={() => handleAddToCart()}
              >
                Buy Now
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-4 hover:text-blue-600 cursor-pointer">
              <Lock className="h-3 w-3" />
              <span>Secure transaction</span>
            </div>

            <div className="text-xs space-y-1 mb-4">
              <div className="grid grid-cols-[80px_1fr]">
                <span className="text-gray-500">Ships from</span>
                <span>Amazon</span>
              </div>
              <div className="grid grid-cols-[80px_1fr]">
                <span className="text-gray-500">Sold by</span>
                <span className="text-blue-600 hover:underline cursor-pointer">Nike India</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <Button variant="outline" className="w-full justify-between h-8 px-2 bg-gray-50 text-xs shadow-sm">
                Add to Wish List
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}