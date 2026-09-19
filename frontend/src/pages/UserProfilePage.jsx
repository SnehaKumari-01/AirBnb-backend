import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, MapPin, CheckCircle2, XCircle, Clock, Heart, 
  RefreshCw, DollarSign, ShieldCheck, AlertTriangle, ArrowRight, CreditCard
} from 'lucide-react';
import { Navbar, getInitials } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useFavorites } from '../context/FavoritesContext';
import { MOCK_HOTELS } from '../mock/mockData';
import { bookingService } from '../services/bookingService';

export const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userBookings, cancelUserBooking } = useBooking();
  const { favorites } = useFavorites();

  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  const favoriteHotels = MOCK_HOTELS.filter(h => favorites.includes(h.id));

  const handleConfirmCancellation = async () => {
    if (!cancelModalBooking) return;
    setIsProcessingCancel(true);
    try {
      await bookingService.cancelBooking(cancelModalBooking.id);
      cancelUserBooking(cancelModalBooking.id);
      setCancelModalBooking(null);
    } catch (err) {
      console.error('Cancellation error', err);
    } finally {
      setIsProcessingCancel(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow w-full">
        
        {/* Profile Card Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-[#FF385C] text-white font-bold text-2xl flex items-center justify-center border-2 border-white shadow-md shrink-0 tracking-wider">
              {getInitials(user?.name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Guest User'}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-rose-100 text-[#FF385C]">
                Role: {user?.role || 'GUEST'}
              </span>
            </div>
          </div>
          {user?.role === 'HOTEL_MANAGER' && (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow-sm"
            >
              Host Manager Portal
            </button>
          )}
        </div>

        {/* My Bookings Section */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#FF385C]" />
            My Reservations ({userBookings.length})
          </h2>

          {userBookings.length === 0 ? (
            <div className="p-8 border border-dashed border-gray-300 rounded-3xl text-center text-gray-500">
              <p className="text-sm">No active or past bookings found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map((b) => {
                const isCancelled = b.bookingStatus === 'CANCELLED';

                return (
                  <div key={b.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4">
                    
                    {/* Hotel Header Info */}
                    <div className="flex gap-4">
                      <img
                        src={b.hotel?.photos?.[0] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80'}
                        alt={b.hotel?.name}
                        className="w-24 h-24 rounded-2xl object-cover shrink-0"
                      />
                      <div className="flex flex-col justify-between overflow-hidden">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400">#BK-{b.id}</span>
                          <h3 className="font-bold text-gray-900 text-base truncate">{b.hotel?.name}</h3>
                          <p className="text-xs text-gray-500">{b.roomType}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-[#FF385C]" />
                          <span>{b.hotel?.city}, {b.hotel?.state}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stay Dates & Price */}
                    <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-100 bg-gray-50/50 rounded-xl px-3">
                      <div>
                        <span className="text-gray-400 block">Dates</span>
                        <span className="font-semibold text-gray-800">{b.checkInDate} to {b.checkOutDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Total Amount</span>
                        <span className="font-bold text-gray-900">₹{b.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Status Badge Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCancelled ? (
                          <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        {isCancelled ? 'CANCELLED' : (b.bookingStatus || 'CONFIRMED')}
                      </span>

                      {!isCancelled && (
                        <button
                          onClick={() => setCancelModalBooking(b)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline"
                        >
                          Cancel Stay & Refund
                        </button>
                      )}
                    </div>

                    {/* CANCELLED & REFUND PROCESSING DETAILS CARD */}
                    {isCancelled && (
                      <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                            <span>Refund Status: Refund Processing</span>
                          </div>
                          <span className="text-[10px] font-mono text-indigo-600 font-semibold">{b.refundId || 'RFD_982140'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-indigo-900">
                          <div>
                            <span className="text-indigo-400 text-[10px] block">Refund Amount</span>
                            <span className="font-bold text-indigo-950 text-sm">₹{b.totalPrice?.toLocaleString('en-IN')} (100% Full)</span>
                          </div>
                          <div>
                            <span className="text-indigo-400 text-[10px] block">Estimated Arrival</span>
                            <span className="font-bold text-indigo-950">{b.refundEta || '3-5 Business Days'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-indigo-800 pt-1">
                          <CreditCard className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span>Refund requested on {b.cancelledAt || 'Today'}. Funds will credit back to original source.</span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Wishlist Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            Wishlist Stays ({favoriteHotels.length})
          </h2>

          {favoriteHotels.length === 0 ? (
            <div className="p-8 border border-dashed border-gray-300 rounded-3xl text-center text-gray-500">
              <p className="text-sm">No saved properties yet. Click the heart icon on any listing to add it to your wishlist.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favoriteHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => navigate(`/hotel/${hotel.id}`)}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition"
                >
                  <img src={hotel.photos[0]} alt={hotel.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{hotel.name}</h4>
                    <p className="text-xs text-gray-500">{hotel.city}, {hotel.state}</p>
                    <span className="font-bold text-gray-900 text-sm mt-2 block">₹{hotel.price?.toLocaleString('en-IN')} / night</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* CANCELLATION & REFUND CONFIRMATION MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-bold text-gray-900 text-lg">Cancel Reservation</h3>
              </div>
              <button onClick={() => setCancelModalBooking(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
              <h4 className="font-bold text-gray-900 text-sm">{cancelModalBooking.hotel?.name}</h4>
              <p className="text-xs text-gray-600">{cancelModalBooking.roomType} · {cancelModalBooking.checkInDate} to {cancelModalBooking.checkOutDate}</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-1.5 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% AirCover Full Refund Guaranteed</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-emerald-200/60 text-sm font-bold">
                <span>Refund Amount:</span>
                <span className="text-emerald-900">₹{cancelModalBooking.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-emerald-700 pt-1">The full amount will be credited back to your original payment method in 3–5 business days.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
              >
                Keep Stay
              </button>
              <button
                onClick={handleConfirmCancellation}
                disabled={isProcessingCancel}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                {isProcessingCancel ? 'Processing Refund...' : 'Confirm & Request Refund'}
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
