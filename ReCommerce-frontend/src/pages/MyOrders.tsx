import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Package, Clock, HelpCircle, Leaf } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/axios";

interface Listing {
  id: string;
  itemId: string;
  sellerId: number;
  locationId: string;
  title: string;
  description: string;
  listingPrice: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Image {
  id: string;
  itemId: string;
  imageUrl: string;
  imageType: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface LocationData {
  id: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

interface Item {
  id: string;
  sku: string;
  name: string;
  brand: string;
  categoryId: string;
  originalPrice: string;
  metadata: any;
  ownerId: number;
  locationId: string;
  status: string;
  currentInspectionId: string | null;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  category: Category;
  location: LocationData;
}

interface Buyer {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  listingId: string;
  itemId: string;
  buyerId: number;
  finalPrice: string;
  status: string;
  listing: Listing;
  item: Item;
  buyer: Buyer;
}

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // No manual Authorization header needed —
        // axios.ts request interceptor attaches it automatically,
        // and the response interceptor refreshes + retries on 401.
        const response = await api.get<Order[]>("/orders/my-orders");
        setOrders(response.data);
      } catch (error: any) {
        // By the time we reach here, the interceptor already attempted
        // a token refresh and that also failed — user must log in again.
        if (error.response?.status === 401) {
          toast.error("Session expired — please log in again.");
        } else if (!error.response) {
          toast.error("Cannot reach server — check your backend is running.");
        } else {
          toast.error(`Something went wrong (${error.response.status}).`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // const claimActionCredits = (credits: number, orderId: string) => {
  //   if (credits === 0) {
  //     toast.info("Standard item tracking data updated.");
  //     return;
  //   }
  //   toast.success(
  //     `Eco-Action Verified! +${credits} Green Credits added for Order #${orderId}`,
  //   );
  //   window.dispatchEvent(new Event("storage"));
  // };

  // console.log(claimActionCredits);

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-gray-700" />
            Your Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track sustainable shipments, manage returns, and earn circular point
            tokens.
          </p>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-md">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No orders found on this account.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => {
            const isRefurbished = order.listing?.title
              ?.toLowerCase()
              .includes("refurbished");

            const frontImage =
              order.item?.images?.find((img) => img.imageType === "FRONT")
                ?.imageUrl ||
              order.item?.images?.[0]?.imageUrl ||
              "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&q=80";

            const createdDate = new Date(
              order.listing?.createdAt || Date.now(),
            );
            const returnExpiry = new Date(
              createdDate.getTime() + 30 * 24 * 60 * 60 * 1000,
            );
            const canReturn = Date.now() < returnExpiry.getTime();

            return (
              <div
                key={order.id}
                className={`border rounded-md shadow-sm overflow-hidden transition-all duration-200 ${
                  isRefurbished
                    ? "bg-emerald-50/70 border-emerald-200 shadow-[0_2px_8px_rgba(16,185,129,0.08)]"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`px-4 py-3 border-b flex flex-wrap gap-x-8 gap-y-2 text-xs justify-between items-center ${
                    isRefurbished
                      ? "bg-emerald-100/50 border-emerald-200 text-emerald-900"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                  }`}
                >
                  <div className="flex gap-x-8 gap-y-2">
                    <div>
                      <div className="uppercase font-medium text-gray-500 tracking-wider">
                        Order Placed
                      </div>
                      <div className="font-medium text-gray-800 mt-0.5">
                        {formatDate(order.listing?.createdAt)}
                      </div>
                    </div>
                    <div>
                      <div className="uppercase font-medium text-gray-500 tracking-wider">
                        Total Amount
                      </div>
                      <div className="font-bold text-gray-800 mt-0.5">
                        ₹{parseFloat(order.finalPrice).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <div className="uppercase font-medium text-gray-500 tracking-wider">
                        Ship To
                      </div>
                      <div className="text-blue-600 hover:underline cursor-pointer mt-0.5">
                        {order.buyer?.email
                          ? order.buyer.email.split("@")[0]
                          : "User"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isRefurbished && (
                      <span className="flex items-center gap-1 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                        <Leaf className="h-3 w-3 fill-white" /> Sustainable
                        Choice
                      </span>
                    )}
                    <div className="text-right text-gray-500">
                      Order ID #{" "}
                      <span className="font-mono text-gray-800 font-bold">
                        {order.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <img
                      src={frontImage}
                      alt={order.item?.name}
                      className="w-20 h-20 object-cover border border-gray-200 rounded shrink-0 bg-gray-50"
                    />

                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium text-sm text-gray-900 hover:text-blue-600 cursor-pointer transition-colors leading-tight">
                        {order.listing?.title || order.item?.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Brand: {order.item?.brand} | Category:{" "}
                        {order.item?.category?.name}
                      </p>
                      <p className="text-xs text-gray-400 italic line-clamp-1">
                        {order.listing?.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
                        <Clock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>
                          Status: <strong>{order.status}</strong>
                        </span>
                      </div>
                      {order.item?.location && (
                        <p className="text-[11px] text-gray-400 pt-1">
                          Location:{" "}
                          <span className="text-gray-600 font-medium">
                            {order.item.location.city},{" "}
                            {order.item.location.state}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="w-full sm:w-auto flex flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={() =>
                          setLocation(
                            `/initiate-resell?id=${order.id}&itemId=${order.itemId}&listingId=${order.listingId}`,
                          )
                        }
                        className="w-full sm:w-48 bg-amber-500 hover:bg-amber-600 text-gray-950 font-medium py-1.5 px-3 rounded text-xs transition-colors border border-amber-600/20 shadow-sm cursor-pointer text-center"
                      >
                        Initiate Resell
                      </button>

                      {canReturn ? (
                        <button
                          type="button"
                          onClick={() =>
                            setLocation(`/initiate-return?id=${order.id}`)
                          }
                          className="w-full sm:w-48 bg-white hover:bg-gray-50 text-gray-800 font-medium py-1.5 px-3 border border-gray-300 rounded text-xs transition-colors shadow-sm cursor-pointer text-center"
                        >
                          Initiate Return
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full sm:w-48 bg-gray-100 text-gray-400 font-normal py-1.5 px-3 border border-gray-200 rounded text-xs cursor-not-allowed text-center flex items-center justify-center gap-1"
                        >
                          Return Window Closed
                          <span className="group relative cursor-help text-gray-400">
                            <HelpCircle className="h-3.5 w-3.5" />
                            <span className="absolute bottom-6 right-0 hidden group-hover:block bg-gray-900 text-white text-[10px] font-normal p-2 rounded shadow w-40 leading-normal normal-case z-10">
                              Exceeded 30-day standard merchant refund policy.
                            </span>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
