import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notificationService, Notification } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Bell, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(
    location.state?.notification || null
  );

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const activeNotifications = await notificationService.getActiveNotifications(currentUser.uid);
      setNotifications(activeNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    if (!currentUser) return;
    notificationService.markAsRead(currentUser.uid, notificationId);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'error':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

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
                  <Bell className="h-8 w-8" />
                  Notificações
                </h1>
                <p className="text-muted-foreground">
                  {notifications.length} {notifications.length === 1 ? 'notificação' : 'notificações'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Notifications List */}
            <div className="lg:col-span-1">
              <Card className="grok-card">
                <CardHeader>
                  <CardTitle className="text-lg">Todas as Notificações</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-12 px-4">
                        <Bell className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground">Nenhuma notificação</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map((notification) => {
                          const isRead = notificationService.isRead(currentUser.uid, notification.id);
                          const isSelected = selectedNotification?.id === notification.id;
                          
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-4 cursor-pointer transition-all border-l-4 ${
                                getNotificationColor(notification.type)
                              } ${isSelected ? 'ring-2 ring-primary' : ''} ${
                                isRead ? 'opacity-60' : ''
                              } hover:opacity-100`}
                              onClick={() => {
                                setSelectedNotification(notification);
                                markAsRead(notification.id);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-semibold text-sm truncate">
                                      {notification.title}
                                    </h4>
                                    {!isRead && (
                                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(notification.createdAt).toLocaleString('pt-MZ', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Detail */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedNotification ? (
                  <motion.div
                    key={selectedNotification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className={`grok-card border-l-8 ${getNotificationColor(selectedNotification.type)}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <span className="text-4xl">
                              {getNotificationIcon(selectedNotification.type)}
                            </span>
                            <div>
                              <CardTitle className="text-2xl mb-2">
                                {selectedNotification.title}
                              </CardTitle>
                              <Badge variant="outline" className="mb-2">
                                {selectedNotification.type === 'success' && 'Sucesso'}
                                {selectedNotification.type === 'warning' && 'Aviso'}
                                {selectedNotification.type === 'error' && 'Erro'}
                                {selectedNotification.type === 'info' && 'Informação'}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {new Date(selectedNotification.createdAt).toLocaleString('pt-MZ', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedNotification(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <Separator />
                      <CardContent className="pt-6">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p className="text-base leading-relaxed whitespace-pre-wrap">
                            {selectedNotification.message}
                          </p>
                        </div>
                        
                        {selectedNotification.expiresAt && (
                          <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <strong>Expira em:</strong>{' '}
                              {new Date(selectedNotification.expiresAt).toLocaleString('pt-MZ', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="grok-card">
                      <CardContent className="flex flex-col items-center justify-center py-20">
                        <Bell className="h-24 w-24 opacity-20 mb-6" />
                        <p className="text-lg text-muted-foreground text-center">
                          Selecione uma notificação para ver os detalhes
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
