import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Header } from "@/components/Header";
import { CookieBanner } from "@/components/CookieBanner";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Store } from "@/pages/Store";
import { Category } from "@/pages/Category";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { AdminPanel } from "@/pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="moz-store-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/loja" element={<Store />} />
                <Route path="/categoria/:categoryId" element={<Category />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/painel" element={<AdminPanel />} />
                {/* Add more routes as needed */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieBanner />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;