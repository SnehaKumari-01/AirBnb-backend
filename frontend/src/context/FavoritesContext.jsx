import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user, openAuthModal } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?.email) {
      try {
        const saved = localStorage.getItem(`airbnb_favorites_${user.email.toLowerCase()}`);
        setFavorites(saved ? JSON.parse(saved) : []);
      } catch (e) {
        console.error('Failed to parse favorites from storage', e);
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user?.email]);

  const toggleFavorite = (hotelId) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setFavorites(prev => {
      let updated;
      if (prev.includes(hotelId)) {
        updated = prev.filter(id => id !== hotelId);
      } else {
        updated = [...prev, hotelId];
      }
      try {
        localStorage.setItem(`airbnb_favorites_${user.email.toLowerCase()}`, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites to storage', e);
      }
      return updated;
    });
  };

  const isFavorite = (hotelId) => favorites.includes(hotelId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
