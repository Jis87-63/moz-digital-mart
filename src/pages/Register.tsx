import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "A senha e confirmação de senha devem ser iguais.",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        variant: "destructive",
        title: "Termos de Uso",
        description: "Você deve aceitar os Termos de Uso para continuar.",
      });
      return;
    }

    // Validate phone format (+258 XX XXX XXXX)
    const phoneRegex = /^\+258\s\d{2}\s\d{3}\s\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        variant: "destructive",
        title: "Formato de telefone inválido",
        description: "Use o formato: +258 XX XXX XXXX",
      });
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.username, formData.phone);
      navigate('/loja');
    } catch (error: any) {
      console.error('Erro no registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.startsWith('258')) {
      value = value.slice(3); // Remove 258 if present
    }
    
    if (value.length <= 9) {
      // Format: +258 XX XXX XXXX
      let formatted = '+258';
      if (value.length > 0) {
        formatted += ` ${value.slice(0, 2)}`;
      }
      if (value.length > 2) {
        formatted += ` ${value.slice(2, 5)}`;
      }
      if (value.length > 5) {
        formatted += ` ${value.slice(5, 9)}`;
      }
      
      setFormData({
        ...formData,
        phone: formatted,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 p-0 h-auto hover:bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card className="grok-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
              <CardDescription>
                Junte-se à Moz Store Digital e explore produtos incríveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Seu nome de usuário"
                      className="grok-input pl-10 selectable"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="grok-input pl-10 selectable"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="+258 XX XXX XXXX"
                      className="grok-input pl-10 selectable"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      className="grok-input pl-10 pr-10 selectable"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repita sua senha"
                      className="grok-input pl-10 pr-10 selectable"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, acceptTerms: !!checked })
                    }
                  />
                  <Label htmlFor="acceptTerms" className="text-sm leading-relaxed selectable">
                    Aceito os{' '}
                    <Link
                      to="/termos"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Termos de Uso
                    </Link>
                    {' '}e{' '}
                    <Link
                      to="/privacidade"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Política de Privacidade
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full grok-button-primary"
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Entrar
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};