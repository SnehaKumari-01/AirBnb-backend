import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup' | 'manager'

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user from localStorage', e);
        setIsAuthModalOpen(true);
      }
    } else {
      // Prompt Login/Signup modal directly upon launch
      setUser(null);
      setIsAuthModalOpen(true);
    }
  }, []);

  const login = async (email, password, role = 'GUEST') => {
    const res = await authService.login(email, password, role);
    const loggedInUser = {
      id: Date.now(),
      name: email.split('@')[0] || 'User',
      email,
      role: role || (email.includes('manager') || email.includes('admin') || email.includes('host') ? 'HOTEL_MANAGER' : 'GUEST'),
      token: res.accessToken,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setIsAuthModalOpen(false);
    return loggedInUser;
  };

  const signup = async (name, email, password, isManager = false) => {
    if (isManager) {
      await authService.signupAsHotelManager(name, email, password);
    } else {
      await authService.signup(name, email, password);
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: isManager ? 'HOTEL_MANAGER' : 'GUEST',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
