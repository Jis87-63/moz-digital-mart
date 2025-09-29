import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { userSupportService, UserSupportResponse } from '@/lib/userSupport';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const MySupportMessages: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [responses, setResponses] = useState<UserSupportResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.email) {
      loadResponses();
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadResponses, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const loadResponses = async () => {
    if (!currentUser?.email) return;
    
    try {
      const userResponses = await userSupportService.getUserSupportResponses(currentUser.email);
      setResponses(userResponses);
    } catch (error) {
      console.error('Error loading support responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!currentUser?.email) return;
    
    try {
      await userSupportService.markResponseAsRead(currentUser.email, messageId);
      loadResponses();
    } catch (error) {
      console.error('Error marking response as read:', error);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const unreadCount = responses.filter(r => !r.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="icon"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-8 w-8" />
                  Minhas Mensagens de Suporte
                </h1>
                <p className="text-muted-foreground">
                  {responses.length} {responses.length === 1 ? 'resposta' : 'respostas'}
                  {unreadCount > 0 && ` · ${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/suporte')}
              className="grok-button-primary"
            >
              Nova Mensagem
            </Button>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {loading ? (
              <Card className="grok-card">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando mensagens...</p>
                  </div>
                </CardContent>
              </Card>
            ) : responses.length === 0 ? (
              <Card className="grok-card">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <MessageCircle className="h-24 w-24 opacity-20 mb-6" />
                  <p className="text-lg text-muted-foreground text-center mb-4">
                    Você ainda não tem respostas de suporte
                  </p>
                  <Button
                    onClick={() => navigate('/suporte')}
                    className="grok-button-primary"
                  >
                    Enviar sua primeira mensagem
                  </Button>
                </CardContent>
              </Card>
            ) : (
              responses.map((response) => (
                <motion.div
                  key={response.messageId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`grok-card ${!response.isRead ? 'border-primary border-2' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageCircle className="h-5 w-5" />
                          Resposta do Suporte
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {!response.isRead && (
                            <Badge variant="destructive">Nova</Badge>
                          )}
                          {response.isRead && (
                            <Badge variant="secondary">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Lida
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recebido em {new Date(response.respondedAt).toLocaleString('pt-MZ', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="text-sm font-semibold mb-2 text-primary">
                          Resposta da Equipe de Suporte:
                        </p>
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {response.response}
                        </p>
                      </div>
                      
                      {!response.isRead && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => markAsRead(response.messageId)}
                            variant="outline"
                            size="sm"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Marcar como lida
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
