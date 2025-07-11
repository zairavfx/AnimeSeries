import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import VPS from "@/pages/vps";
import Hosting from "@/pages/hosting";
import Domains from "@/pages/domains";
import WebsiteMaking from "@/pages/website-making";
import TelegramBot from "@/pages/telegram-bot";
import Contact from "@/pages/contact";
import AdminPanel from "@/pages/admin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/vps" component={VPS} />
          <Route path="/hosting" component={Hosting} />
          <Route path="/domains" component={Domains} />
          <Route path="/website-making" component={WebsiteMaking} />
          <Route path="/telegram-bot" component={TelegramBot} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin/:tab?" component={AdminPanel} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-rich-black text-white relative overflow-x-hidden">
          {/* Background Effects */}
          <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />
          <div className="fixed inset-0 bg-gradient-to-br from-rich-black via-charcoal to-steel-gray pointer-events-none" />
          
          {/* Floating Particles */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="particle" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
            <div className="particle" style={{ top: '60%', left: '80%', animationDelay: '1s' }} />
            <div className="particle" style={{ top: '40%', left: '60%', animationDelay: '2s' }} />
            <div className="particle" style={{ top: '80%', left: '30%', animationDelay: '3s' }} />
          </div>

          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
