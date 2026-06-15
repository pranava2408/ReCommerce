import { useLocation, Link } from "wouter";
import { ArrowLeft, Trash2, ShieldCheck, Leaf, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Mock data representing items inside the cart
const INITIAL_CART_ITEMS = [
  {
    id: "cart-1",
    title: "Sony WH-1000XM4 Wireless Noise-Canceling Headphones",
    condition: "Refurbished - Excellent",
    price: 14999,
    originalPrice: 29990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80",
    co2Saved: "12.5 kg",
    greenCreditsEarned: 45,
    quantity: 1,
  },
  {
    id: "cart-2",
    title: "Nike Air Max 97 Running Shoes (Size 10)",
    condition: "P2P Resale - Lightly Used",
    price: 5499,
    originalPrice: 15995,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80",
    co2Saved: "8.2 kg",
    greenCreditsEarned: 25,
    quantity: 1,
  }
];

export default function Cart() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  // Handle removing items from the cart
  const removeItem = (id: string, title: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success(`Removed "${title.substring(0, 20)}..." from cart`);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCo2 = cartItems.reduce((acc, item) => acc + (parseFloat(item.co2Saved) * item.quantity), 0).toFixed(1);
  const totalGc = cartItems.reduce((acc, item) => acc + (item.greenCreditsEarned * item.quantity), 0);

  const handleCheckout = () => {
    toast.success("Order placed successfully via ReCommerce eco-routing!");
    setCartItems([]);
    setLocation("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Continue Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-3 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
            <h1 className="text-2xl font-medium border-b border-gray-200 pb-4 flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-gray-700" />
              Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg font-medium">Your ReCommerce cart is empty.</p>
                <Link href="/">
                  <span className="text-sm text-blue-600 hover:underline mt-2 inline-block cursor-pointer">
                    Discover pre-owned and sustainable deals now
                  </span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4 items-start">
                    {/* Item Image */}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-28 h-28 object-cover rounded border border-gray-200 bg-gray-50 shrink-0" 
                    />

                    {/* Item Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h2 className="font-medium text-base text-gray-900 hover:text-blue-600 cursor-pointer leading-snug">
                          {item.title}
                        </h2>
                        <span className="text-lg font-bold shrink-0">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      
                      {/* Condition Badge */}
                      <div className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded border border-amber-200">
                        {item.condition}
                      </div>

                      {/* Sustainability Meta Perks */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-emerald-700">
                        <span className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                          <Leaf className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                          Saves {item.co2Saved} CO₂ e
                        </span>
                        <span className="font-medium text-gray-500">
                          + {item.greenCreditsEarned} GC Rewards
                        </span>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-4 pt-3 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded border border-gray-300">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-gray-300">|</span>
                        <button 
                          onClick={() => removeItem(item.id, item.title)}
                          className="flex items-center gap-1 text-red-600 hover:underline cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Subtotal Footer inside item container */}
                <div className="text-right pt-4 text-base">
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}):{" "}
                  <span className="font-bold text-lg">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Checkout Widget */}
          {cartItems.length > 0 && (
            <div className="space-y-4">
              
              {/* Checkout Summary Box */}
              <div className="bg-white p-5 rounded-md border border-gray-200 shadow-sm space-y-4">
                <div className="text-sm text-gray-700">
                  <div className="text-base">
                    Subtotal ({totalItems} items):{" "}
                    <div className="font-black text-2xl text-gray-900 mt-1">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-medium py-2 rounded text-sm border border-amber-600/30 transition-all cursor-pointer shadow-sm text-center block"
                >
                  Proceed to Checkout
                </button>
              </div>

              {/* Sustainability Impact Checkout Ledger */}
              <div className="bg-emerald-900 text-white p-4 rounded-md shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Leaf className="h-24 w-24 fill-white text-white" />
                </div>
                
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Your Green Checkout Impact
                </h3>

                <div className="space-y-1.5 border-t border-emerald-800 pt-2 text-xs text-emerald-100">
                  <div className="flex justify-between">
                    <span>Carbon Footprint Offset:</span>
                    <span className="font-bold text-white">{totalCo2} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Green Credits To Claim:</span>
                    <span className="font-bold text-green-300">+{totalGc} GC</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}