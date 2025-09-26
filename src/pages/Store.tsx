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
import { productService } from '@/lib/products';
import { Product } from '@/types/product';

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

// Products will be loaded from Firebase - no mock data

export const Store: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        
        // Group products by category
        const productsByCategory: Record<string, Product[]> = {};
        categories.forEach(category => {
          productsByCategory[category.id] = allProducts
            .filter(product => product.category === category.id)
            .slice(0, 5); // Show only first 5 products
        });
        
        setProducts(productsByCategory);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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
    
    // Show success message or update cart count
    alert('Produto adicionado ao carrinho!');
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
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
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                <ShoppingCart className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CategorySection: React.FC<{ category: any }> = ({ category }) => {
    const categoryProducts = products[category.id] || [];
    
    if (loading) {
      return (
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
              <category.icon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">{category.title}</h2>
          </div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[160px] max-w-[160px]">
                <Card className="product-card">
                  <CardContent className="p-3">
                    <div className="w-full h-24 bg-secondary/50 rounded-lg animate-pulse mb-3" />
                    <div className="h-4 bg-secondary/50 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-secondary/50 rounded animate-pulse" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
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
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => (
              <div key={product.id} className="min-w-[160px] max-w-[160px]">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground w-full">
              <p>Nenhum produto disponível nesta categoria.</p>
            </div>
          )}
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