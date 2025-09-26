import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  ArrowLeft, 
  Shield, 
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Get cart data from location state or localStorage
    if (location.state?.items && location.state?.total) {
      setItems(location.state.items);
      setTotal(location.state.total);
    } else {
      // Try to get from localStorage as fallback
      const savedCart = localStorage.getItem('mozstore-cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        setItems(cartItems);
        setTotal(cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0));
      } else {
        // No cart data, redirect to cart
        navigate('/carrinho');
      }
    }
  }, [location.state, navigate]);

  const formatPhoneNumber = (phone: string) => {
    // Remove non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Format for Mozambique (+258 XX XXX XXXX)
    if (digits.length >= 9) {
      const formatted = digits.slice(-9);
      return `+258 ${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5)}`;
    }
    return phone;
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    const moçambiqueNumber = digits.slice(-9);
    
    // Check if it's a valid Mozambique mobile number (84, 85, 86, 87)
    return moçambiqueNumber.length === 9 && ['84', '85', '86', '87'].includes(moçambiqueNumber.slice(0, 2));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const processPayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        variant: "destructive",
        title: "Número inválido",
        description: "Por favor, insira um número de telefone válido (84/85/86/87).",
      });
      return;
    }

    setLoading(true);

    try {
      // Here would be the actual Gibrapay API integration
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Clear cart
      localStorage.removeItem('mozstore-cart');

      // Navigate to success page
      navigate('/pagamento-sucesso', {
        state: {
          items,
          total,
          phoneNumber,
          transactionId: `TXN${Date.now()}`
        }
      });

      toast({
        title: "Pagamento processado!",
        description: "Você será redirecionado em instantes...",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: "Tente novamente em alguns minutos.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Nenhum item para pagamento</h2>
          <Button onClick={() => navigate('/loja')} className="grok-button-primary">
            Voltar à Loja
          </Button>
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
              <h1 className="text-3xl font-bold">Finalizar Pagamento</h1>
              <p className="text-muted-foreground">Pagamento seguro via Mpesa</p>
            </div>
            <Button
              onClick={() => navigate('/carrinho')}
              variant="outline"
              className="grok-button-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Carrinho
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                    Pagamento via Mpesa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Número de Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+258 XX XXX XXXX"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="grok-input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Números aceitos: 84, 85, 86, 87
                    </p>
                  </div>

                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium text-sm">Como funciona:</span>
                    </div>
                    <ol className="text-xs text-muted-foreground space-y-1 ml-6">
                      <li>1. Clique em "Processar Pagamento"</li>
                      <li>2. Você receberá um SMS com instruções</li>
                      <li>3. Confirme o pagamento no seu telefone</li>
                      <li>4. Receba seus produtos instantaneamente</li>
                    </ol>
                  </div>

                  <Button
                    onClick={processPayment}
                    disabled={loading || !validatePhoneNumber(phoneNumber)}
                    className="w-full grok-button-primary"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? 'Processando Pagamento...' : `Pagar ${total} MZN`}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qtd: {item.quantity} • {item.category}
                          </p>
                        </div>
                        <p className="font-medium">{item.price * item.quantity} MZN</p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-grok-primary">{total} MZN</span>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="grok-card">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Pagamento Seguro</h4>
                      <p className="text-xs text-muted-foreground">
                        Seus dados estão protegidos com criptografia SSL e 
                        processamento seguro via Mpesa.
                      </p>
                    </div>
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