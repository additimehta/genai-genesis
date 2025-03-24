
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import StartNow from "./pages/StartNow";
//import Costings from "./pages/Costings";
import Resources from "./components/Resources";
import NotFound from "./pages/NotFound";
import ReviewPage from "./pages/ReviewPage";
import ProcessingPage from "./pages/ProcessingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/start-now" element={<StartNow />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/review" element={<ReviewPage imageUrl="/placeholder.svg" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
