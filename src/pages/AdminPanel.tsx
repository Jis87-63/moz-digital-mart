import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  Package, 
  Image as ImageIcon, 
  MessageSquare, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Admin credentials (In production, this should be in a secure backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@mozstoredigital.com',
  password: 'MozStoreAdmin2025!'
};

export const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (currentUser?.email === ADMIN_CREDENTIALS.email) {
      setIsAuthenticated(true);
    }
  }, [currentUser]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple admin authentication
    if (loginForm.email === ADMIN_CREDENTIALS.email && 
        loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      toast({
        title: "Acesso autorizado",
        description: "Bem-vindo ao painel administrativo!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Credenciais de administrador inválidas.",
      });
    }
    
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="grok-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
              <CardDescription>
                Acesso restrito apenas para administradores autorizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">E-mail do Administrador</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@mozstoredigital.com"
                    className="grok-input selectable"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Senha do Administrador</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Senha secreta"
                    className="grok-input selectable"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full grok-button-primary"
                >
                  {loading ? 'Verificando...' : 'Acessar Painel'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Voltar à Loja
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-muted-foreground">Gerencie sua loja digital</p>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="grok-button-secondary"
            >
              ← Voltar à Loja
            </Button>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="produtos" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="produtos" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Produtos</span>
              </TabsTrigger>
              <TabsTrigger value="banners" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Banners</span>
              </TabsTrigger>
              <TabsTrigger value="promocoes" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Promoções</span>
              </TabsTrigger>
              <TabsTrigger value="mensagens" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Suporte</span>
              </TabsTrigger>
              <TabsTrigger value="configuracoes" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Config</span>
              </TabsTrigger>
            </TabsList>

            {/* Products Management */}
            <TabsContent value="produtos" className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Gerenciar Produtos
                    <Button className="grok-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Produto
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Adicione, edite ou remova produtos da sua loja
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Sistema de Produtos</h3>
                    <p>Interface completa para gerenciar produtos será implementada com Firebase</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Banner Management */}
            <TabsContent value="banners" className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Banners do Carousel
                    <Button className="grok-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Banner
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Gerencie os banners promocionais da página inicial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Sistema de Banners</h3>
                    <p>Interface para upload e gerenciamento de banners promocionais</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Promotions Management */}
            <TabsContent value="promocoes" className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Promoções e Novidades
                    <Button className="grok-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Promoção
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Crie promoções especiais e marque produtos como novidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Sistema de Promoções</h3>
                    <p>Gerencie descontos, ofertas especiais e produtos em destaque</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Messages */}
            <TabsContent value="mensagens" className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle>Mensagens de Suporte</CardTitle>
                  <CardDescription>
                    Visualize e responda às mensagens dos clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Sistema de Suporte</h3>
                    <p>Chat em tempo real e sistema de mensagens com clientes</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="configuracoes" className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle>Configurações da Loja</CardTitle>
                  <CardDescription>
                    Ajustes gerais e configurações do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">Informações da Loja</Label>
                      <div className="grid gap-4 mt-2">
                        <div>
                          <Label htmlFor="storeName">Nome da Loja</Label>
                          <Input
                            id="storeName"
                            defaultValue="Moz Store Digital"
                            className="grok-input selectable"
                          />
                        </div>
                        <div>
                          <Label htmlFor="storeEmail">E-mail de Contato</Label>
                          <Input
                            id="storeEmail"
                            defaultValue="mozstoredigitalp2@gmail.com"
                            className="grok-input selectable"
                          />
                        </div>
                        <div>
                          <Label htmlFor="storePhone">Telefone de Contato</Label>
                          <Input
                            id="storePhone"
                            defaultValue="+258 87 650 0685"
                            className="grok-input selectable"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button className="grok-button-primary">
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};