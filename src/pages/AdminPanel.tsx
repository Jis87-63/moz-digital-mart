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
import { userSupportService } from '@/lib/userSupport';
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
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  // Form instances with proper validation
  const productForm = useForm({
    resolver: zodResolver(productSchema),
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
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      color: '#000000',
      order: 0,
      isActive: true
    }
  });
  
  const notificationForm = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'info' as const,
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
      // Auto-refresh support messages every 30 seconds
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
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
  const handleAddProduct = async (data: any) => {
    try {
      setLoading(true);
      console.log('Adding product with data:', data);
      
      const imageFile = (document.getElementById('product-image') as HTMLInputElement)?.files?.[0];
      let imageUrl = '';
      
      if (imageFile) {
        console.log('Uploading image...');
        imageUrl = await storageService.uploadImage(imageFile, 'products');
        console.log('Image uploaded:', imageUrl);
      }
      
      // Add product with 'prdt' prefix structure
      const productData = {
        ...data,
        prdt: `prdt_${Date.now()}`, // Unique product key as requested
        image: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Saving product to Firebase:', productData);
      await productService.addProduct(productData);
      
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso na loja!"
      });
      
      setIsProductDialogOpen(false);
      productForm.reset();
      await loadData();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao adicionar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = async (data: any) => {
    if (!editingProduct) return;
    
    try {
      setLoading(true);
      console.log('Updating product with data:', data);
      
      const imageFile = (document.getElementById('product-image') as HTMLInputElement)?.files?.[0];
      let imageUrl = editingProduct.image;
      
      if (imageFile) {
        console.log('Uploading new image...');
        imageUrl = await storageService.uploadImage(imageFile, 'products');
        console.log('New image uploaded:', imageUrl);
      }
      
      const updateData = {
        ...data,
        prdt: editingProduct.prdt || `prdt_${Date.now()}`, // Maintain or add prdt key
        image: imageUrl,
        updatedAt: new Date()
      };
      
      console.log('Updating product in Firebase:', updateData);
      await productService.updateProduct(editingProduct.id, updateData);
      
      toast({
        title: "Sucesso",
        description: "Produto atualizado e disponível na loja!"
      });
      
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
      await loadData();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao atualizar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
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
  const handleAddBanner = async (data: any) => {
    try {
      setLoading(true);
      console.log('Adding banner with data:', data);
      
      const imageFile = (document.getElementById('banner-image') as HTMLInputElement)?.files?.[0];
      let imageUrl = '';
      
      if (imageFile) {
        console.log('Uploading banner image...');
        imageUrl = await storageService.uploadImage(imageFile, 'banners');
        console.log('Banner image uploaded:', imageUrl);
      }
      
      const bannerData = {
        ...data,
        image: imageUrl,
        createdAt: new Date()
      };
      
      console.log('Saving banner to Firebase:', bannerData);
      await bannerService.addBanner(bannerData);
      
      toast({
        title: "Sucesso",
        description: "Banner adicionado com sucesso!"
      });
      
      setIsBannerDialogOpen(false);
      bannerForm.reset();
      await loadData();
    } catch (error) {
      console.error('Error adding banner:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao adicionar banner: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Notification handlers
  const handleSendNotification = async (data: any) => {
    try {
      setLoading(true);
      console.log('Sending notification with data:', data);
      
      const notificationData = {
        ...data,
        createdAt: new Date()
      };
      
      console.log('Saving notification to Firebase:', notificationData);
      await notificationService.addNotification(notificationData);
      
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
        description: `Erro ao enviar notificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Support handlers
  const handleRespondSupport = async (id: string, response: string, userEmail: string) => {
    try {
      // Update support message in Firebase
      await supportService.respondToSupport(id, response);
      
      // Add response to user's support responses collection
      await userSupportService.addUserSupportResponse(userEmail, {
        messageId: id,
        response,
        respondedAt: new Date(),
        isRead: false
      });
      
      toast({
        title: "Sucesso",
        description: "Resposta enviada e o usuário será notificado!"
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
                            if (editingProduct) {
                              handleEditProduct(data);
                            } else {
                              handleAddProduct(data);
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
                                  accept="image/*,.pdf,.doc,.docx"
                                  className="selectable"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Aceita imagens (JPG, PNG, etc.) e documentos (PDF, DOC)
                                </p>
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
                    Banners do Carousel ({banners.length})
                    <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="grok-button-primary" onClick={() => {
                          setEditingBanner(null);
                          bannerForm.reset();
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Novo Banner
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingBanner ? 'Editar Banner' : 'Adicionar Novo Banner'}
                          </DialogTitle>
                          <DialogDescription>
                            Configure um banner promocional para o carousel
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...bannerForm}>
                          <form onSubmit={bannerForm.handleSubmit(handleAddBanner)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={bannerForm.control}
                                name="title"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                      <Input className="selectable" placeholder="Título do banner" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={bannerForm.control}
                                name="subtitle"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Subtítulo</FormLabel>
                                    <FormControl>
                                      <Input className="selectable" placeholder="Subtítulo do banner" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={bannerForm.control}
                                name="color"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cor do Fundo</FormLabel>
                                    <FormControl>
                                      <Input type="color" className="selectable" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={bannerForm.control}
                                name="order"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ordem de Exibição</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        className="selectable" 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                              <div>
                                <Label htmlFor="banner-image">Imagem do Banner</Label>
                                <Input
                                  id="banner-image"
                                  type="file"
                                  accept="image/*,.pdf,.doc,.docx"
                                  className="selectable"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Aceita imagens (JPG, PNG, etc.) e documentos (PDF, DOC)
                                </p>
                              </div>
                            
                            <FormField
                              control={bannerForm.control}
                              name="isActive"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel>Banner Ativo</FormLabel>
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsBannerDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit" disabled={loading} className="grok-button-primary">
                                {loading ? 'Salvando...' : (editingBanner ? 'Atualizar' : 'Adicionar')}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    Gerencie os banners promocionais da página inicial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {banners.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum banner cadastrado</h3>
                      <p>Clique em "Novo Banner" para adicionar seu primeiro banner</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Banner</TableHead>
                          <TableHead>Ordem</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {banners.map((banner) => (
                          <TableRow key={banner.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {banner.image && (
                                  <img 
                                    src={banner.image} 
                                    alt={banner.title}
                                    className="w-16 h-10 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium">{banner.title}</div>
                                  <div className="text-sm text-muted-foreground">{banner.subtitle}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{banner.order}</TableCell>
                            <TableCell>
                              <Badge variant={banner.isActive ? "default" : "secondary"}>
                                {banner.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive">
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

            {/* Promotions Management */}
            <TabsContent value="promocoes" className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Notificações e Promoções
                    <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="grok-button-primary" onClick={() => {
                          notificationForm.reset();
                        }}>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Notificação
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Notificação</DialogTitle>
                          <DialogDescription>
                            Envie uma notificação para todos os usuários
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...notificationForm}>
                          <form onSubmit={notificationForm.handleSubmit(handleSendNotification)} className="space-y-4">
                            <FormField
                              control={notificationForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Título</FormLabel>
                                  <FormControl>
                                    <Input className="selectable" placeholder="Título da notificação" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mensagem</FormLabel>
                                  <FormControl>
                                    <Textarea className="selectable" placeholder="Conteúdo da notificação" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="info">Informação</SelectItem>
                                      <SelectItem value="success">Sucesso</SelectItem>
                                      <SelectItem value="warning">Aviso</SelectItem>
                                      <SelectItem value="error">Erro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end gap-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsNotificationDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit" disabled={loading} className="grok-button-primary">
                                {loading ? 'Enviando...' : 'Enviar Notificação'}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    Envie notificações e gerencie promoções especiais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Produtos Promocionais</h3>
                      <p className="text-muted-foreground">
                        Configure produtos como promocionais diretamente no gerenciamento de produtos
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Produtos Novos</h3>
                      <p className="text-muted-foreground">
                        Marque produtos como "novos" para destacá-los na seção de novidades
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Messages */}
            <TabsContent value="mensagens" className="space-y-6">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle>Mensagens de Suporte ({supportMessages.length})</CardTitle>
                  <CardDescription>
                    Visualize e responda às mensagens dos clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {supportMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem</h3>
                      <p>Mensagens de suporte dos clientes aparecerão aqui</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supportMessages.map((message) => (
                        <Card key={message.id} className={`${!message.isRead ? 'border-primary' : ''}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{message.name}</CardTitle>
                                <CardDescription>{message.email}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                {!message.isRead && <Badge variant="destructive">Novo</Badge>}
                                <span className="text-sm text-muted-foreground">
                                  {message.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4">{message.message}</p>
                            {message.adminResponse ? (
                              <div className="bg-muted p-3 rounded">
                                <p className="text-sm"><strong>Sua resposta:</strong></p>
                                <p className="text-sm">{message.adminResponse}</p>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Digite sua resposta..."
                                  className="flex-1"
                                  id={`response-${message.id}`}
                                />
                                <Button
                                  onClick={() => {
                                    const input = document.getElementById(`response-${message.id}`) as HTMLInputElement;
                                    if (input.value.trim()) {
                                      handleRespondSupport(message.id, input.value.trim(), message.email);
                                      input.value = '';
                                    }
                                  }}
                                  disabled={loading}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
                            defaultValue={storeSettings?.storeName || "Moz Store Digital"}
                            className="grok-input selectable"
                          />
                        </div>
                        <div>
                          <Label htmlFor="storeEmail">E-mail de Contato</Label>
                          <Input
                            id="storeEmail"
                            defaultValue={storeSettings?.storeEmail || "mozstoredigitalp2@gmail.com"}
                            className="grok-input selectable"
                          />
                        </div>
                        <div>
                          <Label htmlFor="storePhone">Telefone de Contato</Label>
                          <Input
                            id="storePhone"
                            defaultValue={storeSettings?.storePhone || "+258 87 650 0685"}
                            className="grok-input selectable"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button 
                        className="grok-button-primary"
                        onClick={async () => {
                          const storeName = (document.getElementById('storeName') as HTMLInputElement)?.value;
                          const storeEmail = (document.getElementById('storeEmail') as HTMLInputElement)?.value;
                          const storePhone = (document.getElementById('storePhone') as HTMLInputElement)?.value;
                          
                          if (storeName && storeEmail && storePhone) {
                            await handleUpdateSettings({
                              storeName,
                              storeEmail,
                              storePhone,
                              storeDescription: storeSettings?.storeDescription || 'Sua loja digital de confiança'
                            });
                          }
                        }}
                      >
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