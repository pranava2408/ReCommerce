import { useState } from "react";
import { returnHistoryData, greenCreditsData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCcw, Leaf, Gift, Recycle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLocation } from "wouter";
export default function SellerDashboard() {
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<null | any>(null);
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const simulateUpload = () => {
    setIsUploading(true);
    setAssessmentResult(null);
    const delay = Math.floor(Math.random() * 400) + 1500;
    setTimeout(() => {
      setIsUploading(false);
      setAssessmentResult({
        condition: "Minor Scratches",
        score: 7.2,
        value: "₹1,250",
        route: "Peer-to-Peer Match",
        routeColor: "bg-purple-100 text-purple-800 border-purple-200",
        greenCredits: 50,
      });
    }, delay);
  };

  const handleRedeem = (reward: { title: string; cost: number }) => {
    setRedeemed(reward.title);
    toast.success(`Redeemed: ${reward.title}`, {
      description: `${reward.cost} Green Credits used. Remaining: ${greenCreditsData.totalCredits - reward.cost} GC`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Grading Complete": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Grading Complete</Badge>;
      case "Routed": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Routed</Badge>;
      case "Sold": return <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">Sold</Badge>;
      case "Pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const creditProgress = Math.round((greenCreditsData.totalCredits / (greenCreditsData.totalCredits + greenCreditsData.creditsToNext)) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller & Return Dashboard</h1>
          <p className="text-sm text-gray-600">Manage your returns, track AI assessments, and view logistics routing.</p>
        </div>
        <Button onClick={() => setLocation("/initiate-return")}
        className="bg-primary hover:bg-accent text-black font-bold border border-primary-border shadow-sm" data-testid="button-initiate-return">
          Initiate Return
        </Button>
      </div>

      {/* Green Credits Banner */}
      <div className="bg-gradient-to-r from-[#1a2e1a] to-[#0d3320] rounded-lg p-4 text-white" data-testid="section-green-credits">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 shrink-0">
              <Leaf className="h-6 w-6 text-green-400 fill-green-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-green-400">{greenCreditsData.totalCredits}</span>
                <span className="text-sm text-gray-300">Green Credits</span>
                <Badge className="bg-green-700 text-green-100 hover:bg-green-600 text-[10px]">{greenCreditsData.level}</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{greenCreditsData.creditsToNext} more to reach <strong className="text-green-300">{greenCreditsData.nextLevel}</strong></p>
              <div className="mt-1.5 h-1.5 bg-green-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${creditProgress}%` }} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {greenCreditsData.rewards.map(reward => (
              <button
                key={reward.title}
                onClick={() => handleRedeem(reward)}
                disabled={redeemed === reward.title}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${redeemed === reward.title ? "bg-green-900/40 border-green-800 text-green-600 cursor-not-allowed" : "bg-green-500/10 border-green-500/40 text-green-300 hover:bg-green-500/20 cursor-pointer"}`}
                data-testid={`button-redeem-${reward.cost}`}
              >
                <Gift className="h-3 w-3" />
                {reward.title} <span className="text-green-500 font-black ml-0.5">{reward.cost}GC</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary fill-primary" />
                Upload Item for AI Grading
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!assessmentResult && !isUploading && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={simulateUpload}
                  data-testid="zone-upload"
                >
                  <UploadCloud className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">Drag and drop images</p>
                  <p className="text-xs text-gray-500 mb-4">or click to browse from device</p>
                  <Button variant="outline" size="sm" className="w-full text-xs font-medium" data-testid="button-simulate-upload">
                    Simulate Upload
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="border-2 border-gray-100 rounded-lg p-8 text-center bg-gray-50" data-testid="state-uploading">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <Zap className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">AI Vision Analyzing...</p>
                  <p className="text-xs text-gray-500 mt-1">Scanning for defects and verifying authenticity</p>
                </div>
              )}

              {assessmentResult && (
                <div className="border border-gray-200 rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="card-assessment-result">
                  <div className="bg-green-50 px-4 py-3 border-b border-green-100 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-sm text-green-800">Assessment Complete</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Condition Grade</span>
                      <span className="font-bold text-sm">{assessmentResult.condition} <span className="text-gray-400 ml-1">({assessmentResult.score}/10)</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Est. Resale Value</span>
                      <span className="font-bold text-sm text-green-700">{assessmentResult.value}</span>
                    </div>
                    {/* Green credits earned */}
                    <div className="flex justify-between items-center bg-green-50 border border-green-100 rounded px-3 py-2">
                      <span className="text-xs text-green-700 flex items-center gap-1"><Leaf className="h-3 w-3 fill-green-500 text-green-500" /> Green Credits Earned</span>
                      <span className="font-black text-sm text-green-600">+{assessmentResult.greenCredits} GC</span>
                    </div>
                    <div className="pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-500 block mb-2">Recommended Route</span>
                      <Badge className={`w-full justify-center py-1.5 ${assessmentResult.routeColor}`} variant="outline">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {assessmentResult.route}
                      </Badge>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" className="flex-1 text-xs" onClick={() => setAssessmentResult(null)} data-testid="button-cancel-assessment">Cancel</Button>
                      <Button className="flex-1 bg-primary hover:bg-accent text-black font-bold text-xs" data-testid="button-submit-return">Submit Return</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Green Credits History */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Recycle className="h-4 w-4 text-green-600" />
                Sustainability Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {greenCreditsData.history.map((item, idx) => (
                <div key={item.id} className={`flex items-center gap-3 px-4 py-2.5 text-xs ${idx < greenCreditsData.history.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Leaf className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium leading-snug truncate">{item.action}</p>
                    <p className="text-gray-400 mt-0.5">{item.date}</p>
                  </div>
                  <span className="font-black text-green-600 shrink-0">+{item.credits}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm bg-blue-50/50">
            <CardContent className="p-4 flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900">Seller Protection Active</h4>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">Your items are automatically insured during the AI grading process. Fraudulent returns are flagged immediately.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-gray-200 shadow-sm h-full">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Recent Returns & Activity</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" data-testid="button-refresh-history">
                <RefreshCcw className="h-3 w-3 mr-1" /> Refresh
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-700">Item</TableHead>
                    <TableHead className="font-bold text-gray-700 hidden md:table-cell">Date</TableHead>
                    <TableHead className="font-bold text-gray-700 text-center">AI Score</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                    <TableHead className="font-bold text-gray-700 hidden sm:table-cell">Routing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnHistoryData.map((row) => (
                    <TableRow key={row.id} className="cursor-pointer hover:bg-gray-50" data-testid={`row-history-${row.id}`}>
                      <TableCell className="font-medium text-sm">
                        <div className="text-primary hover:underline">{row.id}</div>
                        <div className="text-gray-900">{row.item}</div>
                        <div className="text-xs text-gray-500 sm:hidden mt-1">{row.route}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 hidden md:table-cell">{row.date}</TableCell>
                      <TableCell className="text-center">
                        {row.score ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                            {row.score}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600 hidden sm:table-cell">{row.route}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
