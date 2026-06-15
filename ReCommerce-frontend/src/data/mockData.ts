export const returnHistoryData = [
  { id: "RET-1092", item: "Nike Air Max 97", condition: "Good", status: "Grading Complete", date: "Oct 24, 2023", route: "Peer-to-Peer", score: 8.5 },
  { id: "RET-1093", item: "Apple iPad Pro 11\"", condition: "Like New", status: "Sold", date: "Oct 22, 2023", route: "Resell As-Is", score: 9.8 },
  { id: "RET-1094", item: "Sony WH-1000XM4", condition: "Fair", status: "Routed", date: "Oct 20, 2023", route: "Refurbish", score: 6.2 },
  { id: "RET-1095", item: "Levi's 501 Original Fit", condition: "Good", status: "Pending", date: "Oct 19, 2023", route: "Pending", score: null },
  { id: "RET-1096", item: "Atomic Habits (Book)", condition: "Like New", status: "Sold", date: "Oct 15, 2023", route: "Resell As-Is", score: 9.5 },
  { id: "RET-1097", item: "Samsung 4K Monitor", condition: "Poor", status: "Grading Complete", date: "Oct 12, 2023", route: "Donate/Liquidate", score: 3.1 },
  { id: "RET-1098", item: "Adidas Ultraboost", condition: "Good", status: "Routed", date: "Oct 10, 2023", route: "Peer-to-Peer", score: 7.9 },
  { id: "RET-1099", item: "Kindle Paperwhite", condition: "Like New", status: "Pending", date: "Oct 09, 2023", route: "Pending", score: null },
];

export const logisticsData = {
  resell: [
    { id: "LOG-1", item: "Apple iPhone 13 Pro", grade: 9.4, originalPrice: 65000, action: "Route to Central Warehouse", location: "Mumbai Hub", distance: "4.5 km" },
    { id: "LOG-2", item: "Dell XPS 27\"", grade: 9.1, originalPrice: 42000, action: "Route to Central Warehouse", location: "Delhi Hub", distance: "12 km" },
    { id: "LOG-3", item: "Dyson V11 Vacuum", grade: 8.9, originalPrice: 38000, action: "Route to Central Warehouse", location: "Bangalore Hub", distance: "8.2 km" }
  ],
  refurbish: [
    { id: "LOG-4", item: "Sony WH-1000XM4", grade: 6.2, originalPrice: 24990, action: "Route to Repair Center", location: "Pune Repair Facility", distance: "15 km" },
    { id: "LOG-5", item: "Bose QuietComfort 45", grade: 5.8, originalPrice: 29900, action: "Route to Repair Center", location: "Pune Repair Facility", distance: "15 km" }
  ],
  peer: [
    { id: "LOG-6", item: "Nike Air Max 97", grade: 8.5, originalPrice: 14995, action: "Hyper-local match", location: "Matched with Buyer", distance: "2.1 miles" },
    { id: "LOG-7", item: "Levi's 501 Original", grade: 8.1, originalPrice: 3299, action: "Hyper-local match", location: "Matched with Buyer", distance: "0.8 miles" },
    { id: "LOG-8", item: "Adidas Ultraboost", grade: 7.9, originalPrice: 15999, action: "Hyper-local match", location: "Matched with Buyer", distance: "3.4 miles" },
    { id: "LOG-9", item: "Puma Nitefox", grade: 8.0, originalPrice: 8999, action: "Hyper-local match", location: "Matched with Buyer", distance: "1.2 miles" }
  ],
  liquidate: [
    { id: "LOG-10", item: "Generic T-Shirt", grade: 2.1, originalPrice: 499, action: "Local disposal", location: "NGO Partner", distance: "5.0 km" },
    { id: "LOG-11", item: "Broken USB Hub", grade: 1.0, originalPrice: 899, action: "E-Waste Recycling", location: "Recycling Plant", distance: "8.5 km" },
    { id: "LOG-12", item: "Torn Jeans", grade: 1.5, originalPrice: 1299, action: "Textile Recycling", location: "Recycling Plant", distance: "8.5 km" }
  ]
};

export const greenCreditsData = {
  totalCredits: 340,
  level: "Eco Champion",
  nextLevel: "Green Leader",
  creditsToNext: 160,
  history: [
    { id: "GC-1", action: "Returned Nike Air Max instead of trashing", credits: 80, date: "Oct 24, 2023", icon: "recycle" },
    { id: "GC-2", action: "Chose P2P resale over warehouse routing", credits: 50, date: "Oct 22, 2023", icon: "leaf" },
    { id: "GC-3", action: "Donated Samsung Monitor to NGO", credits: 120, date: "Oct 12, 2023", icon: "heart" },
    { id: "GC-4", action: "Refurbished Levi's instead of liquidating", credits: 40, date: "Oct 10, 2023", icon: "wrench" },
    { id: "GC-5", action: "Opted for eco-friendly packaging", credits: 50, date: "Oct 09, 2023", icon: "package" },
  ],
  rewards: [
    { title: "₹200 off your next purchase", cost: 200, available: true },
    { title: "Free eco-return shipping", cost: 150, available: true },
    { title: "Priority AI grading slot", cost: 100, available: true },
  ]
};

