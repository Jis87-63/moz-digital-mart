import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  ShoppingCart, 
  User, 
  Sun, 
  Moon, 
  LogOut,
  Tag,
  Sparkles,
  MessageCircle,
  Store,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { title: 'Início', path: '/', icon: Home },
    { title: 'Loja', path: '/loja', icon: Store },
    { title: 'Promoções', path: '/promocoes', icon: Tag },
    { title: 'Novidades', path: '/novidades', icon: Sparkles },
    { title: 'Suporte', path: '/suporte', icon: MessageCircle },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary to-grok-primary bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Moz Store
          </motion.div>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.slice(1, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/carrinho')}
            className="h-9 w-9 relative"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>

          {/* User Actions */}
          {currentUser ? (
            <>
              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-6">
                      <div className="flex items-center space-x-3 pb-4 border-b">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{currentUser.displayName || 'Usuário'}</div>
                          <div className="text-sm text-muted-foreground">{currentUser.email}</div>
                        </div>
                      </div>
                      
                      {menuItems.map((item) => (
                        <Button
                          key={item.path}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            navigate(item.path);
                            setIsDrawerOpen(false);
                          }}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </Button>
                      ))}
                      
                      <Button
                        variant="ghost"
                        className="justify-start text-destructive hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop Profile */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/perfil')}
                  className="h-9 px-3"
                >
                  <User className="h-4 w-4 mr-2" />
                  {currentUser.displayName || 'Perfil'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="h-9 px-4 hidden sm:inline-flex"
              >
                Entrar
              </Button>
              <Button
                onClick={() => navigate('/registro')}
                className="grok-button-primary h-9 px-4"
              >
                Registrar
              </Button>
              
              {/* Mobile Menu for non-authenticated users */}
              <div className="sm:hidden">
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-6">
                      {menuItems.map((item) => (
                        <Button
                          key={item.path}
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            navigate(item.path);
                            setIsDrawerOpen(false);
                          }}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </Button>
                      ))}
                      
                      <div className="pt-4 border-t space-y-2">
                        <Button
                          onClick={() => {
                            navigate('/login');
                            setIsDrawerOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          Entrar
                        </Button>
                        <Button
                          onClick={() => {
                            navigate('/registro');
                            setIsDrawerOpen(false);
                          }}
                          className="w-full grok-button-primary"
                        >
                          Registrar
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};