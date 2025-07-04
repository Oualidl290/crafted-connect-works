import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import WorkerSearch from "./pages/WorkerSearch";
import Messages from "./pages/Messages";
import WorkerAuth from "./pages/WorkerAuth";
import ServiceSearch from "./pages/ServiceSearch";
import WorkerProfile from "./pages/WorkerProfile";
import WorkerProfileView from "./pages/WorkerProfileView";
import BookingFlow from "./pages/BookingFlow";
import ChatPage from "./pages/ChatPage";
import ClientDashboard from "./pages/ClientDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import NearbyWorkers from "./pages/NearbyWorkers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/workers" element={<WorkerSearch />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/worker-auth" element={<WorkerAuth />} />
              <Route path="/search" element={<ServiceSearch />} />
              <Route path="/nearby" element={<NearbyWorkers />} />
              <Route path="/worker/:id" element={<WorkerProfile />} />
              <Route path="/worker-profile/:id" element={<WorkerProfileView />} />
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
