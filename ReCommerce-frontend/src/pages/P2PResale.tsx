import { useState } from "react";
import { p2pListings } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Zap, CheckCircle2, MessageCircle, Tag, Plus, Shield } from "lucide-react";
import { toast } from "sonner";

export default function P2PResale() {
  const [listings, setListings] = useState(p2pListings);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ item: "", price: "", condition: "Good" });

  const handleList = () => {
    if (!formData.item || !formData.price) return;
    const newListing = {
      id: `P2P-${Date.now()}`,
      item: formData.item,
      askingPrice: parseInt(formData.price),
      condition: formData.condition,
      score: 7.5,
      distance: "0.5 miles",
      listedBy: "You",
      time: "Just now",
      matched: false,
    };
    setListings([newListing, ...listings]);
    setShowForm(false);
    setFormData({ item: "", price: "", condition: "Good" });
    toast.success("Listed for P2P Resale! We'll notify you when a nearby buyer is matched.", {
      description: "You'll also earn Green Credits once the item is sold.",
    });
  };

  const handleContact = (listing: typeof p2pListings[0]) => {
    toast.success(`Message sent to ${listing.listedBy}!`, {
      description: "They'll respond within the ReCommerce trusted messenger.",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Peer-to-Peer Resale</h1>
          <p className="text-sm text-gray-600">Sell directly to trusted buyers in your neighbourhood — no middleman, lower fees.</p>
        </div>
        <Button
          className="bg-primary hover:bg-accent text-black font-bold border border-primary-border shadow-sm flex items-center gap-2"
          onClick={() => setShowForm(!showForm)}
          data-testid="button-list-p2p"
        >
          <Plus className="h-4 w-4" />
          List an Item
        </Button>
      </div>

      {/* Trust banner */}
      <div className="bg-[#131921] text-white rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Shield className="h-8 w-8 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Transact inside Amazon's Trusted Ecosystem</h3>
            <p className="text-xs text-gray-300 mt-0.5">All P2P transactions are escrow-protected. Payment held until buyer confirms receipt. Seller identity verified via ReCommerce KYC.</p>
          </div>
        </div>
        <div className="flex gap-4 text-center shrink-0">
          <div>
            <div className="text-xl font-black text-primary">₹0</div>
            <div className="text-[10px] text-gray-400">Listing Fee</div>
          </div>
          <div>
            <div className="text-xl font-black text-primary">3%</div>
            <div className="text-[10px] text-gray-400">Transaction Fee</div>
          </div>
          <div>
            <div className="text-xl font-black text-green-400">+50</div>
            <div className="text-[10px] text-gray-400">Green Credits</div>
          </div>
        </div>
      </div>

      {/* List item form */}
      {showForm && (
        <Card className="border-primary border-2 shadow-md animate-in fade-in slide-in-from-top-2 duration-200" data-testid="form-list-item">
          <CardHeader className="pb-3 bg-orange-50 border-b border-orange-100">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              List Item for P2P Resale
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">Item Name</label>
                <Input
                  placeholder="e.g. Nike Air Max 97 – Size 10"
                  value={formData.item}
                  onChange={e => setFormData({ ...formData, item: e.target.value })}
                  data-testid="input-p2p-item"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Asking Price (₹)</label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  data-testid="input-p2p-price"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Condition</label>
              <div className="flex gap-2">
                {["Like New", "Good", "Fair"].map(c => (
                  <button
                    key={c}
                    onClick={() => setFormData({ ...formData, condition: c })}
                    className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${formData.condition === c ? "bg-primary border-primary text-black" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}
                    data-testid={`button-condition-${c.replace(" ", "-").toLowerCase()}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-xs text-green-800">AI will automatically grade your item — no manual photos needed if you've already submitted a return for this item.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)} data-testid="button-cancel-list">Cancel</Button>
              <Button className="bg-primary hover:bg-accent text-black font-bold" size="sm" onClick={handleList} data-testid="button-submit-list">
                List Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: "Nearby Buyers", value: "24", color: "text-blue-600" },
          { icon: MapPin, label: "Avg Match Distance", value: "1.8 mi", color: "text-purple-600" },
          { icon: Zap, label: "Avg Time to Sell", value: "3.2 days", color: "text-primary" },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
            <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
            <div className="text-lg font-black text-gray-900">{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active Listings */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Active Nearby Listings
        </h2>
        <div className="space-y-3">
          {listings.map(listing => (
            <Card key={listing.id} className="border border-gray-200 shadow-sm hover:border-gray-300 transition-colors" data-testid={`card-p2p-${listing.id}`}>
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-gray-900">{listing.item}</h3>
                    {listing.matched && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-[10px]" variant="outline">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> AI Matched
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{listing.distance}</span>
                    <span>Listed by <strong className="text-gray-700">{listing.listedBy}</strong></span>
                    <span>{listing.time}</span>
                    <Badge variant="outline" className="text-[10px]">AI: {listing.score}/10</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-900">₹{listing.askingPrice.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">{listing.condition}</div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-accent text-black font-bold flex items-center gap-1"
                    onClick={() => handleContact(listing)}
                    data-testid={`button-contact-${listing.id}`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
