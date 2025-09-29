import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  ArrowLeft, 
  Send,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supportService } from '@/lib/support';

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    setLoading(true);

    try {
      // Save support message to Firebase
      await supportService.addSupportMessage({
        name: form.name,
        email: form.email,
        message: form.message
      });

      toast({
        title: "Mensagem enviada!",
        description: "Nossa equipe responderá em breve. Obrigado pelo contato!",
      });

      // Reset form
      setForm({
        name: currentUser?.displayName || '',
        email: currentUser?.email || '',
        message: ''
      });

    } catch (error) {
      console.error('Error sending support message:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde ou use outros canais de contato.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

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
              <h1 className="text-3xl font-bold">Suporte ao Cliente</h1>
              <p className="text-muted-foreground">Estamos aqui para ajudar você</p>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="grok-button-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Enviar Mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        className="grok-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        className="grok-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleInputChange}
                        placeholder="Descreva sua dúvida ou problema..."
                        rows={5}
                        className="grok-input"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full grok-button-primary"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Direct Contact */}
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle>Contato Direto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Telefone/WhatsApp</p>
                      <p className="text-sm text-muted-foreground">+258 87 650 0685</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <p className="text-sm text-muted-foreground">mozstoredigitalp2@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Telegram</p>
                      <p className="text-sm text-muted-foreground">t.me/EllonMuskDev</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle>Canais Rápidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => window.open('https://wa.me/258876500685', '_blank')}
                    className="w-full grok-button-primary justify-start"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    onClick={() => window.open('https://t.me/EllonMuskDev', '_blank')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Telegram
                  </Button>

                  <Button
                    onClick={() => window.location.href = 'mailto:mozstoredigitalp2@gmail.com'}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    E-mail
                  </Button>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle>Horário de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Segunda - Sexta:</span>
                      <span className="font-medium">08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span className="font-medium">09:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span className="font-medium">Fechado</span>
                    </div>
                    <div className="mt-3 p-3 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        * Suporte via WhatsApp disponível 24/7 para urgências
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