export const p2pListings = [
  { id: "P2P-1", item: "Adidas Ultraboost 22 – Size 10", askingPrice: 9200, condition: "Good", score: 7.9, distance: "1.2 miles", listedBy: "Rahul M.", time: "2 hours ago", matched: true },
  { id: "P2P-2", item: "Levi's 501 Jeans – Size 32", askingPrice: 1400, condition: "Good", score: 8.1, distance: "0.8 miles", listedBy: "Priya K.", time: "5 hours ago", matched: true },
  { id: "P2P-3", item: "iPhone 12 (64GB) – Black", askingPrice: 18000, condition: "Fair", score: 6.5, distance: "3.4 miles", listedBy: "Amir S.", time: "Yesterday", matched: false },
];

export const personalizedRecommendations = [
  { id: "REC-1", name: "Apple AirPods Pro (2nd Gen) – Certified Refurbished", originalPrice: 24900, price: 14900, condition: "Like New", score: 9.2, reason: "Based on your iPhone purchase", certified: true },
  { id: "REC-2", name: "Nike Air Max 270 – Size 9 – Open Box", originalPrice: 12995, price: 7200, condition: "Like New", score: 9.0, reason: "Matches your size profile", certified: true },
  { id: "REC-3", name: "Levi's 512 Slim Taper – Size 32", originalPrice: 3799, price: 1800, condition: "Good", score: 8.3, reason: "You bought similar styles", certified: true },
  { id: "REC-4", name: "Sony WF-1000XM4 Earbuds – Refurbished", originalPrice: 19990, price: 11500, condition: "Good", score: 8.1, reason: "Popular with your peer group", certified: true },
  { id: "REC-5", name: "Samsung Galaxy Watch 5 – Open Box", originalPrice: 27999, price: 16000, condition: "Like New", score: 9.3, reason: "Trending in your area", certified: false },
];

export const returnRiskData: Record<string, { riskLevel: "low" | "medium" | "high"; reason: string; returnRate: number }> = {
  "MKT-3": { riskLevel: "high", reason: "Frequently returned — sizing varies by lot", returnRate: 38 },
  "MKT-4": { riskLevel: "high", reason: "High return rate for this size", returnRate: 42 },
  "MKT-7": { riskLevel: "medium", reason: "Some buyers report fit runs small", returnRate: 21 },
  "MKT-9": { riskLevel: "medium", reason: "Comfort reports vary", returnRate: 19 },
};

export const marketplaceProducts = [
  { id: "MKT-1", name: "Apple iPhone 13 Pro (128GB)", originalPrice: 65000, price: 42000, condition: "Like New", score: 9.4, category: "Electronics", history: "Returned once - ordered wrong color", warranty: "Active (6 months)" },
  { id: "MKT-2", name: "Nike Air Max 97 - Size 9", originalPrice: 14995, price: 8500, condition: "Good", score: 8.5, category: "Shoes", history: "Never returned", warranty: "Expired" },
  { id: "MKT-3", name: "Sony WH-1000XM4 Headphones", originalPrice: 24990, price: 15000, condition: "Fair", score: 6.2, category: "Electronics", history: "Refurbished - earpad replaced", warranty: "Active (3 months)" },
  { id: "MKT-4", name: "Levi's 501 Original Fit Jeans", originalPrice: 3299, price: 1400, condition: "Good", score: 8.1, category: "Clothing", history: "Returned twice - sizing issue", warranty: "Expired" },
  { id: "MKT-5", name: "Atomic Habits by James Clear", originalPrice: 499, price: 250, condition: "Like New", score: 9.5, category: "Books", history: "Never returned", warranty: "N/A" },
  { id: "MKT-6", name: "Samsung Galaxy Tab S7", originalPrice: 45000, price: 31000, condition: "Good", score: 8.8, category: "Electronics", history: "Returned once - buyer remorse", warranty: "Active (2 months)" },
  { id: "MKT-7", name: "Adidas Ultraboost 22 - Size 10", originalPrice: 15999, price: 9200, condition: "Good", score: 7.9, category: "Shoes", history: "Returned once - fit issue", warranty: "Expired" },
  { id: "MKT-8", name: "Dell XPS 27\" Monitor", originalPrice: 42000, price: 28000, condition: "Like New", score: 9.1, category: "Electronics", history: "Never returned", warranty: "Active (8 months)" },
  { id: "MKT-9", name: "Bose QuietComfort 45", originalPrice: 29900, price: 18500, condition: "Fair", score: 5.8, category: "Electronics", history: "Refurbished - headband repaired", warranty: "Active (1 month)" },
  { id: "MKT-10", name: "Apple Watch Series 7", originalPrice: 41900, price: 26000, condition: "Good", score: 8.2, category: "Watches", history: "Returned once - upgraded to Ultra", warranty: "Expired" },
  { id: "MKT-11", name: "Puma Nitefox Sneakers - Size 8", originalPrice: 8999, price: 4200, condition: "Good", score: 8.0, category: "Shoes", history: "Never returned", warranty: "Expired" },
  { id: "MKT-12", name: "Dyson V11 Vacuum Cleaner", originalPrice: 38000, price: 25000, condition: "Like New", score: 8.9, category: "Electronics", history: "Returned once - too heavy for user", warranty: "Active (11 months)" }
];
