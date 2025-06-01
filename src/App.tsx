
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WorkerAuth from "./pages/WorkerAuth";
import ServiceSearch from "./pages/ServiceSearch";
import WorkerProfile from "./pages/WorkerProfile";
import BookingFlow from "./pages/BookingFlow";
import ChatPage from "./pages/ChatPage";
import ClientDashboard from "./pages/ClientDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/worker-auth" element={<WorkerAuth />} />
            <Route path="/search" element={<ServiceSearch />} />
            <Route path="/worker/:id" element={<WorkerProfile />} />
            <Route path="/booking" element={<BookingFlow />} />
            <Route path="/chat/:jobId?" element={<ChatPage />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
