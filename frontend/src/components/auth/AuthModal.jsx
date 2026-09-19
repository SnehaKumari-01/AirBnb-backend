import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, User, ShieldCheck, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, signup } = useAuth();
  const [tab, setTab] = useState(authModalTab || 'login');
  const [loginRole, setLoginRole] = useState('GUEST'); // 'GUEST' | 'HOTEL_MANAGER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authModalTab || 'login');
      resetForm();
    }
  }, [isAuthModalOpen, authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleTabChange = (newTab) => {
    setTab(newTab);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        await login(email, password, loginRole);
      } else if (tab === 'signup') {
        await signup(name, email, password, false);
      } else if (tab === 'manager') {
        await signup(name, email, password, true);
      }
      resetForm();
      // Direct navigation to Homepage after every successful login
      navigate('/');
    } catch (err) {
      setError(err.message || 'Incorrect password or username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Welcome to Airbnb</h2>
          <button onClick={closeAuthModal} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-gray-200 my-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              tab === 'login' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              tab === 'signup' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Guest Sign up
          </button>
          <button
            onClick={() => handleTabChange('manager')}
            className={`flex-1 py-3 text-center border-b-2 transition ${
              tab === 'manager' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Host Sign up
          </button>
        </div>

        {/* Role Selector for Login Mode */}
        {tab === 'login' && (
          <div className="mb-4 space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Log in as:</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setLoginRole('GUEST')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition ${
                  loginRole === 'GUEST'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <User className="h-4 w-4 text-[#FF385C]" />
                Guest
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('HOTEL_MANAGER')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition ${
                  loginRole === 'HOTEL_MANAGER'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Building className="h-4 w-4 text-indigo-600" />
                Hotel Manager
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          
          {(tab === 'signup' || tab === 'manager') && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-gray-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                autoComplete="off"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-gray-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-gray-900 focus:outline-hidden"
              />
            </div>
          </div>

          {tab === 'manager' && (
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2 text-xs text-indigo-800">
              <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
              <span>Registering as a <strong>Hotel Manager</strong> gives you full access to create properties, list rooms, and manage reservations.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-xl transition shadow-md ${
              tab === 'manager' || (tab === 'login' && loginRole === 'HOTEL_MANAGER')
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-[#FF385C] hover:bg-[#E00B41]'
            }`}
          >
            {loading 
              ? 'Processing...' 
              : tab === 'login' 
                ? `Log in as ${loginRole === 'HOTEL_MANAGER' ? 'Hotel Manager' : 'Guest'}` 
                : tab === 'manager' 
                  ? 'Create Host Account' 
                  : 'Sign up'}
          </button>

          <p className="text-center text-xs text-gray-500 mt-2">
            By continuing, you agree to Airbnb's Terms of Service and Privacy Policy.
          </p>
        </form>

      </div>
    </div>
  );
};
