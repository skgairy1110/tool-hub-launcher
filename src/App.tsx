
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QrCodeGenerator from "./pages/QrCodeGenerator";
import ImageToTextConverter from "./pages/ImageToTextConverter";
import ImageCompressor from "./pages/ImageCompressor";
import PdfToPptConverter from "./pages/PdfToPptConverter";
import CaseConverter from "./pages/CaseConverter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qr-generator" element={<QrCodeGenerator />} />
          <Route path="/image-to-text" element={<ImageToTextConverter />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/pdf-to-ppt" element={<PdfToPptConverter />} />
          <Route path="/case-converter" element={<CaseConverter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
