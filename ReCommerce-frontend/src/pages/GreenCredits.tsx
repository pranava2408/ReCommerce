import { useLocation } from "wouter";
import { ArrowLeft, Leaf, Award, ShoppingBag, ArrowUpRight, ShieldCheck } from "lucide-react";
import { greenCreditsData } from "@/data/mockData";

export default function GreenCredits() {
  const [, setLocation] = useLocation();

  // Fallback data if totalCredits isn't available
  const totalCredits = greenCreditsData?.totalCredits || 340;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Back Link */}
        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors mb-6 cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        {/* Hero Score Card */}
        <div className="bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white rounded-t-md p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10">
            <Leaf className="h-48 w-48 text-white fill-white" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">
                Eco Champion Tier
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-2">
                Your Green Credits Statement
              </h1>
            </div>
            
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/10 shrink-0">
              <Leaf className="h-8 w-8 text-green-400 fill-green-400" />
              <div>
                <div className="text-2xl font-black text-green-400 leading-none">{totalCredits} GC</div>
                <div className="text-gray-300 text-[11px] mt-1 font-medium">Available Balance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Tracker Progress */}
        <div className="bg-white border-x border-gray-200 p-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-bold text-gray-700">Progress to Green Leader Tier</span>
            <span className="text-gray-500 font-medium">160 GC remaining</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${(totalCredits / 500) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Perks & Rewards catalog */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              Redeem Available Rewards
            </h2>
            
            <div className="bg-white border border-gray-200 rounded-md divide-y divide-gray-100 shadow-sm">
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-bold text-sm text-gray-800">₹200 Amazon Gift Coupon</div>
                  <div className="text-xs text-gray-500 mt-0.5">Applies instantly at checkout</div>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer">
                  Claim 200GC
                </button>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-bold text-sm text-gray-800">Free Eco-Return Logistics Handling</div>
                  <div className="text-xs text-gray-500 mt-0.5">Waives premium packaging assessments</div>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer">
                  Claim 150GC
                </button>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="font-bold text-sm text-gray-800">Priority AI Grading Queue Assignment</div>
                  <div className="text-xs text-gray-500 mt-0.5">Cuts grading evaluations down to 6 hours</div>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer">
                  Claim 100GC
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-amber-500" />
              How to Earn
            </h2>
            
            <div className="bg-white border border-gray-200 rounded-md p-4 space-y-3 shadow-sm text-xs text-gray-600 leading-relaxed">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p><strong>Opt for P2P Resale:</strong> Earn up to +80 GC per verified item match over raw recycling options.</p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p><strong>Eco Dropoff Hubs:</strong> Return items package-free at localized smart lockers for +25 GC rewards bonus.</p>
              </div>
              <div className="flex items-start gap-2">
                <ArrowUpRight className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-blue-600 hover:underline cursor-pointer font-medium">Read complete sustainability impact framework details.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}