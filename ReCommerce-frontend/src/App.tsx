import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AmazonHeader } from "@/components/AmazonHeader";
// import { ToastScheduler } from "@/components/ToastScheduler";
import SellerDashboard from "@/pages/SellerDashboard";
import LogisticsTriage from "@/pages/LogisticsTriage";
import Marketplace from "@/pages/Marketplace";
import BuyNew from "@/pages/BuyNew";
import P2PResale from "@/pages/P2PResale";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InitiateReturn from "@/pages/InitiateReturn";
import GreenCredits from "@/pages/GreenCredits";
import Cart from "@/pages/Cart";
import MyOrders from "@/pages/MyOrders";
import UserHome from "@/pages/UserHome";
import MyReturns from "@/pages/MyReturns";
import InitiateResell from "@/pages/InitiateResell";
import AIAssessmentResults from "@/pages/AIAssessmentResults";
const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={UserHome} />
      <Route path="/logistics" component={LogisticsTriage} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/buy-new" component={BuyNew} />
      <Route path="/p2p" component={P2PResale} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/initiate-return" component={InitiateReturn} />
      <Route path="/green-credits" component={GreenCredits} />
      <Route path="/cart" component={Cart} />
      <Route path="/my-orders" component={MyOrders} />
      <Route path="/admin" component={SellerDashboard} />
      <Route path="/my-returns" component={MyReturns} />
      <Route path="/initiate-resell" component={InitiateResell} />
      <Route path="/ai-results" component={AIAssessmentResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Created a small wrapper component so we can use the `useLocation` hook safely inside the Router context
function AppContent() {
  const [location] = useLocation();

  // Check if user is on authentication routes
  const isAuthPage = location === "/login" || location === "/register";
  
  // Optional: Check if token exists in storage if you use basic local token-based auth
  const isLoggedIn = true; // Replace with your real check, e.g., !!localStorage.getItem("token")

  const shouldShowHeader = isLoggedIn && !isAuthPage;

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground">
      {/* Conditionally render the header */}
      {shouldShowHeader && <AmazonHeader />}
      
      <main className="flex-1">
        <Router />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
        <SonnerToaster position="bottom-right" />
        {/* <ToastScheduler /> */}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;