import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  UploadCloud,
  FileImage,
  X,
  Coins,
  Lock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "../lib/axios";

// ── TypeScript Interfaces matching your Express backend relational structure ──
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

interface Order {
  id: string;
  listingId: string;
  itemId: string;
  buyerId: number;
  finalPrice: string;
  status: string;
  listing: Listing;
  item: Item;
}

export default function InitiateResell() {
  const [, setLocation] = useLocation();

  // ── URL params ──────────────────────────────────────────────────────────────
  const [orderId, setOrderId] = useState("");
  const [itemId, setItemId] = useState("");

  // ── Context Data from Backend ────────────────────────────────────────────────
  const [itemData, setItemData] = useState<Item | null>(null);

  // ── Hardcoded MlModel ID — single model in DB ────────────────────────────────
  const ML_MODEL_ID = "cmqdivl4b000003t01ty1wta4";

  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [resellPrice, setResellPrice] = useState("");
  const [conditionGrade, setConditionGrade] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<string>("");

  // ── Image upload state ───────────────────────────────────────────────────────
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Read URL Parameters + Fetch Order and Active MlModel on Mount ────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("id");
    const itemFromUrl = params.get("itemId");

    if (itemFromUrl) {
      setItemId(itemFromUrl);
    } else {
      toast.warning("No item ID found in URL parameters.");
    }

    if (!idFromUrl) {
      toast.error("No order ID found — please start from My Orders.");
      setIsSyncing(false);
      return;
    }

    setOrderId(idFromUrl);
    setIsSyncing(true);

    api
      .get<Order>(`/orders/${idFromUrl}`)
      .then((response) => {
        if (response.data?.item) {
          setItemData(response.data.item);
          console.log("✅ Item details resolved:", response.data.item);
        } else {
          toast.error("Order found but contained no item data.");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to resolve order:", err);
        toast.error("Could not load order data. Please refresh and try again.");
      })
      .finally(() => {
        setIsSyncing(false);
      });
  }, []);

  // ── Image Dropzone Handlers ──────────────────────────────────────────────────
  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format. Please use PNG, JPG, or JPEG.");
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    toast.info(`Photo attached: ${file.name}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleImageChange(e.dataTransfer.files[0]);
  };
  const removeImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  // ── Form Submit Core Pipeline Execution ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: item metadata must be loaded
    if (!itemData) {
      toast.error(
        "Still syncing item data. Please wait a moment before resubmitting.",
      );
      return;
    }

    // ML_MODEL_ID is hardcoded — always present

    if (!orderId || !resellPrice || !conditionGrade) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }
    if (!selectedImage) {
      toast.error("Please upload a product image for AI assessment.");
      return;
    }
    if (!itemId) {
      toast.error("Item ID missing — cannot run assessment.");
      return;
    }

    setIsSubmitting(true);

    try {
      // ── Step 1: Send image to FastAPI AI service ──────────────────────────────
      setSubmitStep("Running AI damage detection...");
      toast.loading("Sending image to AI damage detection...", {
        id: "resell-pipeline",
      });

      const aiFormData = new FormData();
      aiFormData.append("file", selectedImage);

      const aiResponse = await fetch(
        "http://127.0.0.1:8000/ai/damage-detection",
        {
          method: "POST",
          body: aiFormData,
        },
      );

      if (!aiResponse.ok) {
        throw new Error(
          `AI service error: ${aiResponse.status} ${aiResponse.statusText}`,
        );
      }

      const aiResult = await aiResponse.json();
      console.log("✅ AI Response Payload:", aiResult);

      // ── Step 2: POST to /:itemId/images with image + correct MlModel ID ───────
      setSubmitStep("Saving inspection results...");
      toast.loading("Uploading inspection data...", { id: "resell-pipeline" });

      const backendFormData = new FormData();

      // Multer field key must match upload.single('image') exactly
      backendFormData.append("image", selectedImage);

      backendFormData.append("modelId", ML_MODEL_ID);

      const backendResponse = await api.post(
        `/items/${itemId}/images`,
        backendFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("✅ Inspection record created:", backendResponse.data);

      // ── Step 3: Pass results to the AI results screen ─────────────────────────
      toast.dismiss("resell-pipeline");
      toast.success("AI Assessment complete! Redirecting to results...", {
        duration: 3000,
      });

      sessionStorage.setItem(
        "aiAssessmentResult",
        JSON.stringify({
          orderId,
          itemId,
          resellPrice,
          conditionGrade,
          description,
          aiResult,
          backendData: backendResponse.data,
        }),
      );

      setLocation("/ai-results");
    } catch (err: any) {
      toast.dismiss("resell-pipeline");
      console.error("❌ Submission pipeline error:", err);

      if (err.message?.includes("AI service")) {
        toast.error(
          "AI service unreachable — ensure your FastAPI server is running on port 8000.",
        );
      } else if (
        err.response?.status === 404 &&
        err.config?.url?.includes("ml-models")
      ) {
        toast.error(
          "ML model not found — verify your /ml-models endpoint and database seed.",
        );
      } else {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred.",
        );
      }
    } finally {
      setIsSubmitting(false);
      setSubmitStep("");
    }
  };

  const isReady = !isSyncing && !!itemData;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased text-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => setLocation("/my-orders")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors mb-6 cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Orders
        </button>

        {/* Title Block */}
        <div className="bg-white p-6 rounded-t-md border border-b-0 border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Coins className="h-6 w-6 text-amber-500" />
            List Item for Resell
          </h1>
          {itemData && (
            <p className="text-xs text-amber-700 font-semibold mt-1 bg-amber-50 px-2 py-1 rounded inline-block border border-amber-200/40">
              {itemData.name} · {itemData.brand}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Provide your item specifics below to generate your automated resale
            listing.
          </p>
        </div>

        {/* Eco Incentive Banner */}
        <div className="bg-emerald-50 border-x border-emerald-200 p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-normal">
            <span className="font-bold">Eco-Listing Program Enabled:</span> By
            listing items directly on our resale exchange, you preserve circular
            value loops. Completed listings unlock{" "}
            <strong className="text-emerald-700">Green Credits (GC)</strong>{" "}
            bonuses automatically!
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white p-6 rounded-b-md border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-only + Price fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="orderId"
                  className="block text-sm font-bold text-gray-700 mb-1"
                >
                  Order Reference <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="orderId"
                    type="text"
                    readOnly
                    value={orderId}
                    placeholder="Loading..."
                    className="w-full px-3 py-2 pr-8 border border-gray-200 rounded bg-gray-50 text-gray-600 text-sm h-10 cursor-not-allowed font-mono tracking-tight"
                  />
                  <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Auto-filled from your order record
                </p>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-bold text-gray-700 mb-1"
                >
                  Target Resell Price (₹){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  required
                  placeholder="Enter asking price"
                  value={resellPrice}
                  onChange={(e) => setResellPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm h-10"
                />
              </div>
            </div>

            {/* Condition Grade */}
            <div>
              <label
                htmlFor="conditionGrade"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Item Condition <span className="text-red-500">*</span>
              </label>
              <select
                id="conditionGrade"
                required
                value={conditionGrade}
                onChange={(e) => setConditionGrade(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer h-10"
              >
                <option value="">Select condition...</option>
                <option value="Like New">
                  Like New (Perfect state, minimal cosmetic wear)
                </option>
                <option value="Good">
                  Good (Minor scuffs, fully functional)
                </option>
                <option value="Fair">
                  Fair (Noticeable marks, works perfectly)
                </option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Product Image <span className="text-red-500">*</span>{" "}
                <span className="text-gray-400 font-normal text-xs">
                  (Required for AI assessment)
                </span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                This photo is sent to our AI model for damage detection and
                condition scoring.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleImageChange(e.target.files[0])
                }
              />

              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 max-w-md ${
                    isDragging
                      ? "border-amber-500 bg-orange-50/50 scale-[0.99]"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100/70"
                  }`}
                >
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop your photo here, or{" "}
                    <span className="text-amber-600 underline">
                      browse files
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    PNG, JPG, JPEG supported
                  </p>
                </div>
              ) : (
                <div className="relative border border-gray-200 rounded-lg p-3 max-w-md bg-gray-50 flex items-center gap-3">
                  <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-300">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-gray-800 truncate flex items-center gap-1">
                      <FileImage className="h-3.5 w-3.5 text-amber-600" />
                      {selectedImage?.name}
                    </p>
                    <p className="text-gray-400 mt-0.5">
                      {((selectedImage?.size || 0) / (1024 * 1024)).toFixed(2)}{" "}
                      MB
                    </p>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Ready for AI scan
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-gray-900 text-white p-1 rounded-full hover:bg-red-600 transition-colors cursor-pointer border-0 shadow flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"
              >
                Condition Note{" "}
                <span className="text-xs font-normal text-gray-400">
                  (Optional)
                </span>
                <span className="group relative text-gray-400 hover:text-gray-600 cursor-help">
                  <HelpCircle className="h-4 w-4" />
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white font-normal text-[11px] p-2 rounded shadow w-48 z-10 leading-normal">
                    Helps buyers understand your item's current condition.
                  </span>
                </span>
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Detail any scratches, included accessories, packaging condition, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <hr className="border-gray-200" />

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                {isSubmitting ? (
                  <span className="text-amber-600 font-medium animate-pulse">
                    {submitStep}
                  </span>
                ) : isSyncing ? (
                  <span className="text-amber-600 font-medium">
                    Loading item and model data...
                  </span>
                ) : (
                  "Next: AI damage grading + inspection record creation."
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isReady}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-2 rounded shadow-sm text-sm border border-amber-600/20 cursor-pointer select-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit for AI Assessment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
