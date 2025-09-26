import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Tag,
  Clock,
  Percent
} from 'lucide-react';
import { productService } from '@/lib/products';
import { Product } from '@/types/product';

export const Promotions: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const promotedProducts = await productService.getPromotedProducts();
        setPromotions(promotedProducts);
      } catch (error) {
        console.error('Error loading promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
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
    alert('Produto adicionado ao carrinho!');
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
    
    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className="product-card cursor-pointer h-full"
          onClick={() => navigate(`/produto/${product.id}`)}
        >
          <CardContent className="p-4">
            {/* Product Image */}
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
              <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground">
                -{product.discount}%
              </Badge>
            </div>
            
            {/* Product Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base leading-tight line-clamp-2">
                {product.name}
              </h3>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
                    {product.price} MZN
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    <Percent className="h-3 w-3 mr-1" />
                    {product.discount}% OFF
                  </Badge>
                </div>
                <div className="font-bold text-lg text-green-600">
                  {discountedPrice} MZN
                </div>
                <div className="text-xs text-green-600">
                  Economize {product.price - discountedPrice} MZN
                </div>
              </div>

              {product.promotionValidUntil && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Válido até {new Date(product.promotionValidUntil).toLocaleDateString()}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="flex-1 grok-button-primary"
                  size="sm"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/produto/${product.id}`);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Ver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Promoções</h1>
              <p className="text-muted-foreground">Carregando ofertas...</p>
            </div>
          </div>
          
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                Promoções
              </h1>
              <p className="text-muted-foreground">
                {promotions.length > 0 
                  ? `${promotions.length} produtos em promoção`
                  : 'Nenhuma promoção ativa no momento'
                }
              </p>
            </div>
            <Button
              onClick={() => navigate('/loja')}
              variant="outline"
              className="grok-button-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Loja
            </Button>
          </div>

          {/* Promotions Grid */}
          {promotions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {promotions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mx-auto w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                <Tag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nenhuma promoção ativa</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                No momento não temos promoções ativas. Volte em breve para conferir 
                nossas ofertas especiais!
              </p>
              <Button
                onClick={() => navigate('/loja')}
                className="grok-button-primary"
              >
                Explorar Loja
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};