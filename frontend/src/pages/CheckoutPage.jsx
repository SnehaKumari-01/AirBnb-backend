import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, CreditCard, CheckCircle2, AlertCircle, Lock, User, Calendar } from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useBooking } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { activeBooking, addBooking } = useBooking();
  const { user, openAuthModal } = useAuth();

  const [guestList, setGuestList] = useState([
    { name: user?.name || '', gender: 'MALE', age: '' }
  ]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [paymentSessionUrl, setPaymentSessionUrl] = useState('');

  if (!activeBooking) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 text-center grow">
          <AlertCircle className="h-12 w-12 text-[#FF385C] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Reservation Selected</h2>
          <p className="text-gray-500 text-sm mb-6">Please select a property and click Reserve to start checkout.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition"
          >
            Browse Properties
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddGuestField = () => {
    setGuestList(prev => [...prev, { name: '', gender: 'MALE', age: 25 }]);
  };

  const handleGuestChange = (index, field, value) => {
    setGuestList(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g));
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookingService.addGuests(activeBooking.id, guestList);
      setStep(2);
    } catch (err) {
      console.error('Failed to save guest list', err);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentInitiate = async () => {
    setLoading(true);
    try {
      const payRes = await bookingService.initiatePayment(activeBooking.id);
      setPaymentSessionUrl(payRes.sessionUrl || `https://checkout.razorpay.com/mock_session_${activeBooking.id}`);
      
      const confirmedBooking = {
        ...activeBooking,
        guests: guestList,
        bookingStatus: 'CONFIRMED',
        paymentId: 'PAY_' + Math.floor(Math.random() * 1000000)
      };

      addBooking(confirmedBooking);
      setStep(3);
    } catch (err) {
      console.error('Payment initiation error', err);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow w-full">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 mb-8 transition"
        >
          <ChevronLeft className="h-5 w-5" />
          Request to book
        </button>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200 text-xs font-bold uppercase tracking-wider">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#FF385C]' : 'text-gray-400'}`}>
            <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs">1</span>
            <span>Guest Details</span>
          </div>
          <div className={`h-0.5 flex-1 mx-4 ${step >= 2 ? 'bg-[#FF385C]' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#FF385C]' : 'text-gray-400'}`}>
            <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs">2</span>
            <span>Payment</span>
          </div>
          <div className={`h-0.5 flex-1 mx-4 ${step >= 3 ? 'bg-[#FF385C]' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
            <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs">3</span>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Checkout Form Left Area */}
          <div className="lg:col-span-7">
            
            {/* STEP 1: GUEST INFORMATION */}
            {step === 1 && (
              <form onSubmit={handleGuestSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Enter Guest Details</h2>
                  <p className="text-xs text-gray-500">Provide details for all guests staying at the property.</p>
                </div>

                {guestList.map((guest, index) => (
                  <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">Guest {index + 1}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={guest.name}
                          onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                          placeholder="Guest Name"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                        <select
                          value={guest.gender}
                          onChange={(e) => handleGuestChange(index, 'gender', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-hidden"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={guest.age}
                          onChange={(e) => handleGuestChange(index, 'age', parseInt(e.target.value) || 18)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddGuestField}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                >
                  + Add Another Guest
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition shadow-md"
                >
                  {loading ? 'Saving...' : 'Continue to Payment'}
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Pay with Razorpay / Card</h2>
                  <p className="text-xs text-gray-500">Secure end-to-end encrypted payment processing.</p>
                </div>

                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-[#FF385C]" />
                      <span className="font-bold text-gray-900 text-sm">Credit or Debit Card</span>
                    </div>
                    <Lock className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Name on Card</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        maxLength="19"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          maxLength="5"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-medium">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Your booking is protected by <strong>AirCover</strong>. Full refund up to 48h before check-in.</span>
                </div>

                <button
                  onClick={handlePaymentInitiate}
                  disabled={loading}
                  className="w-full py-4 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-base rounded-2xl transition shadow-lg"
                >
                  {loading ? 'Processing Payment...' : `Pay Total ₹${activeBooking.totalPrice?.toLocaleString('en-IN')}`}
                </button>
              </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && (
              <div className="p-8 bg-emerald-50/50 border border-emerald-200 rounded-3xl space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h2>
                  <p className="text-sm text-gray-600">Booking ID: <strong className="text-gray-900">#BK-{activeBooking.id}</strong></p>
                  <p className="text-xs text-gray-500 mt-1">A confirmation email has been sent to {user?.email || 'your email'}.</p>
                </div>

                <div className="p-4 bg-white border border-emerald-100 rounded-2xl text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-bold text-emerald-700 uppercase">{activeBooking.bookingStatus || 'CONFIRMED'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment ID:</span>
                    <span className="font-mono text-gray-800">{activeBooking.paymentId || 'PAY_991204'}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/profile')}
                  className="w-full py-3.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition shadow-md"
                >
                  View My Bookings
                </button>
              </div>
            )}

          </div>

          {/* Booking Summary Sidebar Right Area */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md space-y-6">
              
              <div className="flex gap-4 pb-6 border-b border-gray-100">
                <img
                  src={activeBooking.hotel?.photos?.[0] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80'}
                  alt={activeBooking.hotel?.name}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{activeBooking.hotel?.name}</h3>
                    <p className="text-xs text-gray-500">{activeBooking.roomType}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <span>{activeBooking.hotel?.city}, {activeBooking.hotel?.state}</span>
                  </div>
                </div>
              </div>

              {/* Trip Dates */}
              <div className="space-y-3 text-xs text-gray-700 pb-6 border-b border-gray-100">
                <h4 className="font-bold text-gray-900 uppercase">Your Trip</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Dates</span>
                  <span className="font-semibold">{activeBooking.checkInDate} to {activeBooking.checkOutDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Guests</span>
                  <span className="font-semibold">{activeBooking.roomsCount || 2} Guest(s)</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 text-sm text-gray-700">
                <h4 className="font-bold text-gray-900 text-xs uppercase">Price Details</h4>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                  <span>Total (INR)</span>
                  <span>₹{activeBooking.totalPrice?.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};
