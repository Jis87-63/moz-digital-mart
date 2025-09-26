import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ShoppingCart,
  Tv,
  BookOpen,
  Gamepad2,
  Joystick,
  CreditCard,
  Zap
} from 'lucide-react';

const categories = [
  {
    id: 'streaming',
    title: 'Streaming',
    icon: Tv,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'ebooks',
    title: 'Ebooks',
    icon: BookOpen,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'gaming',
    title: 'Gaming',
    icon: Gamepad2,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'jogos',
    title: 'Jogos',
    icon: Joystick,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'recargas',
    title: 'Recargas',
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'paypal',
    title: 'PayPal',
    icon: CreditCard,
    color: 'from-indigo-500 to-indigo-600'
  }
];

// Mock products data
const mockProducts = {
  streaming: [
    { id: 1, name: 'Netflix Premium 1 Mês', price: 450, discount: 10, image: '/api/placeholder/120/120' },
    { id: 2, name: 'Spotify Premium 3 Meses', price: 850, discount: 0, image: '/api/placeholder/120/120' },
    { id: 3, name: 'Disney+ Annual', price: 2500, discount: 15, image: '/api/placeholder/120/120' },
    { id: 4, name: 'YouTube Premium', price: 650, discount: 0, image: '/api/placeholder/120/120' },
    { id: 5, name: 'Amazon Prime Video', price: 750, discount: 20, image: '/api/placeholder/120/120' },
  ],
  ebooks: [
    { id: 6, name: 'Kindle Unlimited 6 Meses', price: 1200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 7, name: 'Audible Premium', price: 950, discount: 5, image: '/api/placeholder/120/120' },
    { id: 8, name: 'Scribd Ilimitado', price: 800, discount: 10, image: '/api/placeholder/120/120' },
    { id: 9, name: 'Adobe Digital Editions', price: 1500, discount: 0, image: '/api/placeholder/120/120' },
    { id: 10, name: 'Kobo Plus Premium', price: 1100, discount: 12, image: '/api/placeholder/120/120' },
  ],
  gaming: [
    { id: 11, name: 'Xbox Game Pass Ultimate', price: 2200, discount: 8, image: '/api/placeholder/120/120' },
    { id: 12, name: 'PlayStation Plus Extra', price: 1800, discount: 0, image: '/api/placeholder/120/120' },
    { id: 13, name: 'Steam Wallet 50 USD', price: 3200, discount: 5, image: '/api/placeholder/120/120' },
    { id: 14, name: 'Epic Games Store Credit', price: 2800, discount: 15, image: '/api/placeholder/120/120' },
    { id: 15, name: 'Nintendo Switch Online', price: 900, discount: 0, image: '/api/placeholder/120/120' },
  ],
  jogos: [
    { id: 16, name: 'FIFA 2024 Digital', price: 4500, discount: 20, image: '/api/placeholder/120/120' },
    { id: 17, name: 'Call of Duty Premium', price: 5200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 18, name: 'Minecraft Java Edition', price: 1800, discount: 10, image: '/api/placeholder/120/120' },
    { id: 19, name: 'Grand Theft Auto V', price: 3500, discount: 25, image: '/api/placeholder/120/120' },
    { id: 20, name: 'Cyberpunk 2077', price: 2900, discount: 0, image: '/api/placeholder/120/120' },
  ],
  recargas: [
    { id: 21, name: 'Recarga Vodacom 500 MZN', price: 500, discount: 0, image: '/api/placeholder/120/120' },
    { id: 22, name: 'Recarga Movitel 300 MZN', price: 300, discount: 5, image: '/api/placeholder/120/120' },
    { id: 23, name: 'Recarga TMcel 200 MZN', price: 200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 24, name: 'Bundle Internet 10GB', price: 650, discount: 8, image: '/api/placeholder/120/120' },
    { id: 25, name: 'Pacote Redes Sociais', price: 250, discount: 0, image: '/api/placeholder/120/120' },
  ],
  paypal: [
    { id: 26, name: 'Conta PayPal Verificada', price: 2500, discount: 10, image: '/api/placeholder/120/120' },
    { id: 27, name: 'Saldo PayPal 50 USD', price: 3200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 28, name: 'PayPal Business Account', price: 4500, discount: 15, image: '/api/placeholder/120/120' },
    { id: 29, name: 'Cartão Virtual PayPal', price: 1800, discount: 0, image: '/api/placeholder/120/120' },
    { id: 30, name: 'Configuração PayPal', price: 1200, discount: 20, image: '/api/placeholder/120/120' },
  ]
};

export const Store: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const ProductCard: React.FC<{ product: any }> = ({ product }) => (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="product-card cursor-pointer h-full"
        onClick={() => navigate(`/produto/${product.id}`)}
      >
        <CardContent className="p-3">
          {/* Product Image - Small and compact */}
          <div className="relative mb-3">
            <div className="w-full h-24 bg-secondary/50 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA0MEg4MFY4MEg0MFY0MFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
                }}
              />
            </div>
            {product.discount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5">
                -{product.discount}%
              </Badge>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.discount > 0 ? (
                  <>
                    <span className="text-xs text-muted-foreground line-through">
                      {product.price} MZN
                    </span>
                    <span className="font-bold text-sm text-grok-success">
                      {Math.round(product.price * (1 - product.discount / 100))} MZN
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-sm">
                    {product.price} MZN
                  </span>
                )}
              </div>
              
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ShoppingCart className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CategorySection: React.FC<{ category: any }> = ({ category }) => {
    const products = mockProducts[category.id as keyof typeof mockProducts] || [];
    const displayProducts = products.slice(0, 5);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
              <category.icon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">{category.title}</h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/categoria/${category.id}`)}
            className="text-primary hover:text-primary"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="category-scroll">
          {displayProducts.map((product) => (
            <div key={product.id} className="min-w-[160px] max-w-[160px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Nossa Loja Digital
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra os melhores produtos digitais de Moçambique. 
              Qualidade garantida e entrega instantânea.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {categories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="text-center mt-12 p-8 bg-secondary/30 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Entre em contato conosco! Temos uma ampla gama de produtos digitais 
              e estamos sempre adicionando novidades.
            </p>
            <Button
              onClick={() => navigate('/suporte')}
              className="grok-button-primary"
            >
              Falar com Suporte
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};