import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Cpu, AlertTriangle, CheckCircle2,
  Crosshair, Wrench, ShieldAlert, Loader2, XCircle
} from "lucide-react";
import { toast } from "sonner";
import api from "../lib/axios";

// ── Interfaces matching Express backend response shape ──────────────────────
interface ItemImage {
  id: string;
  itemId: string;
  imageUrl: string;
  imageType: string;
  createdAt: string;
}

interface Inspection {
  id: string;
  itemId: string;
  modelId: string;
  conditionScore: number;
  confidenceScore: number;
  grade: string;
  recommendedAction: string;
  safetyStatus: string;
  notes: string;
  createdAt: string;
}

interface Damage {
  type: string;
  confidence: number;
  bbox: number[];
  damagePercentage: number;
  grade: string;
}

interface AssessmentResult {
  orderId: string;
  itemId: string;
  resellPrice: string;
  conditionGrade: string;
  description: string;
  aiResult: any;           // Raw FastAPI response (stored for reference)
  backendData: {           // Express /items/:itemId/images response
    itemImage: ItemImage;
    inspection: Inspection;
    damages: Damage[];
  };
}

export default function AIAssessmentResults() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("aiAssessmentResult");
    if (!raw) {
      setError("No assessment data found. Please run a new AI scan from My Orders.");
      return;
    }
    try {
      const parsed: AssessmentResult = JSON.parse(raw);
      // Validate the minimum required shape
      if (!parsed.backendData?.inspection || !parsed.backendData?.itemImage) {
        setError("Assessment data is incomplete or malformed. Please re-submit.");
        return;
      }
      setResult(parsed);
    } catch {
      setError("Failed to parse assessment data. Please re-submit from My Orders.");
    }
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePushToMarketplace = async () => {
    if (!result) return;

    setIsPublishing(true);
    const toastId = toast.loading("Syncing with logistics and generating marketplace listing...");

    try {
      // Form payload matching your POST /v1/marketplace/listings Joi expectations
      const payload = {
        itemId: result.itemId,
        title: `Premium Refurbished Asset - Grade ${result.backendData.inspection.grade}`,
        description: result.description || `AI Inspected item with a condition score of ${result.backendData.inspection.conditionScore}/100.`,
        listingPrice: parseFloat(result.resellPrice),
      };

      const response = await api.post("/marketplace/listings", payload);
      console.log("✅ Marketplace listing creation success:", response.data);

      toast.success("Listing is Live! Product successfully routed through logistics.", { id: toastId });
      
      // Clear session footprint after a completed transaction sequence
      sessionStorage.removeItem("aiAssessmentResult");
      
      // Redirect straight to your marketplace exploration view or dashboard
      setLocation("/marketplace");
    } catch (err: any) {
      console.error("❌ Failed to push listing to logistics marketplace:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to make listing active.", { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "REFURBISH": return "bg-amber-100 text-amber-800 border-amber-300";
      case "RESELL":    return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "RECYCLE":   return "bg-red-100 text-red-800 border-red-300";
      case "DONATE":    return "bg-blue-100 text-blue-800 border-blue-300";
      case "DISPOSE":   return "bg-gray-100 text-gray-800 border-gray-300";
      default:          return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-emerald-600";
      case "B": return "text-blue-600";
      case "C": return "text-amber-500";
      case "D":
      case "F": return "text-red-500";
      default:  return "text-gray-600";
    }
  };

  const getDefectGradeBadge = (grade: string) => {
    switch (grade) {
      case "A": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "B": return "bg-blue-50 text-blue-700 border-blue-200";
      case "C": return "bg-amber-50 text-amber-700 border-amber-200";
      default:  return "bg-red-50 text-red-700 border-red-200";
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (!result && !error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-sm font-medium">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-md shadow-sm p-8 max-w-md w-full text-center">
          <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Results Unavailable</h2>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => setLocation("/my-orders")}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-sm rounded shadow-sm transition-colors cursor-pointer"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const { itemImage, inspection, damages } = result!.backendData;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Back Link */}
        <button
          onClick={() => setLocation("/my-orders")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors mb-6 cursor-pointer border-0 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </button>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Cpu className="h-6 w-6 text-amber-500" />
            AI Diagnostic Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Automated computer-vision analysis complete. Review the grading and recommended logistics routing below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Image & Meta */}
          <div className="lg:col-span-1 space-y-6">

            {/* Scanned Image */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
              <div className="bg-gray-100 p-3 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                <Crosshair className="h-4 w-4" /> Scanned Image
              </div>
              <div className="relative aspect-square bg-gray-900 flex items-center justify-center p-4">
                <img
                  src={itemImage.imageUrl}
                  alt="Scanned item"
                  className="max-h-full max-w-full object-contain rounded shadow-lg ring-1 ring-white/10"
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.2)_1px,transparent_1px)] bg-[size:100%_20px] opacity-20 pointer-events-none" />
              </div>
            </div>

            {/* Scan Meta */}
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Scan ID:</span>
                <span className="font-mono text-gray-900">{inspection.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confidence Score:</span>
                <span className="font-bold text-gray-900">
                  {(inspection.confidenceScore * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Self-Assessed:</span>
                <span className="font-bold text-gray-900">{result!.conditionGrade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resell Price:</span>
                <span className="font-bold text-gray-900">₹{result!.resellPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Safety Status:</span>
                {inspection.safetyStatus === "NEEDS_REVIEW" ? (
                  <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                    <ShieldAlert className="h-3 w-3" />
                    {inspection.safetyStatus.replace("_", " ")}
                  </span>
                ) : inspection.safetyStatus === "UNSAFE" ? (
                  <span className="flex items-center gap-1 text-red-700 bg-red-50 px-1.5 py-0.5 rounded font-bold">
                    <ShieldAlert className="h-3 w-3" /> UNSAFE
                  </span>
                ) : (
                  <span className="font-bold text-emerald-600">SAFE</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Score & Defects */}
          <div className="lg:col-span-2 space-y-6">

            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm flex flex-col justify-center items-center text-center">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Condition Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {inspection.conditionScore.toFixed(1)}
                  </span>
                  <span className="text-sm font-medium text-gray-400">/ 100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${inspection.conditionScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm flex flex-col justify-center items-center text-center">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Final Grade</p>
                <span className={`text-5xl font-black ${getGradeColor(inspection.grade)}`}>
                  {inspection.grade}
                </span>
              </div>
            </div>

            {/* Routing Action Banner */}
            <div className={`p-4 rounded-md border flex items-center justify-between shadow-sm ${getActionColor(inspection.recommendedAction)}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">
                  Recommended Routing Action
                </p>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  {inspection.recommendedAction}
                </h3>
              </div>
              <CheckCircle2 className="h-8 w-8 opacity-50" />
            </div>

            {/* Defects Table */}
            <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Detected Defects Log
                </h3>
                <p className="text-xs text-gray-600 mt-1">{inspection.notes}</p>
              </div>

              {damages && damages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white text-gray-500 border-b border-gray-200 text-xs">
                      <tr>
                        <th className="px-4 py-3 font-medium">Defect Type</th>
                        <th className="px-4 py-3 font-medium">Severity (Area %)</th>
                        <th className="px-4 py-3 font-medium">AI Confidence</th>
                        <th className="px-4 py-3 font-medium text-center">Impact Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {damages.map((defect, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 capitalize">
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 block shrink-0" />
                              {defect.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{defect.damagePercentage}%</td>
                          <td className="px-4 py-3 text-gray-600">
                            {(defect.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold border ${getDefectGradeBadge(defect.grade)}`}>
                              Grade {defect.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-gray-400">
                  No defects detected.
                </div>
              )}
            </div>

            {/* Description note if provided */}
            {result!.description && (
              <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm text-xs text-gray-600">
                <p className="font-bold text-gray-700 mb-1">Seller's Condition Note</p>
                <p>{result!.description}</p>
              </div>
            )}

            {/* Actions Footer Panel */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => setLocation("/my-orders")}
                className="px-5 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Dispute Assessment
              </button>
              
              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePushToMarketplace}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-2 rounded shadow-sm text-sm border border-amber-600/20 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPublishing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isPublishing ? "Publishing Listing..." : "Confirm & Push to Logistics"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}