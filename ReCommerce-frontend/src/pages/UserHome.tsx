import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Leaf,
  ShoppingCart,
  ArrowRight,
  Percent,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "../lib/axios";

interface ImageData {
  id: string;
  imageUrl: string;
  imageType: string;
}

interface ListingItem {
  id: string;
  name: string;
  brand: string | null;
  originalPrice: number;
  images: ImageData[];
}

interface LiveMarketplaceListing {
  id: string;
  title: string;
  description: string | null;
  listingPrice: string | number;
  locationId: string | null;
  item: ListingItem;
}

export default function UserHome() {
  const [, setLocation] = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [listings, setListings] = useState<LiveMarketplaceListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const updateCartCount = () => {
      const existingCart = JSON.parse(
        localStorage.getItem("recommerce_cart") || "[]",
      );
      setCartCount(
        existingCart.reduce(
          (acc: number, item: any) => acc + (item.quantity || 1),
          0,
        ),
      );
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  useEffect(() => {
    const fetchLiveCatalog = async () => {
      try {
        setLoading(true);
        console.log("📡 Axios sending request to: /marketplace/listings");
        const response = await api.get("/marketplace/listings");

        console.log("📦 Full Axios Response Object:", response);
        console.log(
          "🎁 Response Data Body Structure (response.data):",
          response.data,
        );

        const rawListings = response.data?.data || response.data;
        console.log("📊 Extracted Listings Array Data:", rawListings);
        console.log(
          "🔢 Total Items Received from Database:",
          Array.isArray(rawListings) ? rawListings.length : "Not an array!",
        );

        if (Array.isArray(rawListings) && rawListings.length > 0) {
          console.log(
            "👀 Sample Object Structure from Array[0]:",
            rawListings[0],
          );
        }

        setListings(rawListings);
      } catch (err: any) {
        console.error("❌ API Fetch Error Caught in Component:", err);
        if (err.response) {
          console.error(
            "⚠️ Server responded with error status:",
            err.response.status,
          );
          console.error(
            "📋 Server error response body data:",
            err.response.data,
          );
        } else if (err.request) {
          console.error(
            "⏳ No response received. Request details:",
            err.request,
          );
        } else {
          console.error(
            "🔧 Configuration setting layout fault message:",
            err.message,
          );
        }
        toast.error("Failed to stream real-time product arrays from database.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveCatalog();
  }, []);

  const handleQuickAdd = (
    listing: LiveMarketplaceListing,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("recommerce_cart") || "[]",
      );
      const displayImageUrl =
        listing.item.images?.[0]?.imageUrl ||
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80";
      const priceNum = Number(listing.listingPrice);
      const originalPriceNum = Number(listing.item.originalPrice);

      const newCartItem = {
        id: `live-${listing.id}-${Date.now()}`,
        title: listing.title,
        condition: "Marketplace Item",
        price: priceNum,
        originalPrice: originalPriceNum,
        image: displayImageUrl,
        co2Saved: "8.4 kg",
        greenCreditsEarned: Math.round(priceNum * 0.005),
        quantity: 1,
      };

      localStorage.setItem(
        "recommerce_cart",
        JSON.stringify([...existingCart, newCartItem]),
      );
      window.dispatchEvent(new Event("storage"));
      toast.success(`Added ${listing.title.substring(0, 20)}... to Cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart.");
    }
  };

  // Log filter results to see if listings are matching criteria conditions
  const sustainableHighlights = listings;

  console.log(
    "🌿 Filtered Sustainable Highlights Array count:",
    sustainableHighlights.length,
  );

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16 text-gray-900 font-sans">
      <div className="relative w-full overflow-hidden max-w-[1500px] mx-auto h-[220px] sm:h-[320px] md:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#eaeded] via-transparent to-black/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&q=80"
          alt="Eco Background Banner"
          className="w-full h-full object-cover select-none"
        />
        <div className="absolute top-6 left-6 md:top-12 md:left-12 z-20 max-w-xl space-y-2 md:space-y-4">
          <span className="bg-emerald-600 text-white font-bold text-[10px] md:text-xs uppercase tracking-wider px-2.5 py-1 rounded">
            ReCommerce Circular Marketplace Active
          </span>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow">
            Shop Smart. Save Carbon. <br />
            Earn Green Credits.
          </h1>
          <p className="text-xs sm:text-sm text-gray-100 max-w-md hidden sm:block drop-shadow-sm">
            Discover verified open-box, certified refurbished, and peer-to-peer
            listings inspected entirely by automated AI diagnostic scores.
          </p>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-36 relative z-30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-sm shadow border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg md:text-xl text-gray-900">
              Welcome, Explorer
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Your active sustainable carbon profile dashboard
            </p>
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded p-3 flex items-center gap-2.5">
              <Leaf className="h-6 w-6 text-emerald-600 fill-emerald-600 shrink-0" />
              <div>
                <div className="text-sm font-bold text-emerald-900">
                  340 Green Credits
                </div>
                <div className="text-[10px] text-emerald-700">
                  Eco Champion Tier Level
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/green-credits"
            className="text-xs text-blue-600 hover:underline mt-4 inline-flex items-center gap-0.5 font-medium cursor-pointer"
          >
            View your points statement <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-sm shadow border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg md:text-xl text-gray-900">
              Track & Returns
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Manage current logistics pipelines
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Link
                href="/my-orders"
                className="bg-gray-50 hover:bg-gray-100 p-2 text-center rounded border border-gray-200 cursor-pointer transition-colors"
              >
                <div className="text-xs font-bold text-gray-800">
                  Your Orders
                </div>
              </Link>
              <Link
                href="/my-returns"
                className="bg-gray-50 hover:bg-gray-100 p-2 text-center rounded border border-gray-200 cursor-pointer transition-colors"
              >
                <div className="text-xs font-bold text-amber-700">
                  My Returns
                </div>
              </Link>
            </div>
          </div>
          <Link
            href="/my-orders"
            className="text-xs text-blue-600 hover:underline mt-4 inline-flex items-center gap-0.5 font-medium cursor-pointer"
          >
            Check shipping statuses <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-sm shadow border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg md:text-xl text-gray-900">
              Your Eco-Cart
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Items waiting for green routing consolidation
            </p>
            <div className="mt-4 flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-bold text-amber-900">
                  {cartCount} Items Pending
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/cart"
            className="text-xs text-blue-600 hover:underline mt-4 inline-flex items-center gap-0.5 font-medium cursor-pointer"
          >
            Proceed to Checkout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-sm shadow border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg md:text-xl text-gray-900">
              P2P Resale Hub
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Buy directly from alternative user circular returns
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded text-center text-xs text-blue-800">
              ⚡ Verified direct matching routes bypass transit hub overhead
              emissions!
            </div>
          </div>
          <Link
            href="/p2p"
            className="text-xs text-blue-600 hover:underline mt-4 inline-flex items-center gap-0.5 font-medium cursor-pointer"
          >
            Explore peer-to-peer deals <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 mt-6">
        <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-full text-white">
                <Leaf className="h-4 w-4 fill-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  Sustainable Products Showcase
                </h2>
                <p className="text-xs text-gray-500">
                  Highest diagnostic safety rankings saving real metric tons of
                  operational manufacturing footprint
                </p>
              </div>
            </div>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Browse All Eco Deals
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
              <p className="text-sm font-medium text-gray-500">
                Connecting to Supabase transaction pipeline...
              </p>
            </div>
          ) : sustainableHighlights.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded">
              <p className="text-gray-500 text-sm">
                No live verified marketplace items fit optimization profiles
                currently.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sustainableHighlights.slice(0, 8).map((listing) => {
                const priceNum = Number(listing.listingPrice);
                const originalPriceNum = Number(
                  listing.item?.originalPrice || 0,
                );

                const discountPercent =
                  originalPriceNum > 0
                    ? Math.round(
                        ((originalPriceNum - priceNum) / originalPriceNum) *
                          100,
                      )
                    : 0;

                const displayImage =
                  listing.item?.images?.find((img) => img.imageType === "FRONT")
                    ?.imageUrl ||
                  listing.item?.images?.[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80";

                return (
                  <div
                    key={listing.id}
                    onClick={() =>
                      setLocation(`/marketplace/listing/${listing.id}`)
                    }
                    className="border border-gray-100 bg-gray-50/50 hover:bg-white rounded p-3 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="aspect-square bg-white rounded flex items-center justify-center relative border border-gray-100 mb-3 overflow-hidden">
                        <img
                          src={displayImage}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        By {listing.item?.brand || "Eco-Partner"}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-100/80">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-gray-900">
                          ₹{priceNum.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{originalPriceNum.toLocaleString()}
                        </span>
                      </div>

                      {discountPercent > 0 && (
                        <div className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-0.5">
                          <Percent className="h-3 w-3 shrink-0" /> Save{" "}
                          {discountPercent}% instantly
                        </div>
                      )}

                      <button
                        onClick={(e) => handleQuickAdd(listing, e)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 mt-3 rounded-md transition-colors shadow-sm cursor-pointer"
                      >
                        Add to Eco-Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
