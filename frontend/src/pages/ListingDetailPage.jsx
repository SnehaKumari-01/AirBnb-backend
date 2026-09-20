import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Heart, Share, ShieldCheck, MapPin, 
  Wifi, Tv, Coffee, Utensils, Award, CheckCircle, ChevronRight, Grid, X
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { hotelService } from '../services/hotelService';
import { bookingService } from '../services/bookingService';
import { adminService } from '../services/adminService';
import { useBooking } from '../context/BookingContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  
  const { 
    checkInDate, setCheckInDate, 
    checkOutDate, setCheckOutDate, 
    guestCount, setGuestCount, 
    calculateNights, setSelectedHotel, 
    setSelectedRoom, setActiveBooking 
  } = useBooking();

  const [hotel, setHotel] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    const loadHotel = async () => {
      setLoading(true);
      const data = await hotelService.getHotelInfo(id);
      setHotel(data);
      setSelectedHotel(data);
      if (data?.rooms?.length > 0) {
        setSelectedRoomId(data.rooms[0].id);
        setSelectedRoom(data.rooms[0]);
      }
      setLoading(false);
    };
    loadHotel();
  }, [id]);

  if (loading || !hotel) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grow animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-3xl mb-8"></div>
        </div>
      </div>
    );
  }

  const photos = hotel.photos?.length > 0 
    ? hotel.photos 
    : ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'];

  const selectedRoomObj = hotel.rooms?.find(r => String(r.id) === String(selectedRoomId)) || hotel.rooms?.[0] || {
    id: 101,
    type: 'Standard Suite',
    basePrice: hotel.price || 250,
    capacity: 2
  };

  const nights = calculateNights();

  const pricingInfo = adminService.getEffectivePriceForDateRange(
    selectedRoomObj.id,
    selectedRoomObj.basePrice || hotel.price || 250,
    checkInDate,
    checkOutDate
  );

  const effectiveNightlyRate = pricingInfo.avgNightlyPrice;
  const baseTotal = pricingInfo.totalBasePrice;
  const cleaningFee = Math.round(baseTotal * 0.08);
  const serviceFee = Math.round(baseTotal * 0.12);
  const grandTotal = baseTotal + cleaningFee + serviceFee;

  const handleReserve = async () => {
    setIsReserving(true);
    try {
      const res = await bookingService.initialiseBooking({
        hotelId: hotel.id,
        roomId: selectedRoomObj.id,
        checkInDate,
        checkOutDate,
        roomsCount: guestCount
      });
      res.hotel = hotel;
      res.roomType = selectedRoomObj.type;
      res.totalPrice = grandTotal;
      setActiveBooking(res);
      navigate('/checkout');
    } catch (err) {
      console.error('Reservation failed', err);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
        
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-gray-900">
                <Star className="h-4 w-4 fill-gray-900 stroke-none" />
                {hotel.rating || '4.96'}
              </span>
              <span>·</span>
              <span className="font-semibold underline cursor-pointer">{hotel.reviewsCount || 120} reviews</span>
              <span>·</span>
              <span className="text-gray-600 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#FF385C]" />
                {hotel.city}, {hotel.state}
              </span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 font-medium">
              <button className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                <Share className="h-4 w-4" />
                <span className="underline text-xs sm:text-sm">Share</span>
              </button>
              <button 
                onClick={() => toggleFavorite(hotel.id)} 
                className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
              >
                <Heart className={`h-4 w-4 ${isFavorite(hotel.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="underline text-xs sm:text-sm">{isFavorite(hotel.id) ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="relative rounded-3xl overflow-hidden mb-10 grid grid-cols-1 md:grid-cols-4 gap-2 bg-gray-100">
          <div className="md:col-span-2 aspect-4/3 md:aspect-square">
            <img 
              src={photos[0]} 
              alt={hotel.name} 
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition"
              onClick={() => setIsGalleryOpen(true)}
            />
          </div>
          <div className="hidden md:grid grid-cols-2 col-span-2 gap-2">
            {photos.slice(1, 5).map((p, i) => (
              <div key={i} className="aspect-square bg-gray-200">
                <img 
                  src={p} 
                  alt={`${hotel.name} ${i + 2}`} 
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition"
                  onClick={() => setIsGalleryOpen(true)}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={() => setIsGalleryOpen(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs hover:bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-xl shadow-md flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Show all photos ({photos.length})
          </button>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Main Information Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Host Details */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hosted by {hotel.hostName || 'Eleni & Nikos'}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {hotel.hostingYears && hotel.hostingYears > 0
                    ? `Superhost · ${hotel.hostingYears} years hosting · Response rate: 100%`
                    : `New Host · Hosting on Airbnb since ${hotel.joinedYear || new Date().getFullYear()}`}
                </p>
              </div>
              <img 
                src={hotel.hostImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                alt="Host" 
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
              />
            </div>

            {/* Highlights */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <Award className="h-6 w-6 text-[#FF385C] mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {hotel.hostingYears && hotel.hostingYears > 0 ? 'Superhost Experience' : 'New Host Listing'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {hotel.hostingYears && hotel.hostingYears > 0 
                      ? 'Superhosts are experienced, highly rated hosts committed to providing great stays.'
                      : 'This property is hosted by a newly registered host on Airbnb.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-[#FF385C] mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Great Check-in Experience</h3>
                  <p className="text-xs text-gray-500">100% of recent guests gave the check-in process a 5-star rating.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About this space</h3>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {hotel.description}
              </p>
            </div>

            {/* Room Availability Picker */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Room Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hotel.rooms?.map((room) => {
                  const roomPricing = adminService.getEffectivePriceForDateRange(
                    room.id,
                    room.basePrice,
                    checkInDate,
                    checkOutDate
                  );
                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setSelectedRoom(room);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        String(selectedRoomId) === String(room.id)
                          ? 'border-gray-900 ring-2 ring-gray-900 bg-rose-50/20'
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900 text-sm">{room.type}</span>
                          <CheckCircle className={`h-5 w-5 ${String(selectedRoomId) === String(room.id) ? 'text-[#FF385C]' : 'text-gray-300'}`} />
                        </div>
                        <p className="text-xs text-gray-500 mb-3">Max Guests: {room.capacity} Person(s)</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {room.amenities?.map((a, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
                        <span className="text-xs text-gray-500">
                          {roomPricing.hasSurge ? 'Surge Rate' : 'Rate per night'}
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-gray-900 text-base">₹{roomPricing.avgNightlyPrice?.toLocaleString('en-IN')}</span>
                          {roomPricing.hasSurge && (
                            <span className="block text-[10px] text-indigo-600 font-bold">⚡ Surge Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities List */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                {hotel.amenities?.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sticky Calculator & Booking Drawer Card */}
          <div>
            <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl space-y-6">
              
              <div className="flex items-baseline justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{effectiveNightlyRate?.toLocaleString('en-IN')}</span>
                  <span className="text-gray-500 text-xs font-normal"> / night</span>
                  {pricingInfo.hasSurge && (
                    <span className="block text-xs font-bold text-indigo-600 mt-1 flex items-center gap-1">
                      ⚡ Seasonal Surge Rate Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                  <Star className="h-3.5 w-3.5 fill-gray-900 stroke-none" />
                  <span>{hotel.rating || '4.96'}</span>
                  <span className="text-gray-400">({hotel.reviewsCount || 120})</span>
                </div>
              </div>

              {/* Dates & Guest Input Picker Box */}
              <div className="border border-gray-300 rounded-2xl overflow-hidden divide-y divide-gray-300 text-xs">
                <div className="grid grid-cols-2 divide-x divide-gray-300">
                  <div className="p-3 bg-gray-50">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Check-in</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-gray-900 outline-hidden cursor-pointer"
                    />
                  </div>
                  <div className="p-3 bg-gray-50">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Check-out</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-transparent font-semibold text-gray-900 outline-hidden cursor-pointer"
                    />
                  </div>
                </div>
                <div className="p-3 bg-gray-50 flex items-center justify-between">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Guests</label>
                    <span className="font-semibold text-gray-900">{guestCount} Guest(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {pricingInfo.isClosed && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold text-center">
                  ⚠️ Room is closed for selected dates
                </div>
              )}

              {/* Reserve Button */}
              <button
                onClick={handleReserve}
                disabled={isReserving || pricingInfo.isClosed}
                className={`w-full py-3.5 text-white font-bold text-base rounded-2xl shadow-lg transition duration-200 ${
                  pricingInfo.isClosed ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF385C] hover:bg-[#E00B41]'
                }`}
              >
                {isReserving ? 'Processing...' : pricingInfo.isClosed ? 'Unavailable for Dates' : 'Reserve'}
              </button>

              <p className="text-center text-xs text-gray-400">You won't be charged yet</p>

              {/* Price Calculation Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="underline">
                    ₹{effectiveNightlyRate?.toLocaleString('en-IN')} x {nights} nights
                    {pricingInfo.hasSurge && <span className="text-indigo-600 text-xs font-semibold ml-1">(Surge)</span>}
                  </span>
                  <span>₹{baseTotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>₹{cleaningFee?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Airbnb service fee</span>
                  <span>₹{serviceFee?.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total before taxes</span>
                  <span>₹{grandTotal?.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 sm:p-8 overflow-y-auto">
          <button 
            onClick={() => setIsGalleryOpen(false)}
            className="fixed top-6 right-6 text-white p-2 rounded-full hover:bg-white/20 transition z-50"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-4xl mx-auto space-y-6 pt-12">
            <h2 className="text-white text-xl font-bold">{hotel.name} - Photo Gallery</h2>
            {photos.map((p, i) => (
              <img key={i} src={p} alt={`Gallery ${i}`} className="w-full rounded-2xl shadow-xl" />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
