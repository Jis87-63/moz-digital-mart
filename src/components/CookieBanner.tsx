import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('moz-store-cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('moz-store-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('moz-store-cookie-consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <Card className="grok-card shadow-lg border-border/50 backdrop-blur-md bg-background/95">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-2">
                    Consentimento de Cookies
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Utilizamos cookies essenciais para garantir o funcionamento adequado do site, 
                    melhorar sua experiência de navegação e analisar o tráfego. Seus dados são tratados 
                    conforme nossa{' '}
                    <a 
                      href="/privacidade" 
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Política de Privacidade
                    </a>.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleAccept}
                      className="grok-button-primary flex-1"
                      size="sm"
                    >
                      Aceitar Cookies
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      className="grok-button-secondary flex-1"
                      size="sm"
                    >
                      Recusar Não Essenciais
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReject}
                  className="flex-shrink-0 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};