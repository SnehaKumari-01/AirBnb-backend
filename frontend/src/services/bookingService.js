import api from './api';
import { MOCK_BOOKINGS, MOCK_HOTELS } from '../mock/mockData';
import { adminService } from './adminService';

export const bookingService = {
  async initialiseBooking(bookingRequest) {
    try {
      const response = await api.post('/bookings/init', bookingRequest);
      return response.data;
    } catch (error) {
      console.warn('Backend booking init failed or offline. Generating local booking.', error);
      const allHotels = adminService.getStoredHotels();
      const hotel = allHotels.find(h => String(h.id) === String(bookingRequest.hotelId)) || MOCK_HOTELS[0];
      const room = hotel.rooms?.find(r => String(r.id) === String(bookingRequest.roomId)) || hotel.rooms?.[0];
      return {
        id: Math.floor(1000 + Math.random() * 9000),
        hotel,
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomId: room?.id || 101,
        roomType: room?.type || 'Deluxe Suite',
        checkInDate: bookingRequest.checkInDate || '2026-09-15',
        checkOutDate: bookingRequest.checkOutDate || '2026-09-20',
        guestsCount: bookingRequest.roomsCount || 2,
        totalPrice: bookingRequest.totalPrice || (room?.basePrice || hotel.price || 2500) * 5,
        bookingStatus: 'PENDING',
        guests: []
      };
    }
  },

  async addGuests(bookingId, guestList) {
    try {
      const response = await api.post(`/bookings/${bookingId}/addGuests`, guestList);
      return response.data;
    } catch (error) {
      console.warn(`Backend addGuests failed for booking ${bookingId}. Updating mock booking.`, error);
      return {
        id: bookingId,
        guests: guestList,
        bookingStatus: 'GUESTS_ADDED'
      };
    }
  },

  async initiatePayment(bookingId) {
    try {
      const response = await api.post(`/bookings/${bookingId}/payments`);
      return response.data; // { sessionUrl: "..." }
    } catch (error) {
      console.warn(`Backend initiatePayment failed for booking ${bookingId}. Simulating payment URL.`, error);
      return { sessionUrl: `https://checkout.razorpay.com/mock_session_${bookingId}` };
    }
  },

  async cancelBooking(bookingId) {
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      return true;
    } catch (error) {
      console.warn(`Backend cancelBooking failed for ID ${bookingId}. Simulating cancellation.`, error);
      return true;
    }
  },

  async getBookingStatus(bookingId) {
    try {
      const response = await api.post(`/bookings/${bookingId}/status`);
      return response.data;
    } catch (error) {
      console.warn(`Backend getBookingStatus failed for ID ${bookingId}. Returning status.`, error);
      return { status: 'CONFIRMED' };
    }
  }
};
