import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, RefreshCw, Leaf, ShieldCheck, AlertCircle, HelpCircle, FileText } from "lucide-react";
import { toast } from "sonner";

// Mock data representing returned items with sustainability classifications
const INITIAL_RETURNS = [
  {
    id: "RET-1092",
    orderId: "ORD-2026-9912A",
    name: "Nike Air Max 97",
    date: "Oct 24, 2023",
    score: 8.5,
    status: "Grading Complete",
    routing: "Peer-to-Peer Resale",
    isSustainable: true,
    greenCreditsEarned: 80,
    itemCondition: "Minor outer sole wear, fully functional structure."
  },
  {
    id: "RET-1094",
    orderId: "ORD-2026-3021X",
    name: "Sony WH-1000XM4 Headphones",
    date: "Oct 20, 2023",
    score: 6.2,
    status: "Routed to Hub",
    routing: "Refurbish & Repair",
    isSustainable: true,
    greenCreditsEarned: 45,
    itemCondition: "Left driver audio crackle, minor cosmetic scuffs."
  },
  {
    id: "RET-1095",
    orderId: "ORD-2026-1154F",
    name: "Levi's 501 Original Fit Jeans",
    date: "Oct 19, 2023",
    score: null,
    status: "Pending Inspection",
    routing: "Pending Assessment",
    isSustainable: false, // Disqualified from eco-routing due to severe staining/damage
    greenCreditsEarned: 0,
    itemCondition: "Severe accidental color bleeding stain, tear near hem."
  },
  {
    id: "RET-1097",
    orderId: "ORD-2026-0043M",
    name: "Samsung 4K Monitor",
    date: "Oct 12, 2023",
    score: 3.1,
    status: "Grading Complete",
    routing: "Donate / Local Recycle",
    isSustainable: true, // Handled via certified e-waste recovery instead of standard landfill trash
    greenCreditsEarned: 20,
    itemCondition: "Cracked panel matrix shield, power cycle logic fault."
  }
];

export default function MyReturns() {
  const [, setLocation] = useLocation();
  const [returnsList] = useState(INITIAL_RETURNS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Return statuses synchronized with AI grading network!");
    }, 800);
  };

  return (
    <div className="bg-[#f0f2f2] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Back Link */}
        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Page Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <RefreshCw className={`h-5 w-5 text-amber-500 ${isRefreshing ? "animate-spin" : ""}`} />
              Your Eco-Returns & Grading
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor AI diagnostic scores, lifecycle tracking, and carbon-offset validation.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 border border-gray-300 rounded shadow-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Status
          </button>
        </div>

        {/* Main Return Items List Stack */}
        <div className="space-y-4">
          {returnsList.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded-md shadow-sm overflow-hidden bg-white transition-all duration-200 ${
                item.isSustainable 
                  ? "border-l-4 border-l-emerald-500 border-gray-200" 
                  : "border-l-4 border-l-gray-400 border-gray-200"
              }`}
            >
              
              {/* Return Metadata Ribbon Bar */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-600">
                  <div>
                    <span className="text-gray-400 font-medium uppercase tracking-wider">Return Created:</span>{" "}
                    <span className="font-semibold text-gray-800">{item.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium uppercase tracking-wider">Return ID:</span>{" "}
                    <span className="font-mono font-bold text-gray-800">{item.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium uppercase tracking-wider">Original Order:</span>{" "}
                    <span className="font-mono text-blue-600 hover:underline cursor-pointer">{item.orderId}</span>
                  </div>
                </div>

                {/* Sustainability Status Stamp */}
                <div>
                  {item.isSustainable ? (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded border border-emerald-200 text-[10px] uppercase tracking-wide shadow-sm">
                      <Leaf className="h-3 w-3 fill-emerald-600 text-emerald-600" /> Sustainable Routing
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded border border-gray-200 text-[10px] uppercase tracking-wide shadow-sm">
                      <AlertCircle className="h-3 w-3 text-gray-500" /> Standard Landfill Flow
                    </span>
                  )}
                </div>
              </div>

              {/* Central Details Workspace */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row justify-between gap-6">
                
                {/* Left Area: Product Info & Conditions */}
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 leading-snug hover:text-blue-600 cursor-pointer">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium">Condition Note:</span> {item.itemCondition}
                    </p>
                  </div>

                  {/* Operational Data Badges */}
                  <div className="flex flex-wrap gap-3 pt-1">
                    <div className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded text-xs">
                      <span className="text-gray-400 font-medium">Status:</span>{" "}
                      <span className="font-bold text-gray-800">{item.status}</span>
                    </div>
                    <div className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded text-xs">
                      <span className="text-gray-400 font-medium">Eco-Destination:</span>{" "}
                      <span className="font-bold text-blue-700">{item.routing}</span>
                    </div>
                  </div>
                </div>

                {/* Right Area: AI Scores & Green Points Claim Metrics */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 gap-4 shrink-0 min-w-[180px]">
                  
                  {/* Score Indicator */}
                  <div className="text-left md:text-right">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center md:justify-end gap-1">
                      AI Health Rank
                      <span className="group relative cursor-help text-gray-400 hover:text-gray-600">
                        <HelpCircle className="h-3 w-3" />
                        <span className="absolute bottom-5 right-0 hidden group-hover:block bg-gray-900 text-white text-[9px] font-normal p-1.5 rounded shadow w-36 leading-normal normal-case z-10">
                          Automated inspection computer-vision scoring parameters.
                        </span>
                      </span>
                    </div>
                    <div className="text-xl font-black text-gray-900 mt-0.5">
                      {item.score !== null ? (
                        <>
                          {item.score}
                          <span className="text-xs font-normal text-gray-400">/10</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Pending</span>
                      )}
                    </div>
                  </div>

                  {/* Reclaimed Points Metric */}
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Credits Yielded</div>
                    <div className={`text-base font-black mt-0.5 ${item.greenCreditsEarned > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                      {item.greenCreditsEarned > 0 ? `+${item.greenCreditsEarned} GC` : "0 GC"}
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Incentive Footer (Only renders for eco items) */}
              {item.isSustainable && item.greenCreditsEarned > 0 && (
                <div className="bg-emerald-50/50 border-t border-emerald-100/60 px-4 py-2 flex items-center gap-1.5 text-[11px] text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 fill-emerald-100" />
                  <span>
                    Thank you for keeping supply chains circular! These points are available in your wallet for ecosystem reward redemptions.
                  </span>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}