import { useState, useEffect } from "react";
import { marketplaceProducts, personalizedRecommendations, returnRiskData } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Check, ShieldCheck, Clock, History, Search, Sparkles, 
  Award, AlertTriangle, ChevronRight, MapPin, Loader2 
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "../lib/axios";

// TypeScript interface representing the dynamic live marketplace database schema
interface DBListing {
  id: string;
  itemId: string;
  sellerId: number;
  locationId: string;
  title: string;
  description: string | null;
  listingPrice: string;
  status: string;
  createdAt: string;
  proximity?: string; // Appended by backend proximity logic service
  item?: {
    name: string;
    brand: string | null;
    images?: Array<{ imageUrl: string }>;
  };
}

export default function Marketplace() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  // Real DB states for nearby local exchange items
  const [nearbyListings, setNearbyListings] = useState<DBListing[]>([]);
  const [isListingsLoading, setIsListingsLoading] = useState<boolean>(true);

  // Fetch true live nearby items from the backend repository on mount
  useEffect(() => {
    const fetchNearbyItems = async () => {
      try {
        // Automatically reads current user token context on backend to gauge distances from Silchar
        const response = await api.get("/marketplace/listings", {
          params: { status: "ACTIVE", limit: 10 }
        });
        if (response.data?.success) {
          setNearbyListings(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load local proximity items:", error);
      } finally {
        setIsListingsLoading(false);
      }
    };

    fetchNearbyItems();
  }, []);

  // Function to handle adding items into the shared cart space
  const handleAddToCart = (product: any, isRecommendation = false) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("recommerce_cart") || "[]");

      const newCartItem = {
        id: `cart-${product.id || product.id}-${Date.now()}`,
        title: product.name || product.title,
        condition: isRecommendation 
          ? `Recommended - ${product.reason}` 
          : `${product.condition || "Verified Operational"}`,
        price: parseFloat(product.price || product.listingPrice || "0"),
        originalPrice: product.originalPrice || parseFloat(product.price || product.listingPrice || "0") * 1.2,
        image: product.image || product.item?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80",
        co2Saved: "11.2 kg",
        greenCreditsEarned: Math.round(parseFloat(product.price || product.listingPrice || "0") * 0.005),
        quantity: 1
      };

      const updatedCart = [...existingCart, newCartItem];
      localStorage.setItem("recommerce_cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));

      toast.success(`Added "${newCartItem.title.substring(0, 25)}..." to your Eco-Cart!`);
    } catch (error) {
      console.error("Cart addition execution failed", error);
      toast.error("Failed to add item to cart.");
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Like New": return "bg-green-100 text-green-800 border-green-200";
      case "Good": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Fair": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-[1400px] mx-auto p-4 gap-6">

      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-6 hidden md:block">
        <div>
          <h3 className="font-bold text-sm mb-3">Departments</h3>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li className="font-bold text-gray-900">Any Department</li>
            <li className="pl-2 hover:text-primary cursor-pointer">Electronics</li>
            <li className="pl-2 hover:text-primary cursor-pointer">Clothing</li>
            <li className="pl-2 hover:text-primary cursor-pointer">Shoes & Accessories</li>
            <li className="pl-2 hover:text-primary cursor-pointer">Books</li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-bold text-sm mb-3">AI Verified Condition</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="cond-1" />
              <Label htmlFor="cond-1" className="text-sm font-normal">Like New (9.0+)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cond-2" />
              <Label htmlFor="cond-2" className="text-sm font-normal">Good (7.0 - 8.9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="cond-3" />
              <Label htmlFor="cond-3" className="text-sm font-normal">Fair (Below 7.0)</Label>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        {/* Personalized Recommendations Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#131921] to-[#232f3e] rounded-lg p-4 text-white" data-testid="section-recommendations">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary fill-primary" />
              <h2 className="font-bold text-base">Recommended for You</h2>
              <Badge className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-1.5">AI Personalized</Badge>
            </div>
            <button className="text-xs text-gray-400 hover:text-white flex items-center gap-0.5" data-testid="button-see-all-recs">
              See all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {personalizedRecommendations.map(rec => {
              const discount = Math.round(((rec.originalPrice - rec.price) / rec.originalPrice) * 100);
              return (
                <div
                  key={rec.id}
                  className="shrink-0 w-44 bg-white rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
                  data-testid={`card-rec-${rec.id}`}
                  onClick={() => setSelectedProduct({ 
                    ...rec, 
                    condition: "Like New", 
                    score: rec.score || 9.2,
                    history: "Returned within 48h", 
                    warranty: "6 Months ReCommerce Standard Warranty" 
                  })}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    {rec.certified && (
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        <Award className="h-2.5 w-2.5" /> Certified
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 bg-gray-900/80 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                      {rec.score}/10
                    </div>
                  </div>
                  <div className="p-2.5">
                    <p className="text-gray-900 text-[11px] font-medium line-clamp-2 leading-tight mb-1">{rec.name}</p>
                    <p className="text-[10px] text-blue-600 mb-1.5">{rec.reason}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">₹{rec.price.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{rec.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] font-bold text-primary">Save {discount}%</div>
                    <button 
                      className="mt-2 w-full bg-primary hover:bg-accent text-black text-[11px] font-medium rounded-full py-1 transition-colors" 
                      data-testid={`button-add-rec-${rec.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(rec, true);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🗺️ NEW SECTION: Products Near Me (Dynamic Silchar P2P Fleet Grid) */}
        <div className="mb-6 bg-amber-50/60 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-orange-500 animate-bounce" />
            <h2 className="font-bold text-base text-gray-900">Products Near Me (Local Exchange)</h2>
            <Badge className="bg-amber-600 text-white text-[10px]">Silchar Hub</Badge>
          </div>

          {isListingsLoading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-gray-500 text-xs font-medium">
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              Scanning for localized neighborhood drops...
            </div>
          ) : nearbyListings.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 italic">No peer resale items detected immediately nearby right now.</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {nearbyListings.map((listing) => {
                const itemImg = listing.item?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&q=80";
                return (
                  <div
                    key={listing.id}
                    className="shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between"
                    onClick={() => setSelectedProduct({
                      id: listing.id,
                      name: listing.title,
                      price: parseFloat(listing.listingPrice),
                      originalPrice: parseFloat(listing.listingPrice) * 1.25,
                      condition: "Verified Resale",
                      score: 8.8,
                      image: itemImg,
                      history: "Inspected live at the local Silchar evaluation center.",
                      warranty: "100-Day P2P Local Protection Guarantee Enabled"
                    })}
                  >
                    <div>
                      <div className="aspect-square bg-gray-50 flex items-center justify-center relative p-2">
                        <img src={itemImg} alt={listing.title} className="max-h-full max-w-full object-contain rounded" />
                        <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                          <MapPin className="h-2 w-2" /> {listing.proximity || "Local hub"}
                        </div>
                      </div>
                      <div className="p-2">
                        <h4 className="text-gray-900 text-[11px] font-bold line-clamp-1 leading-tight mb-0.5">{listing.title}</h4>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mb-1">{listing.description || "No added notes provided by owner."}</p>
                        <span className="text-xs font-black text-gray-950">₹{parseFloat(listing.listingPrice).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="p-2 pt-0">
                      <button
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold py-1 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(listing, false);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Catalog Grid Area */}
        <div className="mb-4 bg-white p-3 border border-gray-200 rounded shadow-sm flex justify-between items-center text-sm">
          <span><strong>1-12 of over 2,000 results</strong> for "ReCommerce Open Box"</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded p-1 text-sm bg-gray-50 focus:ring-1 focus:ring-primary outline-none">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>AI Score: Highest first</option>
              <option>Lowest Return Risk</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {marketplaceProducts.map(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            const risk = returnRiskData[product.id];

            return (
              <Card
                key={product.id}
                className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer group flex flex-col"
                onClick={() => setSelectedProduct(product)}
                data-testid={`card-product-${product.id}`}
              >
                <div className="aspect-square bg-gray-100 relative p-4 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge variant="outline" className={`text-[10px] font-bold ${getConditionColor(product.condition)}`}>
                      {product.condition}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gray-900 text-white text-[10px] hover:bg-gray-800">
                      AI: {product.score}/10
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3 flex flex-col flex-1">
                  <h2 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 hover:text-primary">
                    {product.name}
                  </h2>

                  {risk && (
                    <div className={`flex items-start gap-1 rounded px-1.5 py-1 mb-1 ${risk.riskLevel === "high" ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"}`}>
                      <AlertTriangle className={`h-3 w-3 shrink-0 mt-0.5 ${risk.riskLevel === "high" ? "text-red-500" : "text-amber-500"}`} />
                      <p className={`text-[10px] leading-snug ${risk.riskLevel === "high" ? "text-red-700" : "text-amber-700"}`}>
                        {risk.reason} ({risk.returnRate}% return rate)
                      </p>
                    </div>
                  )}

                  <div className="mt-auto pt-2">
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="text-xs font-bold text-primary mb-3">Save {discount}%</div>

                    <Button
                      className="w-full bg-primary hover:bg-accent text-black font-medium h-8 text-xs rounded-full border border-primary-border"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, false);
                      }}
                      data-testid={`button-add-cart-${product.id}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Product Health Card Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden" data-testid="modal-product-health">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-full">
              
              {/* Left col - Image */}
              <div className="bg-gray-100 p-6 flex flex-col items-center justify-center md:w-2/5 border-r border-gray-200">
                <div className="w-32 h-32 bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center mb-4 shadow-inner overflow-hidden">
                  {selectedProduct.image ? (
                    <img src={selectedProduct.image} alt="Target Selection" className="h-full w-full object-cover" />
                  ) : (
                    <Search className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="text-center w-full">
                  <div className="text-3xl font-black text-gray-900 mb-1">{selectedProduct.score}<span className="text-lg text-gray-500 font-normal">/10</span></div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">AI Health Score</p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(selectedProduct.score / 10) * 100}%` }}></div>
                  </div>
                </div>

                {returnRiskData[selectedProduct.id] && (
                  <div className={`mt-4 w-full rounded-lg p-3 ${returnRiskData[selectedProduct.id].riskLevel === "high" ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertTriangle className={`h-4 w-4 ${returnRiskData[selectedProduct.id].riskLevel === "high" ? "text-red-600" : "text-amber-600"}`} />
                      <span className={`text-xs font-bold ${returnRiskData[selectedProduct.id].riskLevel === "high" ? "text-red-800" : "text-amber-800"}`}>
                        Predictive Return Risk
                      </span>
                    </div>
                    <p className={`text-xs ${returnRiskData[selectedProduct.id].riskLevel === "high" ? "text-red-700" : "text-amber-700"}`}>
                      {returnRiskData[selectedProduct.id].reason}
                    </p>
                    <p className={`text-xs font-bold mt-1 ${returnRiskData[selectedProduct.id].riskLevel === "high" ? "text-red-800" : "text-amber-800"}`}>
                      {returnRiskData[selectedProduct.id].returnRate}% of buyers return this item
                    </p>
                  </div>
                )}
              </div>

              {/* Right col - Details */}
              <div className="p-6 md:w-3/5 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">{selectedProduct.name || selectedProduct.title}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getConditionColor(selectedProduct.condition || "Verified Resale")}>
                      Condition: {selectedProduct.condition || "Verified Resale"}
                    </Badge>
                    <span className="text-sm text-primary font-bold">
                      Save {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">₹{selectedProduct.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                    <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1.5 uppercase tracking-wide">
                      <ShieldCheck className="h-4 w-4" /> Verified AI Condition Report
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" /> 100% Authentic verified by computer vision</li>
                      <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" /> Fully functional, stress-tested</li>
                      <li className="flex items-start gap-1.5"><Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" /> Checked parameters align with regional hub standards</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                        <History className="h-4 w-4 text-gray-500" /> Return History
                      </h4>
                      <p className="text-xs text-gray-900">{selectedProduct.history || "No previous return history reported."}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                        <Clock className="h-4 w-4 text-gray-500" /> Warranty
                      </h4>
                      <p className="text-xs text-gray-900">{selectedProduct.warranty || "90-Day Marketplace Merchant Protection Policy"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                  <Button 
                    className="w-full bg-accent hover:bg-orange-400 text-black font-bold h-10 rounded-full border border-accent-border" 
                    data-testid="button-buy-now-modal"
                    onClick={() => {
                      handleAddToCart(selectedProduct, false);
                      setSelectedProduct(null);
                    }}
                  >
                    Buy Now / Add to Cart
                  </Button>

                  <div className="flex items-center gap-2">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium uppercase">Or Make an Offer</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                      <Input type="number" placeholder="Enter amount" className="pl-7 h-9 text-sm" data-testid="input-offer-amount" />
                    </div>
                    <Button 
                      variant="outline" 
                      className="h-9 px-4 text-sm font-medium" 
                      data-testid="button-submit-offer"
                      onClick={() => {
                        toast.success("Your purchase offer was counter-transmitted to the seller!");
                        setSelectedProduct(null);
                      }}
                    >
                      Submit Offer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}