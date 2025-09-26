import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Download, 
  MessageCircle, 
  ArrowRight,
  Home,
  Package
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  downloadLink?: string;
  redirectLink?: string;
}

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (location.state) {
      setItems(location.state.items || []);
      setTotal(location.state.total || 0);
      setTransactionId(location.state.transactionId || '');
    } else {
      // If no state, redirect to store
      navigate('/loja');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto redirect after countdown
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [items]);

  const handleDownload = (downloadLink: string, productName: string) => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    } else {
      // Fallback - show message that download will be sent
      alert(`O link de download para "${productName}" será enviado por email em breve.`);
    }
  };

  const handleReceiveProduct = (productName: string, redirectLink?: string) => {
    const whatsappNumber = "258871009140";
    const message = `Olá! Meu pagamento para "${productName}" foi efetuado com sucesso. ID da transação: ${transactionId}. Por favor, me envie o produto.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    if (redirectLink) {
      // If there's a custom redirect link, use it
      window.open(redirectLink, '_blank');
    } else {
      // Default WhatsApp redirect
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleRedirect = () => {
    const downloadableCategories = ['ebooks', 'jogos'];
    const hasDownloadable = items.some(item => downloadableCategories.includes(item.category.toLowerCase()));
    
    if (hasDownloadable) {
      // Show download page for ebooks/games
      return;
    } else {
      // Redirect to WhatsApp for other products
      const firstItem = items[0];
      if (firstItem) {
        handleReceiveProduct(firstItem.name, firstItem.redirectLink);
      }
    }
  };

  const downloadableCategories = ['ebooks', 'jogos'];
  const downloadableItems = items.filter(item => downloadableCategories.includes(item.category.toLowerCase()));
  const redirectItems = items.filter(item => !downloadableCategories.includes(item.category.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-muted-foreground mb-4">
              Sua compra foi processada com sucesso
            </p>
            <p className="text-sm text-muted-foreground">
              ID da Transação: <span className="font-mono font-medium">{transactionId}</span>
            </p>
          </div>

          {/* Order Details */}
          <Card className="grok-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Seus Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x • {item.category}
                    </p>
                  </div>
                  <p className="font-bold">{item.price * item.quantity} MZN</p>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Pago</span>
                <span className="text-green-600">{total} MZN</span>
              </div>
            </CardContent>
          </Card>

          {/* Download Section for Ebooks/Games */}
          {downloadableItems.length > 0 && (
            <Card className="grok-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Download className="h-5 w-5 mr-2" />
                  Downloads Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {downloadableItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Pronto para download</p>
                    </div>
                    <Button
                      onClick={() => handleDownload(item.downloadLink || '', item.name)}
                      className="grok-button-primary"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Redirect Section for Other Products */}
          {redirectItems.length > 0 && (
            <Card className="grok-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Receber Produtos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Para os produtos abaixo, você será redirecionado para receber seu produto:
                </p>
                {redirectItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Redirecionamento em {countdown}s
                      </p>
                    </div>
                    <Button
                      onClick={() => handleReceiveProduct(item.name, item.redirectLink)}
                      className="grok-button-primary"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Receber Produto
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/loja')}
              variant="outline"
              className="grok-button-secondary"
            >
              <Home className="h-4 w-4 mr-2" />
              Voltar à Loja
            </Button>
            <Button
              onClick={() => navigate('/meus-produtos')}
              className="grok-button-primary"
            >
              Meus Produtos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Support Contact */}
          <div className="text-center mt-8 p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Precisa de ajuda? Entre em contato conosco:
            </p>
            <p className="text-sm">
              <strong>WhatsApp:</strong> +258 87 650 0685 |{' '}
              <strong>Email:</strong> mozstoredigitalp2@gmail.com
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};