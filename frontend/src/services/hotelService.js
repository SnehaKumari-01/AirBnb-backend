import api from './api';
import { adminService } from './adminService';
import { MOCK_HOTELS } from '../mock/mockData';

export const hotelService = {
  async searchHotels(searchParams = {}) {
    try {
      const response = await api.post('/hotels/search', {
        page: searchParams.page || 0,
        size: searchParams.size || 10,
        city: searchParams.city || '',
        startDate: searchParams.startDate || null,
        endDate: searchParams.endDate || null,
        roomsCount: searchParams.roomsCount || 1,
      });
      return response.data?.content || response.data;
    } catch (error) {
      console.warn('Backend hotel search failed or offline. Using mock hotels dataset.', error);
      let results = await adminService.getAllHotels();
      if (!results || results.length === 0) results = MOCK_HOTELS;

      if (searchParams.city) {
        const query = searchParams.city.toLowerCase().trim();
        results = results.filter(h =>
          h.city.toLowerCase().includes(query) ||
          h.state.toLowerCase().includes(query) ||
          h.name.toLowerCase().includes(query)
        );
      }
      if (searchParams.category && searchParams.category !== 'all') {
        results = results.filter(h => h.category === searchParams.category);
      }
      return results;
    }
  },

  async getHotelInfo(hotelId) {
    try {
      const response = await api.get(`/hotels/${hotelId}/info`);
      return response.data;
    } catch (error) {
      console.warn(`Backend hotel info fetch failed for ID ${hotelId}. Using mock data fallback.`, error);
      return adminService.getHotelById(hotelId);
    }
  }
};
