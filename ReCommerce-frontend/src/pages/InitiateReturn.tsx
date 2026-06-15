import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Package, ShieldCheck, AlertCircle, HelpCircle, UploadCloud, FileImage, X } from "lucide-react";
import { toast } from "sonner";

export default function InitiateReturn() {
  const [, setLocation] = useLocation();
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [condition, setCondition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for Image Handling Pipeline
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local image picking file system events
  const handleImageChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image format (PNG, JPG).");
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    toast.info(`Selected image: ${file.name}`);
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  // Form submit running simulated asynchronous backend image processing pipeline
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !reason) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    // Step 1: Initializing Payload
    toast.loading("Initiating secure multi-part form payload transfer...", { id: "pipeline-toast" });

    setTimeout(() => {
      // Step 2: Simulated Backend S3/Storage Transfer Pipeline
      if (selectedImage) {
        toast.loading(`Uploading binary payload [${selectedImage.name}] to backend processing bucket...`, { id: "pipeline-toast" });
      } else {
        toast.loading("Processing textual metadata criteria...", { id: "pipeline-toast" });
      }

      setTimeout(() => {
        // Step 3: Triggering computer vision automated analysis model
        if (selectedImage) {
          toast.loading("Image received by backend. Running AI model diagnostic pipeline layer...", { id: "pipeline-toast" });
        }

        setTimeout(() => {
          setIsSubmitting(false);
          toast.dismiss("pipeline-toast");
          toast.success("Return framework registered! AI Grading Complete.", { duration: 4000 });
          setLocation("/"); // Redirect back to central dashboard
        }, 1500);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors mb-6 cursor-pointer group border-0 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="bg-white p-6 rounded-t-md border border-b-0 border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-amber-500" />
            Initiate a Return
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Provide your order details to generate your pre-paid sustainable logistics routing.
          </p>
        </div>

        {/* Informational Banner */}
        <div className="bg-emerald-50 border-x border-emerald-200 p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-normal">
            <span className="font-bold">Eco-Return Program Active:</span> By returning via ReCommerce, your item will undergo automated AI grading. High-quality items qualify for <strong>Peer-to-Peer Resale</strong> or instant <strong>Green Credits (GC)</strong>.
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 rounded-b-md border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Order ID Input */}
            <div>
              <label htmlFor="orderId" className="block text-sm font-bold text-gray-700 mb-1">
                Order ID / Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                id="orderId"
                type="text"
                required
                placeholder="e.g., ORD-2026-9912A"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            {/* Return Reason Selector */}
            <div>
              <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-1">
                Reason for Return <span className="text-red-500">*</span>
              </label>
              <select
                id="reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer"
              >
                <option value="">Select a reason...</option>
                <option value="defective">Performance or quality not expected</option>
                <option value="size">Size/Fit item doesn't fit properly</option>
                <option value="wrong-item">Received wrong item entirely</option>
                <option value="accidental">Accidental order/No longer needed</option>
              </select>
            </div>

            {/* IMAGE UPLOAD FIELD PIPELINE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                Upload Product Verification Image <span className="text-xs font-normal text-gray-400">(Highly Recommended)</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">Provide a clear photo to accelerate our automated neural condition assessment routing metrics.</p>
              
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
              />

              {!imagePreview ? (
                /* Drag & Drop Box active zone hook pointer placement */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors max-w-md ${
                    isDragging ? "border-amber-500 bg-orange-50/50" : "border-gray-300 bg-gray-50 hover:bg-gray-100/70"
                  }`}
                >
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Drag & drop your product photo here, or <span className="text-amber-600 underline">browse files</span></p>
                  <p className="text-[11px] text-gray-400 mt-1">Supports PNG, JPG, JPEG formats</p>
                </div>
              ) : (
                /* Image Active Upload Preview Deck */
                <div className="relative border border-gray-200 rounded-lg p-3 max-w-md bg-gray-50 flex items-center gap-3">
                  <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden flex items-center justify-center shrink-0 border border-gray-300">
                    <img src={imagePreview} alt="Upload Preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-gray-800 truncate flex items-center gap-1">
                      <FileImage className="h-3.5 w-3.5 text-amber-600" />
                      {selectedImage?.name}
                    </p>
                    <p className="text-gray-400 mt-0.5">Size: {((selectedImage?.size || 0) / (1024 * 1024)).toFixed(2)} MB</p>
                    <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Ready for pipeline processing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-gray-900 text-white p-1 rounded-full hover:bg-red-600 transition-colors cursor-pointer border-0 shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Optional condition evaluation context */}
            <div>
              <label htmlFor="condition" className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                Item Condition Note <span className="text-xs font-normal text-gray-400">(Optional)</span>
                <span className="group relative text-gray-400 hover:text-gray-600 cursor-help">
                  <HelpCircle className="h-4 w-4" />
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white font-normal text-[11px] p-2 rounded shadow w-48 z-10 leading-normal">
                    Helps speed up preliminary AI diagnostic score routing.
                  </span>
                </span>
              </label>
              <textarea
                id="condition"
                rows={3}
                placeholder="Describe current functionality, scratches, missing packaging, etc."
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <hr className="border-gray-200" />

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                Next Step: Print pre-paid label + AI Analysis upload box.
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-amber-500 hover:bg-amber-600 text-gray-950 font-medium px-6 py-2 rounded shadow-sm text-sm border border-amber-600/20 cursor-pointer select-none transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Processing Pipeline..." : "Submit Return Request"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}