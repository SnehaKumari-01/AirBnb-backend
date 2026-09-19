import React, { useState } from 'react';
import { X, Search, Calendar, Users, MapPin } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const { checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, guestCount, setGuestCount } = useBooking();
  const [city, setCity] = useState('');

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, startDate: checkInDate, endDate: checkOutDate, roomsCount: guestCount });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Search Stays</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-6">
          
          {/* Where Location */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 focus-within:border-gray-900 transition">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#FF385C]" />
              Where
            </label>
            <input
              type="text"
              placeholder="Search destinations in India (e.g. Goa, Manali, Udaipur, Munnar, Jaipur)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent border-none outline-hidden text-gray-900 font-medium placeholder-gray-400 text-sm"
            />
          </div>

          {/* When Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 focus-within:border-gray-900 transition">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#FF385C]" />
                Check in
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden text-gray-900 font-medium text-sm"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 focus-within:border-gray-900 transition">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#FF385C]" />
                Check out
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-transparent border-none outline-hidden text-gray-900 font-medium text-sm"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#FF385C]" />
                Who
              </label>
              <span className="text-sm font-semibold text-gray-900">{guestCount} Guests</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:border-gray-900"
              >
                -
              </button>
              <span className="font-bold text-gray-900 w-4 text-center">{guestCount}</span>
              <button
                type="button"
                onClick={() => setGuestCount(guestCount + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:border-gray-900"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setCity(''); onClose(); }}
              className="px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-semibold rounded-xl transition flex items-center gap-2 shadow-md"
            >
              <Search className="h-4 w-4" />
              Search Stays
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
