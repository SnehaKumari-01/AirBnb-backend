import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { HomePage } from './pages/HomePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { AuthModal } from './components/auth/AuthModal';

export function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <FavoritesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hotel/:id" element={<ListingDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/dashboard" element={<HostDashboardPage />} />
            </Routes>
            <AuthModal />
          </Router>
        </FavoritesProvider>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
