import { useState } from "react";
import { logisticsData } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, Layers, DollarSign, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LogisticsTriage() {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const calculateTotals = () => {
    let totalItems = 0;
    let totalValue = 0;
    let pending = 0;

    Object.values(logisticsData).forEach(arr => {
      totalItems += arr.length;
      arr.forEach(item => {
        totalValue += item.originalPrice;
        if (item.action.includes("Warehouse") || item.action.includes("Repair")) {
          pending++;
        }
      });
    });

    return { totalItems, totalValue, pending };
  };

  const { totalItems, totalValue, pending } = calculateTotals();

  const KanbanCard = ({ item, colorTheme }: { item: any, colorTheme: string }) => {
    const bgClass = colorTheme === 'green' ? 'bg-green-50 border-green-200' :
                   colorTheme === 'blue' ? 'bg-blue-50 border-blue-200' :
                   colorTheme === 'purple' ? 'bg-purple-50 border-purple-200' :
                   'bg-orange-50 border-orange-200';
                   
    const textClass = colorTheme === 'green' ? 'text-green-800' :
                     colorTheme === 'blue' ? 'text-blue-800' :
                     colorTheme === 'purple' ? 'text-purple-800' :
                     'text-orange-800';

    return (
      <Card 
        className="mb-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-200" 
        onClick={() => setSelectedItem(item)}
        data-testid={`card-kanban-${item.id}`}
      >
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-500">{item.id}</span>
            <Badge variant="outline" className={`text-[10px] font-bold px-1.5 py-0 rounded ${bgClass} ${textClass}`}>
              {item.grade}/10
            </Badge>
          </div>
          <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">{item.item}</h4>
          <div className="text-sm text-gray-700 font-medium mb-3">₹{item.originalPrice.toLocaleString()}</div>
          
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
            <div className="flex items-center text-xs text-gray-600">
              <ArrowRight className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{item.action}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{item.location} ({item.distance})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 min-h-[calc(100vh-100px)]">
      {/* Summary Bar */}
      <div className="bg-[#232f3e] text-white p-4 flex flex-wrap gap-6 items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Processed</div>
            <div className="text-lg font-bold">{totalItems} Items</div>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-600 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Est. Recovery Value</div>
            <div className="text-lg font-bold text-green-400">₹{totalValue.toLocaleString()}</div>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-600 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Pending Routing</div>
            <div className="text-lg font-bold text-primary">{pending} Actions Req.</div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-4 flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-[1000px]">
          
          {/* Column 1 */}
          <div className="flex-1 flex flex-col max-w-[320px]">
            <div className="bg-white border-t-4 border-green-500 p-3 mb-3 shadow-sm rounded-t-sm">
              <h3 className="font-bold text-gray-900 text-sm flex justify-between items-center">
                Resell As-Is
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{logisticsData.resell.length}</Badge>
              </h3>
              <p className="text-xs text-gray-500 mt-1">High grade, route to central warehouses</p>
            </div>
            <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
              {logisticsData.resell.map(item => <KanbanCard key={item.id} item={item} colorTheme="green" />)}
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex-1 flex flex-col max-w-[320px]">
            <div className="bg-white border-t-4 border-blue-500 p-3 mb-3 shadow-sm rounded-t-sm">
              <h3 className="font-bold text-gray-900 text-sm flex justify-between items-center">
                Refurbish
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{logisticsData.refurbish.length}</Badge>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Minor damage, route to repair centers</p>
            </div>
            <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
              {logisticsData.refurbish.map(item => <KanbanCard key={item.id} item={item} colorTheme="blue" />)}
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex-1 flex flex-col max-w-[320px]">
            <div className="bg-white border-t-4 border-purple-500 p-3 mb-3 shadow-sm rounded-t-sm">
              <h3 className="font-bold text-gray-900 text-sm flex justify-between items-center">
                Peer-to-Peer
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{logisticsData.peer.length}</Badge>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Hyper-local match, ship direct to buyer</p>
            </div>
            <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
              {logisticsData.peer.map(item => <KanbanCard key={item.id} item={item} colorTheme="purple" />)}
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex-1 flex flex-col max-w-[320px]">
            <div className="bg-white border-t-4 border-orange-500 p-3 mb-3 shadow-sm rounded-t-sm">
              <h3 className="font-bold text-gray-900 text-sm flex justify-between items-center">
                Donate / Liquidate
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">{logisticsData.liquidate.length}</Badge>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Low value, optimize for zero landfill</p>
            </div>
            <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
              {logisticsData.liquidate.map(item => <KanbanCard key={item.id} item={item} colorTheme="orange" />)}
            </div>
          </div>

        </div>
      </div>

      {/* Modal Detail */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-md" data-testid="modal-logistics-detail">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">{selectedItem.id}</Badge>
                  <Badge className="bg-gray-900 hover:bg-gray-800">Grade: {selectedItem.grade}/10</Badge>
                </div>
                <DialogTitle className="text-xl">{selectedItem.item}</DialogTitle>
                <DialogDescription>Original MSRP: ₹{selectedItem.originalPrice.toLocaleString()}</DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Smart Routing Decision</h4>
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full border border-gray-200 shrink-0">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{selectedItem.action}</p>
                      <p className="text-xs text-gray-600 mt-1">Algorithm confidence: 94.2% based on distance and recovery value metrics.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Logistics Map</h4>
                  <div className="border border-gray-200 rounded-lg h-32 bg-[url('https://api.placeholder.com/600/300/e9ecef/a3a3a3?text=Map+View')] bg-cover bg-center flex items-center justify-center relative overflow-hidden">
                     {/* Simulated map placeholder */}
                     <div className="absolute inset-0 bg-gray-200/50 flex flex-col items-center justify-center">
                        <MapPin className="h-8 w-8 text-primary drop-shadow-md mb-1" />
                        <span className="bg-white px-2 py-1 rounded shadow text-xs font-bold text-gray-800">
                          {selectedItem.location} ({selectedItem.distance})
                        </span>
                     </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
