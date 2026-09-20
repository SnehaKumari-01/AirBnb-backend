import api from './api';
import { MOCK_HOTELS, MOCK_BOOKINGS, MOCK_REPORTS } from '../mock/mockData';

export const getGlobalBookings = () => {
  try {
    const stored = localStorage.getItem('all_airbnb_bookings');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
};

export const saveGlobalBooking = (booking) => {
  try {
    const existing = getGlobalBookings();
    const updated = [booking, ...existing.filter(b => String(b.id) !== String(booking.id))];
    localStorage.setItem('all_airbnb_bookings', JSON.stringify(updated));
  } catch (e) {}
};

export const updateGlobalBookingStatusInStore = (bookingId, statusUpdates) => {
  try {
    const existing = getGlobalBookings();
    const updated = existing.map(b => String(b.id) === String(bookingId) ? { ...b, ...statusUpdates } : b);
    localStorage.setItem('all_airbnb_bookings', JSON.stringify(updated));
  } catch (e) {}
};

export const adminService = {
  getStoredHotels() {
    try {
      const stored = localStorage.getItem('airbnb_hotels_data');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return MOCK_HOTELS;
  },

  saveStoredHotels(hotels) {
    try {
      localStorage.setItem('airbnb_hotels_data', JSON.stringify(hotels));
    } catch (e) {}
  },

  async getAllHotels() {
    try {
      const response = await api.get('/admin/hotels');
      return response.data;
    } catch (error) {
      console.warn('Backend admin getAllHotels failed. Using stored/mock hotels list.', error);
      return this.getStoredHotels();
    }
  },

  async getHotelsByHost(hostEmail) {
    try {
      const response = await api.get('/admin/hotels');
      const data = response.data;
      if (Array.isArray(data)) {
        return data.filter(h => h.hostEmail && h.hostEmail.toLowerCase() === hostEmail?.toLowerCase());
      }
      return data;
    } catch (error) {
      console.warn(`Backend admin getHotelsByHost failed. Filtering stored hotels for ${hostEmail}.`, error);
      const hotels = this.getStoredHotels();
      if (!hostEmail) return [];
      return hotels.filter(h => h.hostEmail && h.hostEmail.toLowerCase() === hostEmail.toLowerCase());
    }
  },

  async getHotelById(hotelId) {
    try {
      const response = await api.get(`/admin/hotels/${hotelId}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend admin getHotelById failed for ID ${hotelId}. Using local data.`, error);
      const hotels = this.getStoredHotels();
      return hotels.find(h => String(h.id) === String(hotelId)) || hotels[0];
    }
  },

  async createNewHotel(hotelDto, hostEmail = '', hostName = '') {
    try {
      const response = await api.post('/admin/hotels', { ...hotelDto, hostEmail, hostName });
      return response.data;
    } catch (error) {
      console.warn('Backend admin createNewHotel failed. Creating mock hotel.', error);
      const newHotel = {
        id: Date.now(),
        ...hotelDto,
        hostEmail: hostEmail || 'manager@hotel.in',
        hostName: hostName || hotelDto.hostName || 'Hotel Owner',
        active: true,
        rating: 5.0,
        reviewsCount: 1,
        hostingYears: 0,
        joinedYear: new Date().getFullYear(),
        photos: hotelDto.photos?.length ? hotelDto.photos : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
        rooms: [
          {
            id: Date.now() + 1,
            type: 'Deluxe Suite',
            basePrice: hotelDto.price || 2500,
            capacity: 2,
            amenities: ['Wi-Fi', 'Air Conditioning', 'King Bed']
          }
        ]
      };
      const hotels = this.getStoredHotels();
      hotels.unshift(newHotel);
      this.saveStoredHotels(hotels);
      return newHotel;
    }
  },

  async updateHotel(hotelId, hotelDto) {
    try {
      const response = await api.put(`/admin/hotels/${hotelId}`, hotelDto);
      return response.data;
    } catch (error) {
      console.warn(`Backend admin updateHotel failed for ID ${hotelId}. Simulating update.`, error);
      const hotels = this.getStoredHotels();
      const index = hotels.findIndex(h => String(h.id) === String(hotelId));
      if (index !== -1) {
        hotels[index] = { ...hotels[index], ...hotelDto };
        this.saveStoredHotels(hotels);
      }
      return { id: hotelId, ...hotelDto };
    }
  },

  async deleteHotel(hotelId) {
    try {
      await api.delete(`/admin/hotels/${hotelId}`);
      return true;
    } catch (error) {
      console.warn(`Backend admin deleteHotel failed for ID ${hotelId}. Simulating delete.`, error);
      const hotels = this.getStoredHotels().filter(h => String(h.id) !== String(hotelId));
      this.saveStoredHotels(hotels);
      return true;
    }
  },

  async activateHotel(hotelId) {
    try {
      await api.patch(`/admin/hotels/${hotelId}/activate`);
      return true;
    } catch (error) {
      console.warn(`Backend admin activateHotel failed for ID ${hotelId}. Simulating activation.`, error);
      const hotels = this.getStoredHotels();
      const found = hotels.find(h => String(h.id) === String(hotelId));
      if (found) {
        found.active = !found.active;
        this.saveStoredHotels(hotels);
      }
      return true;
    }
  },

  // --- Rooms Management ---
  async getRoomsByHotel(hotelId) {
    try {
      const response = await api.get(`/admin/hotels/${hotelId}/rooms`);
      return response.data;
    } catch (error) {
      console.warn(`Backend admin getRoomsByHotel failed for ID ${hotelId}. Returning mock rooms.`, error);
      const hotels = this.getStoredHotels();
      const found = hotels.find(h => String(h.id) === String(hotelId));
      return found?.rooms || [];
    }
  },

  async createRoom(hotelId, roomDto) {
    try {
      const response = await api.post(`/admin/hotels/${hotelId}/rooms`, roomDto);
      return response.data;
    } catch (error) {
      console.warn(`Backend admin createRoom failed for hotel ${hotelId}. Simulating room creation.`, error);
      const newRoom = {
        id: Date.now(),
        ...roomDto,
        photos: roomDto.photos?.length ? roomDto.photos : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
      };
      const hotels = this.getStoredHotels();
      const found = hotels.find(h => String(h.id) === String(hotelId));
      if (found) {
        found.rooms = found.rooms || [];
        found.rooms.push(newRoom);
        this.saveStoredHotels(hotels);
      }
      return newRoom;
    }
  },

  async updateRoom(hotelId, roomId, roomDto) {
    try {
      const response = await api.put(`/admin/hotels/${hotelId}/rooms/${roomId}`, roomDto);
      return response.data;
    } catch (error) {
      console.warn(`Backend admin updateRoom failed for room ${roomId}. Simulating room update.`, error);
      const hotels = this.getStoredHotels();
      const foundHotel = hotels.find(h => String(h.id) === String(hotelId));
      if (foundHotel && foundHotel.rooms) {
        const rIndex = foundHotel.rooms.findIndex(r => String(r.id) === String(roomId));
        if (rIndex !== -1) {
          foundHotel.rooms[rIndex] = { ...foundHotel.rooms[rIndex], ...roomDto };
          this.saveStoredHotels(hotels);
        }
      }
      return { id: roomId, ...roomDto };
    }
  },

  async deleteRoom(hotelId, roomId) {
    try {
      await api.delete(`/admin/hotels/${hotelId}/rooms/${roomId}`);
      return true;
    } catch (error) {
      console.warn(`Backend admin deleteRoom failed for room ${roomId}. Simulating room delete.`, error);
      const hotels = this.getStoredHotels();
      const foundHotel = hotels.find(h => String(h.id) === String(hotelId));
      if (foundHotel && foundHotel.rooms) {
        foundHotel.rooms = foundHotel.rooms.filter(r => String(r.id) !== String(roomId));
        this.saveStoredHotels(hotels);
      }
      return true;
    }
  },

  // --- Inventory Management ---
  getInventoryRules(roomId) {
    try {
      const stored = localStorage.getItem(`room_inventory_rules_${roomId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  async getRoomInventory(roomId) {
    try {
      const response = await api.get(`/admin/inventory/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend admin getRoomInventory failed for room ${roomId}. Returning mock inventory data.`, error);
      const rules = this.getInventoryRules(roomId);

      // Find room base price
      let basePrice = 250;
      const hotels = this.getStoredHotels();
      for (const h of hotels) {
        const r = h.rooms?.find(rm => String(rm.id) === String(roomId));
        if (r) {
          basePrice = r.basePrice || h.price || 250;
          break;
        }
      }

      // Generate 7-day inventory starting today
      const mockInventory = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];

        let surgeFactor = 1.0;
        let closed = false;

        const matchedRule = rules.find(rule => dateStr >= rule.startDate && dateStr <= rule.endDate);
        if (matchedRule) {
          surgeFactor = parseFloat(matchedRule.surgeFactor) || 1.0;
          closed = !!matchedRule.closed;
        }

        mockInventory.push({
          id: 1000 + i,
          date: dateStr,
          bookedCount: i % 2 === 0 ? 1 : 0,
          reservedCount: 0,
          totalCount: 5,
          surgeFactor: surgeFactor,
          price: Math.round(basePrice * surgeFactor),
          closed: closed
        });
      }
      return mockInventory;
    }
  },

  async updateRoomInventory(roomId, updateRequest) {
    try {
      await api.patch(`/admin/inventory/rooms/${roomId}`, updateRequest);
      return true;
    } catch (error) {
      console.warn(`Backend admin updateRoomInventory failed for room ${roomId}. Simulating update.`, error);
      const rules = this.getInventoryRules(roomId);
      // Remove any duplicate date range rule and add updated rule
      const newRules = rules.filter(r => !(r.startDate === updateRequest.startDate && r.endDate === updateRequest.endDate));
      newRules.push({
        startDate: updateRequest.startDate,
        endDate: updateRequest.endDate,
        surgeFactor: parseFloat(updateRequest.surgeFactor) || 1.0,
        closed: !!updateRequest.closed
      });
      localStorage.setItem(`room_inventory_rules_${roomId}`, JSON.stringify(newRules));
      return true;
    }
  },

  getEffectivePriceForDateRange(roomId, basePrice, startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) {
      return { totalBasePrice: basePrice, avgNightlyPrice: basePrice, isClosed: false, hasSurge: false, nights: 1 };
    }

    const rules = this.getInventoryRules(roomId);
    let totalBasePrice = 0;
    let nights = 0;
    let isClosed = false;
    let hasSurge = false;

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return { totalBasePrice: basePrice, avgNightlyPrice: basePrice, isClosed: false, hasSurge: false, nights: 1 };
    }

    const curr = new Date(start);
    while (curr < end) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      let surgeFactor = 1.0;
      let dayClosed = false;

      const matchedRule = rules.find(rule => dateStr >= rule.startDate && dateStr <= rule.endDate);
      if (matchedRule) {
        surgeFactor = parseFloat(matchedRule.surgeFactor) || 1.0;
        dayClosed = !!matchedRule.closed;
      }

      if (surgeFactor !== 1.0) {
        hasSurge = true;
      }
      if (dayClosed) {
        isClosed = true;
      }

      totalBasePrice += Math.round(basePrice * surgeFactor);
      nights += 1;

      curr.setDate(curr.getDate() + 1);
    }

    if (nights === 0) nights = 1;

    return {
      totalBasePrice: totalBasePrice > 0 ? totalBasePrice : basePrice,
      avgNightlyPrice: Math.round(totalBasePrice / nights) || basePrice,
      isClosed,
      hasSurge,
      nights
    };
  },

  // --- Bookings & Reports ---
  async getHotelBookings(hotelId) {
    try {
      const response = await api.get(`/admin/hotels/${hotelId}/bookings`);
      return response.data;
    } catch (error) {
      console.warn(`Backend admin getHotelBookings failed for ID ${hotelId}. Using local stored bookings.`, error);
      const globalBookings = getGlobalBookings();
      const hotelBookings = globalBookings.filter(b => {
        const bHotelId = b.hotelId || b.hotel?.id;
        return String(bHotelId) === String(hotelId);
      });

      // Default demo mock fallback ONLY for default demo hotel ID 1/101 if no local bookings exist
      if (hotelBookings.length === 0 && (String(hotelId) === '1' || String(hotelId) === '101')) {
        return MOCK_BOOKINGS;
      }
      return hotelBookings;
    }
  },

  async getHotelReport(hotelId, startDate, endDate) {
    try {
      const response = await api.get(`/admin/hotels/${hotelId}/reports`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.warn(`Backend admin getHotelReport failed for ID ${hotelId}. Calculating dynamic report.`, error);
      const bookings = await this.getHotelBookings(hotelId);
      const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED' || !b.bookingStatus);

      const totalBookings = confirmedBookings.length;
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);
      const occupancyRate = totalBookings > 0 ? Math.min(100, Math.round(totalBookings * 15)) : 0;
      const averageRating = totalBookings > 0 ? 4.9 : 0.0;

      return {
        totalRevenue,
        totalBookings,
        occupancyRate,
        averageRating
      };
    }
  },

  async getHostOverallReport(hostEmail) {
    try {
      const hostHotels = await this.getHotelsByHost(hostEmail);
      if (!hostHotels || hostHotels.length === 0) {
        return {
          totalRevenue: 0,
          totalBookings: 0,
          occupancyRate: 0,
          averageRating: 0
        };
      }

      const globalBookings = getGlobalBookings();
      const hostHotelIds = new Set(hostHotels.map(h => String(h.id)));

      const hostBookings = globalBookings.filter(b => {
        const bHotelId = String(b.hotelId || b.hotel?.id);
        return hostHotelIds.has(bHotelId);
      });

      const confirmedBookings = hostBookings.filter(b => b.bookingStatus === 'CONFIRMED' || !b.bookingStatus);

      let totalBookings = confirmedBookings.length;
      let totalRevenue = confirmedBookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

      // Demo host manager@hotel.in default fallback if no custom bookings made yet
      if (totalBookings === 0 && hostEmail?.toLowerCase() === 'manager@hotel.in') {
        return MOCK_REPORTS;
      }

      const occupancyRate = totalBookings > 0 ? Math.min(95, Math.round(totalBookings * 12 + 10)) : 0;
      const averageRating = totalBookings > 0 ? 4.9 : (hostHotels.length > 0 ? 4.8 : 0.0);

      return {
        totalRevenue,
        totalBookings,
        occupancyRate,
        averageRating
      };
    } catch (err) {
      return {
        totalRevenue: 0,
        totalBookings: 0,
        occupancyRate: 0,
        averageRating: 0
      };
    }
  }
};

