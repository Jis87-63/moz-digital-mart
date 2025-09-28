import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Shield, 
  Smartphone, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Store,
  Users,
  Star
} from 'lucide-react';
import { bannerService } from '@/lib/products';
import { Banner } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';

// Default banners if none are found in Firebase
const defaultBanners = [
  {
    id: 'default-1',
    title: "Produtos Digitais Premium",
    subtitle: "A melhor experiência em Moçambique",
    image: "/api/placeholder/800/300",
    color: "from-blue-600 to-blue-800",
    isActive: true,
    order: 1,
    createdAt: new Date()
  },
  {
    id: 'default-2',
    title: "Pagamentos Seguros",
    subtitle: "Mpesa - Transferência instantânea",
    image: "/api/placeholder/800/300",
    color: "from-green-600 to-green-800",
    isActive: true,
    order: 2,
    createdAt: new Date()
  },
  {
    id: 'default-3',
    title: "Suporte 24/7",
    subtitle: "Estamos sempre aqui para ajudar",
    image: "/api/placeholder/800/300",
    color: "from-purple-600 to-purple-800",
    isActive: true,
    order: 3,
    createdAt: new Date()
  }
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const activeBanners = await bannerService.getActiveBanners();
        if (activeBanners.length > 0) {
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error('Error loading banners:', error);
        // Keep default banners on error
      } finally {
        setBannersLoading(false);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-grok-primary to-primary bg-clip-text text-transparent mb-6">
                Moz Store Digital
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                A loja digital mais confiável de Moçambique. Produtos digitais de qualidade, 
                pagamentos seguros e entrega instantânea.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Button
                onClick={() => navigate('/loja')}
                className="grok-button-primary text-lg px-8 py-6 group"
              >
                Explorar Loja
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              {!currentUser && (
                <>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="grok-button-secondary text-lg px-8 py-6"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate('/registro')}
                    variant="outline"
                    className="grok-button-secondary text-lg px-8 py-6"
                  >
                    Registrar
                  </Button>
                </>
              )}
            </motion.div>
          </div>

          {/* Banner Carousel */}
          <motion.div
            className="relative max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentBanner ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className={`w-full h-full bg-gradient-to-r ${banner.color} flex items-center justify-center text-white`}>
                    <div className="text-center">
                      <h3 className="text-2xl md:text-4xl font-bold mb-4">{banner.title}</h3>
                      <p className="text-lg md:text-xl opacity-90">{banner.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                onClick={prevBanner}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
                onClick={nextBanner}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentBanner ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentBanner(index)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher a Moz Store Digital?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos a melhor experiência em produtos digitais com segurança e qualidade.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Pagamentos Seguros",
                description: "Integração com Mpesa para transferências seguras e instantâneas",
                color: "text-green-600"
              },
              {
                icon: Smartphone,
                title: "100% Mobile",
                description: "Experiência otimizada para Android e iOS, sem zoom nem overflow",
                color: "text-blue-600"
              },
              {
                icon: Zap,
                title: "Entrega Instantânea",
                description: "Receba seus produtos digitais imediatamente após a confirmação do pagamento",
                color: "text-yellow-600"
              },
              {
                icon: Store,
                title: "Variedade de Produtos",
                description: "Streaming, Ebooks, Gaming, Jogos, Recargas e muito mais",
                color: "text-purple-600"
              },
              {
                icon: Users,
                title: "Suporte 24/7",
                description: "Nossa equipe está sempre disponível para ajudar você",
                color: "text-orange-600"
              },
              {
                icon: Star,
                title: "Qualidade Premium",
                description: "Produtos selecionados e testados para garantir a melhor experiência",
                color: "text-red-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="grok-card h-full">
                  <CardContent className="p-6 text-center">
                    <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Comece a explorar agora mesmo!
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de clientes satisfeitos e descubra o mundo dos produtos digitais.
            </p>
            <Button
              onClick={() => navigate('/loja')}
              className="grok-button-primary text-lg px-8 py-6 group"
            >
              Ir para a Loja
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">
            <strong>Contato:</strong> +258 87 650 0685 | mozstoredigitalp2@gmail.com
          </p>
          <p className="mb-2">
            <strong>Telegram:</strong> t.me/EllonMuskDev
          </p>
          <p className="text-sm">
            © 2025 Moz Store Digital. Todos os direitos reservados. Licença de uso exclusiva para Moçambique.
          </p>
        </div>
      </footer>
    </div>
  );
};