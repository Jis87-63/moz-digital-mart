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
import { productService } from '@/lib/products';
import { Product } from '@/types/product';

const categories = {
  streaming: { title: 'Streaming', icon: Tv, color: 'from-red-500 to-red-600' },
  ebooks: { title: 'Ebooks', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
  gaming: { title: 'Gaming', icon: Gamepad2, color: 'from-purple-500 to-purple-600' },
  jogos: { title: 'Jogos', icon: Joystick, color: 'from-green-500 to-green-600' },
  recargas: { title: 'Recargas', icon: Zap, color: 'from-yellow-500 to-yellow-600' },
  paypal: { title: 'PayPal', icon: CreditCard, color: 'from-indigo-500 to-indigo-600' }
};

// Products will be loaded from Firebase only - admin will add products via /painel

export const Category: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'discount'>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (!categoryId) return;
      
      try {
        const categoryProducts = await productService.getProductsByCategory(categoryId);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error loading category products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

  const category = categoryId ? categories[categoryId as keyof typeof categories] : null;

  useEffect(() => {
    if (!category) {
      navigate('/loja');
    }
  }, [category, navigate]);

  const addToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('mozstore-cart') || '[]');
    const existingItem = existingCart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category
      });
    }

    localStorage.setItem('mozstore-cart', JSON.stringify(existingCart));
    alert('Produto adicionado ao carrinho!');
  };

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

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
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
              
              <Button 
                size="sm" 
                className="grok-button-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
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
                {loading 
                  ? 'Carregando produtos...'
                  : `${products.length} produto${products.length !== 1 ? 's' : ''} ${products.length === 0 ? 'aguardando ser adicionado' : 'disponível'}${products.length !== 1 && products.length > 0 ? 'is' : ''}`
                }
              </p>
            </div>
          </div>

          {/* Filters */}
          {products.length > 0 && (
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
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="product-card">
                <CardContent className="p-4">
                  <div className="w-full h-32 bg-secondary/50 rounded-lg animate-pulse mb-4" />
                  <div className="h-4 bg-secondary/50 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-secondary/50 rounded animate-pulse mb-2" />
                  <div className="h-6 bg-secondary/50 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
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
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <category.icon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Categoria em preparação</h3>
            <p className="text-muted-foreground mb-6">
              Os produtos desta categoria serão adicionados em breve pelo administrador.
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