import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, CreditCard } from 'lucide-react';
import { productService } from '@/lib/products';
import { Product } from '@/types/product';
import { toast } from '@/hooks/use-toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        // Get all products and find the specific one (since we don't have getProductById)
        const products = await productService.getAllProducts();
        const foundProduct = products.find(p => p.id === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast({
            variant: "destructive",
            title: "Produto não encontrado",
            description: "O produto que você está procurando não existe."
          });
          navigate('/loja');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar detalhes do produto."
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const addToCart = () => {
    if (!product) return;
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho!`
    });
  };

  const buyNow = () => {
    if (!product) return;
    
    // Add to cart and redirect to payment
    addToCart();
    navigate('/pagamento');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button onClick={() => navigate('/loja')} className="grok-button-primary">
            Voltar à Loja
          </Button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <Card className="grok-card overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.isNew && (
                    <Badge variant="secondary" className="text-xs">
                      NOVO
                    </Badge>
                  )}
                  {product.isPromotion && (
                    <Badge variant="destructive" className="text-xs">
                      PROMOÇÃO
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-muted-foreground capitalize mb-4">
                  Categoria: {product.category}
                </p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                {product.discount > 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {discountedPrice.toLocaleString()} MZN
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {product.price.toLocaleString()} MZN
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {product.price.toLocaleString()} MZN
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={buyNow}
                  className="w-full grok-button-primary h-12 text-base"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Comprar Agora
                </Button>
                
                <Button
                  onClick={addToCart}
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              {/* Payment Info */}
              <Card className="grok-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Pagamento seguro com Mpesa
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};