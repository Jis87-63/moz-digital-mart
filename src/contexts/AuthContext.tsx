import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (email: string, password: string, displayName: string, phone: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { 
        displayName: displayName,
        photoURL: phone // Storing phone in photoURL temporarily
      });
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo à Moz Store Digital",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta à Moz Store Digital",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado com sucesso",
        description: "Até logo!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message,
      });
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};