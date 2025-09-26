import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Download, 
  ArrowLeft, 
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PurchasedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  purchaseDate: Date;
  downloadLink?: string;
  redirectLink?: string;
  transactionId: string;
}

export const MyProducts: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<PurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load user's purchased products from Firebase
    // For now, show empty state
    setLoading(false);
  }, [currentUser, navigate]);

  const handleDownload = (downloadLink: string, productName: string) => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    } else {
      alert(`O link de download para "${productName}" será enviado por email em breve.`);
    }
  };

  const handleReceiveProduct = (productName: string, transactionId: string, redirectLink?: string) => {
    const whatsappNumber = "258871009140";
    const message = `Olá! Gostaria de receber meu produto "${productName}". ID da transação: ${transactionId}.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    if (redirectLink) {
      window.open(redirectLink, '_blank');
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Carregando seus produtos...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
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
                <h1 className="text-3xl font-bold">Meus Produtos</h1>
                <p className="text-muted-foreground">Histórico de compras e downloads</p>
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

            {/* Empty State */}
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-4">Nenhum produto adquirido</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Você ainda não fez nenhuma compra. Explore nossa loja e encontre produtos incríveis!
              </p>
              <Button
                onClick={() => navigate('/loja')}
                className="grok-button-primary"
              >
                Explorar Loja
              </Button>
            </div>
          </motion.div>
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
              <h1 className="text-3xl font-bold">Meus Produtos</h1>
              <p className="text-muted-foreground">
                {products.length} {products.length === 1 ? 'produto adquirido' : 'produtos adquiridos'}
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

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="grok-card h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {product.purchaseDate.toLocaleDateString('pt-MZ')}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{product.category}</span>
                      <span className="font-bold text-grok-primary">{product.price} MZN</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Transação: {product.transactionId}
                    </div>

                    {/* Action Button */}
                    {['ebooks', 'jogos'].includes(product.category.toLowerCase()) ? (
                      <Button
                        onClick={() => handleDownload(product.downloadLink || '', product.name)}
                        className="w-full grok-button-primary"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleReceiveProduct(product.name, product.transactionId, product.redirectLink)}
                        className="w-full grok-button-primary"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Receber Produto
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};