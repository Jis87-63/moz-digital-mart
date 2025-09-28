import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
  Settings,
  Upload,
  Send,
  Check,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { productService, bannerService } from '@/lib/products';
import { notificationService } from '@/lib/notifications';
import { supportService, SupportMessage } from '@/lib/support';
import { settingsService, StoreSettings } from '@/lib/settings';
import { storageService } from '@/lib/storage';
import { Product, Banner } from '@/types/product';

// Admin credentials (In production, this should be in a secure backend)
const ADMIN_CREDENTIALS = {
  email: 'carlitosmarques08@gmail.com',
  password: '1234567'
};

// Form schemas
// Form schemas - simplified
const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().min(0, 'Preço deve ser maior que 0'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  downloadLink: z.string().optional(),
  redirectLink: z.string().optional(),
  discount: z.number().min(0).max(100).default(0),
  isNew: z.boolean().default(false),
  isPromotion: z.boolean().default(false),
});

const bannerSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().min(1, 'Subtítulo é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  order: z.number().min(0, 'Ordem deve ser maior que 0'),
  isActive: z.boolean().default(true)
});

const notificationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
  type: z.enum(['info', 'success', 'warning', 'error']),
  isActive: z.boolean().default(true),
});

export const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  // State for data
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  
  // State for dialogs
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setBanner] = useState<Banner | null>(null);
  
  // Form instances  
  const productForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      downloadLink: '',
      redirectLink: '',
      discount: 0,
      isNew: false,
      isPromotion: false
    }
  });
  
  const bannerForm = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      color: '#000000',
      order: 0,
      isActive: true
    }
  });
  
  const notificationForm = useForm({
    defaultValues: {
      title: '',
      message: '',
      type: 'info',
      isActive: true
    }
  });
  
  const settingsForm = useForm({
    defaultValues: {
      storeName: '',
      storeEmail: '',
      storePhone: '',
      storeDescription: ''
    }
  });

  useEffect(() => {
    // Check if user is admin
    if (currentUser?.email === ADMIN_CREDENTIALS.email) {
      setIsAuthenticated(true);
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);
  
  const loadData = async () => {
    try {
      const [productsData, bannersData, supportData, settingsData] = await Promise.all([
        productService.getAllProducts(),
        bannerService.getActiveBanners(),
        supportService.getAllSupportMessages(),
        settingsService.getStoreSettings()
      ]);
      
      setProducts(productsData);
      setBanners(bannersData);
      setSupportMessages(supportData);
      setStoreSettings(settingsData);
      
      // Set settings form default values
      settingsForm.reset(settingsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar dados do painel."
      });
    }
  };

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
  
  // Product handlers - using 'prdt' key structure as requested by admin
  const handleAddProduct = async (data: any, imageFile?: File) => {
    try {
      setLoading(true);
      
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await storageService.uploadImage(imageFile, 'products');
      }
      
      // Add product with 'prdt' prefix structure
      await productService.addProduct({
        ...data,
        prdt: `prdt_${Date.now()}`, // Unique product key as requested
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso na loja!"
      });
      
      setIsProductDialogOpen(false);
      productForm.reset();
      loadData();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao adicionar produto."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = async (data: any, imageFile?: File) => {
    if (!editingProduct) return;
    
    try {
      setLoading(true);
      
      let imageUrl = editingProduct.image;
      if (imageFile) {
        imageUrl = await storageService.uploadImage(imageFile, 'products');
      }
      
      await productService.updateProduct(editingProduct.id, {
        ...data,
        prdt: editingProduct.prdt || `prdt_${Date.now()}`, // Maintain or add prdt key
        image: imageUrl
      });
      
      toast({
        title: "Sucesso",
        description: "Produto atualizado e disponível na loja!"
      });
      
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
      loadData();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar produto."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
      await productService.deleteProduct(id);
      toast({
        title: "Sucesso",
        description: "Produto removido da loja!"
      });
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao deletar produto."
      });
    }
  };
  
  // Banner handlers
  const handleAddBanner = async (data: any, imageFile?: File) => {
    try {
      setLoading(true);
      
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await storageService.uploadImage(imageFile, 'banners');
      }
      
      await bannerService.addBanner({
        ...data,
        image: imageUrl,
        createdAt: new Date()
      });
      
      toast({
        title: "Sucesso",
        description: "Banner adicionado com sucesso!"
      });
      
      setIsBannerDialogOpen(false);
      bannerForm.reset();
      loadData();
    } catch (error) {
      console.error('Error adding banner:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao adicionar banner."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Notification handlers
  const handleSendNotification = async (data: any) => {
    try {
      setLoading(true);
      
      await notificationService.addNotification({
        ...data,
        createdAt: new Date()
      });
      
      toast({
        title: "Sucesso",
        description: "Notificação enviada com sucesso!"
      });
      
      setIsNotificationDialogOpen(false);
      notificationForm.reset();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar notificação."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Support handlers
  const handleRespondSupport = async (id: string, response: string) => {
    try {
      await supportService.respondToSupport(id, response);
      toast({
        title: "Sucesso",
        description: "Resposta enviada com sucesso!"
      });
      loadData();
    } catch (error) {
      console.error('Error responding to support:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar resposta."
      });
    }
  };
  
  // Settings handlers
  const handleUpdateSettings = async (data: any) => {
    try {
      setLoading(true);
      
      await settingsService.updateStoreSettings(data);
      
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso!"
      });
      
      loadData();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar configurações."
      });
    } finally {
      setLoading(false);
    }
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
                    Gerenciar Produtos ({products.length})
                    <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="grok-button-primary" onClick={() => {
                          setEditingProduct(null);
                          productForm.reset();
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Produto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                          </DialogTitle>
                          <DialogDescription>
                            Preencha as informações do produto abaixo
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...productForm}>
                          <form onSubmit={productForm.handleSubmit((data) => {
                            const imageFile = (document.getElementById('product-image') as HTMLInputElement)?.files?.[0];
                            if (editingProduct) {
                              handleEditProduct(data, imageFile);
                            } else {
                              handleAddProduct(data, imageFile);
                            }
                          })} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={productForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome do Produto</FormLabel>
                                    <FormControl>
                                      <Input className="selectable" placeholder="Nome do produto" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={productForm.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Preço (MZN)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        className="selectable" 
                                        type="number" 
                                        step="0.01"
                                        placeholder="0.00" 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={productForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Descrição</FormLabel>
                                  <FormControl>
                                    <Textarea className="selectable" placeholder="Descrição detalhada do produto" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={productForm.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="streaming">Streaming</SelectItem>
                                        <SelectItem value="ebooks">Ebooks</SelectItem>
                                        <SelectItem value="gaming">Gaming</SelectItem>
                                        <SelectItem value="jogos">Jogos</SelectItem>
                                        <SelectItem value="recarregas">Recarregas</SelectItem>
                                        <SelectItem value="paypal">PayPal</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={productForm.control}
                                name="discount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Desconto (%)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        className="selectable" 
                                        type="number" 
                                        min="0" 
                                        max="100"
                                        placeholder="0" 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="product-image">Imagem do Produto</Label>
                                <Input
                                  id="product-image"
                                  type="file"
                                  accept="image/*"
                                  className="selectable"
                                />
                              </div>
                              
                              <FormField
                                control={productForm.control}
                                name="downloadLink"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Link de Download (Ebooks/Jogos)</FormLabel>
                                    <FormControl>
                                      <Input className="selectable" placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={productForm.control}
                                name="redirectLink"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Link de Redirecionamento (Outros)</FormLabel>
                                    <FormControl>
                                      <Input className="selectable" placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex gap-4">
                              <FormField
                                control={productForm.control}
                                name="isNew"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel>Produto Novo</FormLabel>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={productForm.control}
                                name="isPromotion"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel>Em Promoção</FormLabel>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsProductDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit" disabled={loading} className="grok-button-primary">
                                {loading ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Adicionar')}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    Adicione, edite ou remova produtos da sua loja
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
                      <p>Clique em "Novo Produto" para adicionar seu primeiro produto</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {product.image && (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {product.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{product.category}</TableCell>
                            <TableCell>{product.price.toLocaleString()} MZN</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {product.isNew && <Badge variant="secondary">Novo</Badge>}
                                {product.isPromotion && <Badge variant="destructive">Promoção</Badge>}
                                {product.discount > 0 && <Badge variant="outline">{product.discount}% OFF</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    productForm.reset({
                                      name: product.name,
                                      description: product.description,
                                      price: product.price,
                                      category: product.category,
                                      downloadLink: product.downloadLink || '',
                                      redirectLink: product.redirectLink || '',
                                      discount: product.discount,
                                      isNew: product.isNew,
                                      isPromotion: product.isPromotion
                                    });
                                    setIsProductDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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