  "use client"

  import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

  interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
  }

  interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: Date;
  }

  interface AppContextType {
    // Estado do usuário
    userInfo: User | null;
    setUserInfo: (info: User | null) => void;
    
    token: string | null;
    setToken: (token: string | null) => void;
    isAuthenticated: boolean;
    logout: () => void;

    // Estado de notificações
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    
    // Estado de loading global
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    
    // Estado da sidebar mobile
    isSidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);

  export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Recuperar token e user do localStorage ao carregar
    useEffect(() => {
      // Só executa no navegador, não no servidor
      if (typeof window === 'undefined') return;

      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken) {
          setToken(savedToken);
        }
        if (savedUser) {
          setUserInfo(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do localStorage:', error);
      }
      setIsHydrated(true);
    }, []);

    // Persistir token ao mudar
    const handleSetToken = (newToken: string | null) => {
      setToken(newToken);
      if (typeof window !== 'undefined') {
        if (newToken) {
          localStorage.setItem('token', newToken);
        } else {
          localStorage.removeItem('token');
        }
      }
    };

    // Persistir user ao mudar
    const handleSetUserInfo = (newUser: User | null) => {
      setUserInfo(newUser);
      if (typeof window !== 'undefined') {
        if (newUser) {
          localStorage.setItem('user', JSON.stringify(newUser));
        } else {
          localStorage.removeItem('user');
        }
      }
    };

    // Logout
    const logout = () => {
      setToken(null);
      setUserInfo(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setNotifications(prev => [...prev, newNotification]);
      
      // Remove a notificação após 5 segundos
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    };

    const removeNotification = (id: string) => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
      <AppContext.Provider value={{
        userInfo,
        setUserInfo: handleSetUserInfo,
        token,
        setToken: handleSetToken,
        isAuthenticated: !!token,
        logout,
        notifications,
        addNotification,
        removeNotification,
        isLoading,
        setIsLoading,
        isSidebarOpen,
        setSidebarOpen,
      }}>
        {isHydrated && children}
      </AppContext.Provider>
    );
  };

  export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
  };
