import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_BOOKINGS } from '../mock/mockData';
import { useAuth } from './AuthContext';
import { saveGlobalBooking, updateGlobalBookingStatusInStore } from '../services/adminService';

const BookingContext = createContext();

const getStoredBookingsForUser = (userEmail) => {
  if (!userEmail) return [];
  try {
    const stored = localStorage.getItem(`user_bookings_${userEmail.toLowerCase()}`);
    if (stored) return JSON.parse(stored);
    
    // For demo/mock accounts (e.g. aarav@example.com), return mock bookings
    if (userEmail.toLowerCase().includes('aarav') || userEmail.toLowerCase().includes('demo')) {
      return MOCK_BOOKINGS;
    }
  } catch (e) {
    console.error('Failed to parse user bookings from localStorage', e);
  }
  return [];
};

const saveBookingsForUser = (userEmail, bookings) => {
  if (!userEmail) return;
  try {
    localStorage.setItem(`user_bookings_${userEmail.toLowerCase()}`, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save user bookings to localStorage', e);
  }
};

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('2026-09-15');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-20');
  const [guestCount, setGuestCount] = useState(2);
  const [userBookings, setUserBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    if (user?.email) {
      const bookings = getStoredBookingsForUser(user.email);
      setUserBookings(bookings);
    } else {
      setUserBookings([]);
    }
  }, [user?.email]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const addBooking = (newBooking) => {
    const bookingWithUser = {
      ...newBooking,
      userEmail: user?.email || newBooking.userEmail || '',
      hotelId: newBooking.hotelId || newBooking.hotel?.id
    };
    setUserBookings(prev => {
      const updated = [bookingWithUser, ...prev];
      if (user?.email) {
        saveBookingsForUser(user.email, updated);
      }
      return updated;
    });
    // Global store for host revenue tracking
    saveGlobalBooking(bookingWithUser);
    setActiveBooking(bookingWithUser);
  };

  const cancelUserBooking = (bookingId) => {
    setUserBookings(prev => {
      const updated = prev.map(b => {
        if (b.id === bookingId) {
          const cancelledObj = {
            ...b,
            bookingStatus: 'CANCELLED',
            refundStatus: 'REFUND_PROCESSING',
            refundAmount: b.totalPrice || 8500,
            refundId: 'RFD_' + Math.floor(100000 + Math.random() * 900000),
            refundEta: '3-5 Business Days',
            refundMethod: 'Original Payment Method (Razorpay/Card)',
            cancelledAt: new Date().toLocaleDateString('en-IN')
          };
          updateGlobalBookingStatusInStore(bookingId, cancelledObj);
          return cancelledObj;
        }
        return b;
      });
      if (user?.email) {
        saveBookingsForUser(user.email, updated);
      }
      return updated;
    });
  };


  return (
    <BookingContext.Provider value={{
      selectedHotel,
      setSelectedHotel,
      selectedRoom,
      setSelectedRoom,
      checkInDate,
      setCheckInDate,
      checkOutDate,
      setCheckOutDate,
      guestCount,
      setGuestCount,
      calculateNights,
      userBookings,
      addBooking,
      activeBooking,
      setActiveBooking,
      cancelUserBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
