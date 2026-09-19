import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, User, Heart, Shield, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

export const getInitials = (name) => {
  if (!name) return 'U';
  const cleanName = name.trim();
  const parts = cleanName.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (cleanName.length >= 2) {
    return cleanName.slice(0, 2).toUpperCase();
  }
  return cleanName.toUpperCase();
};

export const Navbar = ({ onOpenSearch, onGoHome }) => {
  const { user, openAuthModal, logout } = useAuth();
  const { favorites } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => {
            if (onGoHome) onGoHome();
          }} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <svg className="h-8 w-auto text-[#FF385C]" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.308-3.23 7.806-7.5 7.806-3.264 0-5.836-2.062-6.837-4.498l-.163-.414-.164.414C13.836 29.938 11.264 32 8 32 3.73 32 .5 28.502.5 24.194c0-.924.243-1.805.91-3.396l.145-.353c.986-2.297 5.146-11.006 7.1-14.836l.533-1.025C10.537 1.963 11.992 1 14 1h2zm0 2h-2c-1.22 0-2.213.626-3.262 2.502l-.46.883c-1.92 3.766-6.046 12.41-7.013 14.664l-.127.311C2.56 22.784 2.5 23.473 2.5 24.194c0 3.2 2.37 5.806 5.5 5.806 2.553 0 4.671-1.745 5.348-3.957l.117-.417H18.535l.117.417C19.329 28.255 21.447 30 24 30c3.13 0 5.5-2.606 5.5-5.806 0-.72-.06-1.41-.638-2.836l-.127-.311c-.967-2.255-5.093-10.898-7.013-14.664l-.46-.883C20.213 3.626 19.22 3 18 3h-2zm0 15a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
          <span className="text-xl font-bold tracking-tight text-[#FF385C] hidden md:inline">airbnb</span>
        </Link>

        {/* Center Compact Search Pill */}
        <div 
          onClick={onOpenSearch}
          className="flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition cursor-pointer text-sm font-medium gap-3 bg-white"
        >
          <span className="font-semibold px-2 border-r border-gray-200">Anywhere</span>
          <span className="font-semibold px-2 border-r border-gray-200 hidden sm:inline">Any week</span>
          <span className="text-gray-500 font-normal px-2">Add guests</span>
          <div className="bg-[#FF385C] p-2 rounded-full text-white">
            <Search className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Right Menu Controls */}
        <div className="flex items-center gap-2 sm:gap-4 relative">
          <Link 
            to={user?.role === 'HOTEL_MANAGER' ? "/dashboard" : "/"} 
            onClick={() => {
              if (!user) openAuthModal('manager');
              else if (user.role !== 'HOTEL_MANAGER') openAuthModal('manager');
            }}
            className="hidden md:block text-sm font-semibold hover:bg-gray-100 py-2.5 px-4 rounded-full transition cursor-pointer"
          >
            {user?.role === 'HOTEL_MANAGER' ? 'Host Dashboard' : 'Airbnb your home'}
          </Link>

          <button className="hidden sm:block p-2.5 hover:bg-gray-100 rounded-full transition text-gray-700">
            <Globe className="h-4 w-4" />
          </button>

          {/* User Profile Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 border border-gray-300 rounded-full py-1.5 px-3 hover:shadow-md transition bg-white"
            >
              <Menu className="h-4 w-4 text-gray-600" />
              {user ? (
                <div className="h-7 w-7 rounded-full bg-gray-900 text-white font-bold text-xs flex items-center justify-center shrink-0 tracking-wider">
                  {getInitials(user.name)}
                </div>
              ) : (
                <div className="bg-gray-500 text-white rounded-full p-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-rose-500 to-[#FF385C] text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-0.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-[#FF385C]">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                      className="w-full px-4 py-2.5 text-left font-medium hover:bg-gray-50 flex items-center gap-3"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      My Bookings & Profile
                    </button>

                    <button
                      onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                      className="w-full px-4 py-2.5 text-left font-medium hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-gray-500" />
                        Wishlist
                      </div>
                      {favorites.length > 0 && (
                        <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {favorites.length}
                        </span>
                      )}
                    </button>

                    {user.role === 'HOTEL_MANAGER' && (
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }}
                        className="w-full px-4 py-2.5 text-left font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-3"
                      >
                        <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                        Host Dashboard
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => { setIsMenuOpen(false); logout(); }}
                      className="w-full px-4 py-2.5 text-left font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4 text-rose-600" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setIsMenuOpen(false); openAuthModal('login'); }}
                      className="w-full px-4 py-2.5 text-left font-semibold hover:bg-gray-50"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => { setIsMenuOpen(false); openAuthModal('signup'); }}
                      className="w-full px-4 py-2.5 text-left font-medium hover:bg-gray-50"
                    >
                      Sign up
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => { setIsMenuOpen(false); openAuthModal('manager'); }}
                      className="w-full px-4 py-2.5 text-left font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4 text-gray-500" />
                      Register as Hotel Manager
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
