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
import { Cart } from "@/pages/Cart";
import { Payment } from "@/pages/Payment";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import { MyProducts } from "@/pages/MyProducts";
import { Support } from "@/pages/Support";
import { Terms } from "@/pages/Terms";
import { Privacy } from "@/pages/Privacy";
import { AdminPanel } from "@/pages/AdminPanel";
import { Promotions } from "@/pages/Promotions";
import { NewProducts } from "@/pages/NewProducts";
import { ProductDetail } from '@/pages/ProductDetail';
import { NotFound } from '@/pages/NotFound';

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
            <Route path="/produto/:id" element={<ProductDetail />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/pagamento" element={<Payment />} />
            <Route path="/pagamento-sucesso" element={<PaymentSuccess />} />
            <Route path="/meus-produtos" element={<MyProducts />} />
            <Route path="/suporte" element={<Support />} />
            <Route path="/promocoes" element={<Promotions />} />
            <Route path="/novidades" element={<NewProducts />} />
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