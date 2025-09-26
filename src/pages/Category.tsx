import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ShoppingCart,
  Tv,
  BookOpen,
  Gamepad2,
  Joystick,
  CreditCard,
  Zap,
  Filter
} from 'lucide-react';

const categories = {
  streaming: { title: 'Streaming', icon: Tv, color: 'from-red-500 to-red-600' },
  ebooks: { title: 'Ebooks', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
  gaming: { title: 'Gaming', icon: Gamepad2, color: 'from-purple-500 to-purple-600' },
  jogos: { title: 'Jogos', icon: Joystick, color: 'from-green-500 to-green-600' },
  recargas: { title: 'Recargas', icon: Zap, color: 'from-yellow-500 to-yellow-600' },
  paypal: { title: 'PayPal', icon: CreditCard, color: 'from-indigo-500 to-indigo-600' }
};

const mockProducts = {
  streaming: [
    { id: 1, name: 'Netflix Premium 1 Mês', price: 450, discount: 10, image: '/api/placeholder/120/120' },
    { id: 2, name: 'Spotify Premium 3 Meses', price: 850, discount: 0, image: '/api/placeholder/120/120' },
    { id: 3, name: 'Disney+ Annual', price: 2500, discount: 15, image: '/api/placeholder/120/120' },
    { id: 4, name: 'YouTube Premium', price: 650, discount: 0, image: '/api/placeholder/120/120' },
    { id: 5, name: 'Amazon Prime Video', price: 750, discount: 20, image: '/api/placeholder/120/120' },
    { id: 31, name: 'HBO Max Premium', price: 920, discount: 5, image: '/api/placeholder/120/120' },
    { id: 32, name: 'Apple TV+ 6 Meses', price: 1200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 33, name: 'Paramount+ Premium', price: 680, discount: 12, image: '/api/placeholder/120/120' },
  ],
  ebooks: [
    { id: 6, name: 'Kindle Unlimited 6 Meses', price: 1200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 7, name: 'Audible Premium', price: 950, discount: 5, image: '/api/placeholder/120/120' },
    { id: 8, name: 'Scribd Ilimitado', price: 800, discount: 10, image: '/api/placeholder/120/120' },
    { id: 9, name: 'Adobe Digital Editions', price: 1500, discount: 0, image: '/api/placeholder/120/120' },
    { id: 10, name: 'Kobo Plus Premium', price: 1100, discount: 12, image: '/api/placeholder/120/120' },
    { id: 34, name: 'Biblioteca Digital Premium', price: 750, discount: 8, image: '/api/placeholder/120/120' },
    { id: 35, name: 'E-book Collection 500+', price: 2200, discount: 25, image: '/api/placeholder/120/120' },
  ],
  gaming: [
    { id: 11, name: 'Xbox Game Pass Ultimate', price: 2200, discount: 8, image: '/api/placeholder/120/120' },
    { id: 12, name: 'PlayStation Plus Extra', price: 1800, discount: 0, image: '/api/placeholder/120/120' },
    { id: 13, name: 'Steam Wallet 50 USD', price: 3200, discount: 5, image: '/api/placeholder/120/120' },
    { id: 14, name: 'Epic Games Store Credit', price: 2800, discount: 15, image: '/api/placeholder/120/120' },
    { id: 15, name: 'Nintendo Switch Online', price: 900, discount: 0, image: '/api/placeholder/120/120' },
    { id: 36, name: 'Origin Access Premier', price: 1650, discount: 10, image: '/api/placeholder/120/120' },
    { id: 37, name: 'Ubisoft+ Premium', price: 1950, discount: 0, image: '/api/placeholder/120/120' },
  ],
  jogos: [
    { id: 16, name: 'FIFA 2024 Digital', price: 4500, discount: 20, image: '/api/placeholder/120/120' },
    { id: 17, name: 'Call of Duty Premium', price: 5200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 18, name: 'Minecraft Java Edition', price: 1800, discount: 10, image: '/api/placeholder/120/120' },
    { id: 19, name: 'Grand Theft Auto V', price: 3500, discount: 25, image: '/api/placeholder/120/120' },
    { id: 20, name: 'Cyberpunk 2077', price: 2900, discount: 0, image: '/api/placeholder/120/120' },
    { id: 38, name: 'Assassins Creed Valhalla', price: 3800, discount: 15, image: '/api/placeholder/120/120' },
    { id: 39, name: 'Red Dead Redemption 2', price: 4200, discount: 30, image: '/api/placeholder/120/120' },
  ],
  recargas: [
    { id: 21, name: 'Recarga Vodacom 500 MZN', price: 500, discount: 0, image: '/api/placeholder/120/120' },
    { id: 22, name: 'Recarga Movitel 300 MZN', price: 300, discount: 5, image: '/api/placeholder/120/120' },
    { id: 23, name: 'Recarga TMcel 200 MZN', price: 200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 24, name: 'Bundle Internet 10GB', price: 650, discount: 8, image: '/api/placeholder/120/120' },
    { id: 25, name: 'Pacote Redes Sociais', price: 250, discount: 0, image: '/api/placeholder/120/120' },
    { id: 40, name: 'Recarga Vodacom 1000 MZN', price: 1000, discount: 3, image: '/api/placeholder/120/120' },
    { id: 41, name: 'Bundle Internet 50GB', price: 2500, discount: 12, image: '/api/placeholder/120/120' },
  ],
  paypal: [
    { id: 26, name: 'Conta PayPal Verificada', price: 2500, discount: 10, image: '/api/placeholder/120/120' },
    { id: 27, name: 'Saldo PayPal 50 USD', price: 3200, discount: 0, image: '/api/placeholder/120/120' },
    { id: 28, name: 'PayPal Business Account', price: 4500, discount: 15, image: '/api/placeholder/120/120' },
    { id: 29, name: 'Cartão Virtual PayPal', price: 1800, discount: 0, image: '/api/placeholder/120/120' },
    { id: 30, name: 'Configuração PayPal', price: 1200, discount: 20, image: '/api/placeholder/120/120' },
    { id: 42, name: 'Saldo PayPal 100 USD', price: 6200, discount: 5, image: '/api/placeholder/120/120' },
  ]
};

export const Category: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'discount'>('name');

  const category = categoryId ? categories[categoryId as keyof typeof categories] : null;
  const products = categoryId ? mockProducts[categoryId as keyof typeof mockProducts] || [] : [];

  useEffect(() => {
    if (!category) {
      navigate('/loja');
    }
  }, [category, navigate]);

  if (!category) {
    return null;
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      case 'discount':
        return b.discount - a.discount;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const ProductCard: React.FC<{ product: any }> = ({ product }) => (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="product-card cursor-pointer h-full"
        onClick={() => navigate(`/produto/${product.id}`)}
      >
        <CardContent className="p-4">
          <div className="relative mb-4">
            <div className="w-full h-32 bg-secondary/50 rounded-lg flex items-center justify-center overflow-hidden">
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
              <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground">
                -{product.discount}%
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-base leading-tight">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.discount > 0 ? (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.price} MZN
                    </span>
                    <span className="font-bold text-lg text-grok-success">
                      {Math.round(product.price * (1 - product.discount / 100))} MZN
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-lg">
                    {product.price} MZN
                  </span>
                )}
              </div>
              
              <Button size="sm" className="grok-button-primary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Comprar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Button
            variant="ghost"
            className="mb-6 p-0 h-auto hover:bg-transparent"
            onClick={() => navigate('/loja')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Loja
          </Button>

          <div className="flex items-center space-x-4 mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
              <category.icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.title}</h1>
              <p className="text-muted-foreground">
                {products.length} produto{products.length !== 1 ? 's' : ''} disponível{products.length !== 1 ? 'is' : ''}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="grok-input selectable px-3 py-2 text-sm"
            >
              <option value="name">Nome A-Z</option>
              <option value="price">Menor Preço</option>
              <option value="discount">Maior Desconto</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <category.icon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Esta categoria ainda não possui produtos disponíveis.
            </p>
            <Button onClick={() => navigate('/loja')} className="grok-button-primary">
              Explorar Outras Categorias
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};