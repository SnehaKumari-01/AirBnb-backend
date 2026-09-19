import React, { useState, useEffect } from 'react';
import { 
  Building, Plus, DollarSign, Calendar, TrendingUp, 
  Users, CheckCircle, Award, Layers, BarChart3, Edit3, Trash2, 
  SlidersHorizontal, Check, X, ShieldAlert, Sparkles, MapPin, Phone, Mail, Bed
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { MOCK_REPORTS } from '../mock/mockData';

export const HostDashboardPage = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [report, setReport] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    occupancyRate: 0,
    averageRating: 0
  });
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'details' | 'rooms' | 'inventory'
  
  // Modals state
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [isEditHotelOpen, setIsEditHotelOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  
  // Selected Room for Inventory
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomInventory, setRoomInventory] = useState([]);

  // Form States
  const [newHotel, setNewHotel] = useState({
    name: '', city: '', state: '', description: '', price: 2500, category: 'beach',
    contactInfo: { address: '', phone: '', email: user?.email || '' }
  });

  const [editHotelData, setEditHotelData] = useState({
    name: '', city: '', state: '', description: '', price: 2500,
    contactInfo: { address: '', phone: '', email: '' }
  });

  const [newRoom, setNewRoom] = useState({
    type: 'Deluxe Suite', basePrice: 2000, capacity: 2, totalCount: 5, amenities: ['Wi-Fi', 'King Bed', 'AC']
  });

  const [inventoryForm, setInventoryForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    surgeFactor: 1.0,
    closed: false
  });

  useEffect(() => {
    loadDashboard(user?.email);
  }, [user?.email]);

  const loadDashboard = async (hostEmail = user?.email) => {
    try {
      const hotelList = await adminService.getHotelsByHost(hostEmail);
      setHotels(hotelList);

      const overallReport = await adminService.getHostOverallReport(hostEmail);
      setReport(overallReport);

      if (hotelList.length > 0) {
        selectHotelHandler(hotelList[0]);
      } else {
        setSelectedHotel(null);
        setBookings([]);
        setRooms([]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  const selectHotelHandler = async (hotel) => {
    setSelectedHotel(hotel);
    setEditHotelData({
      name: hotel.name || '',
      city: hotel.city || '',
      state: hotel.state || '',
      description: hotel.description || '',
      price: hotel.price || 2500,
      contactInfo: {
        address: hotel.contactInfo?.address || '',
        phone: hotel.contactInfo?.phone || '',
        email: hotel.contactInfo?.email || user?.email || ''
      }
    });

    try {
      const [repData, bookData, roomData] = await Promise.all([
        adminService.getHotelReport(hotel.id),
        adminService.getHotelBookings(hotel.id),
        adminService.getRoomsByHotel(hotel.id)
      ]);
      setReport(repData);
      setBookings(bookData);
      setRooms(roomData || hotel.rooms || []);
    } catch (err) {
      console.error('Failed to load hotel details', err);
    }
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      const created = await adminService.createNewHotel(newHotel, user?.email, user?.name);
      await loadDashboard(user?.email);
      selectHotelHandler(created);
      setIsAddHotelOpen(false);
      setNewHotel({
        name: '', city: '', state: '', description: '', price: 2500, category: 'beach',
        contactInfo: { address: '', phone: '', email: user?.email || '' }
      });
      alert('Hotel property created and registered under your host account!');
    } catch (err) {
      console.error('Failed to create hotel', err);
    }
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;
    try {
      const updated = await adminService.updateHotel(selectedHotel.id, editHotelData);
      setSelectedHotel(prev => ({ ...prev, ...editHotelData }));
      setHotels(prev => prev.map(h => h.id === selectedHotel.id ? { ...h, ...editHotelData } : h));
      setIsEditHotelOpen(false);
      alert('Hotel details updated successfully!');
    } catch (err) {
      console.error('Failed to update hotel', err);
    }
  };

  const handleToggleActivate = async () => {
    if (!selectedHotel) return;
    try {
      await adminService.activateHotel(selectedHotel.id);
      setSelectedHotel(prev => ({ ...prev, active: !prev.active }));
      setHotels(prev => prev.map(h => h.id === selectedHotel.id ? { ...h, active: !h.active } : h));
    } catch (err) {
      console.error('Failed to toggle hotel activation', err);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;
    try {
      const createdRoom = await adminService.createRoom(selectedHotel.id, newRoom);
      setRooms(prev => [...prev, createdRoom]);
      setIsAddRoomOpen(false);
      setNewRoom({ type: 'Deluxe Suite', basePrice: 200, capacity: 2, totalCount: 5, amenities: ['Wi-Fi', 'King Bed'] });
    } catch (err) {
      console.error('Failed to create room', err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!selectedHotel) return;
    if (window.confirm('Are you sure you want to delete this room type?')) {
      await adminService.deleteRoom(selectedHotel.id, roomId);
      setRooms(prev => prev.filter(r => r.id !== roomId));
    }
  };

  const handleOpenInventory = async (room) => {
    setSelectedRoom(room);
    setIsInventoryOpen(true);
    try {
      const invData = await adminService.getRoomInventory(room.id);
      setRoomInventory(invData);
    } catch (err) {
      console.error('Failed to load room inventory', err);
    }
  };

  const handleUpdateInventorySubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;
    try {
      await adminService.updateRoomInventory(selectedRoom.id, {
        startDate: inventoryForm.startDate,
        endDate: inventoryForm.endDate,
        surgeFactor: parseFloat(inventoryForm.surgeFactor),
        closed: inventoryForm.closed
      });
      alert(`Inventory updated for ${selectedRoom.type}!`);
      // Reload inventory
      const invData = await adminService.getRoomInventory(selectedRoom.id);
      setRoomInventory(invData);
    } catch (err) {
      console.error('Failed to update room inventory', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow w-full">
        
        {/* Dashboard Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Host Management Dashboard</h1>
            <p className="text-sm text-gray-500">Manage hotel properties, edit room inventory, update surge pricing, and view reservations.</p>
          </div>
          <button
            onClick={() => setIsAddHotelOpen(true)}
            className="px-5 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition shadow-md flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Add New Hotel Property
          </button>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3.5 bg-rose-100 text-[#FF385C] rounded-2xl">
              <DollarSign className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
              <h3 className="text-2xl font-bold text-gray-900">₹{(report?.totalRevenue || 0).toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3.5 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</span>
              <h3 className="text-2xl font-bold text-gray-900">{report?.totalBookings || 0}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-2xl">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Occupancy Rate</span>
              <h3 className="text-2xl font-bold text-gray-900">{report?.occupancyRate || 0}%</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3.5 bg-amber-100 text-amber-600 rounded-2xl">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Rating</span>
              <h3 className="text-2xl font-bold text-gray-900">{report?.averageRating ? Number(report.averageRating).toFixed(2) : '0.00'} ★</h3>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid Layout */}
        {hotels.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No properties registered under your account yet</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Logged in as <strong>{user?.email || 'Hotel Manager'}</strong>. Currently, you have no hotels registered under your host account.
            </p>
            <button
              onClick={() => setIsAddHotelOpen(true)}
              className="px-6 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Add Your First Hotel Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Managed Properties Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-700" />
                Select Hotel ({hotels.length})
              </h2>

              <div className="space-y-3">
                {hotels.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => selectHotelHandler(h)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-4 ${
                      selectedHotel?.id === h.id
                        ? 'bg-white border-gray-900 ring-2 ring-gray-900 shadow-md'
                        : 'bg-white/70 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={h.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80'}
                      alt={h.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{h.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {h.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{h.city}, {h.state}</p>
                      <span className="text-xs font-bold text-[#FF385C] mt-1 block">₹{h.price?.toLocaleString('en-IN')} / night</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Hotel Workspace Area */}
            <div className="lg:col-span-8 space-y-6">
              
              {selectedHotel ? (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
                
                {/* Hotel Header Info & Tabs Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Selected Property ID: #{selectedHotel.id}</span>
                    <h2 className="text-xl font-bold text-gray-900">{selectedHotel.name}</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-[#FF385C]" />
                      {selectedHotel.contactInfo?.address || `${selectedHotel.city}, ${selectedHotel.state}`}
                    </p>
                  </div>

                  {/* Tab Navigation Pill Buttons */}
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-3 py-2 rounded-xl transition ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Reservations
                    </button>
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`px-3 py-2 rounded-xl transition ${activeTab === 'details' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Hotel Details
                    </button>
                    <button
                      onClick={() => setActiveTab('rooms')}
                      className={`px-3 py-2 rounded-xl transition ${activeTab === 'rooms' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Rooms & Inventory
                    </button>
                  </div>
                </div>

                {/* TAB 1: OVERVIEW / RESERVATIONS */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                      Guest Reservations ({bookings.length})
                    </h3>

                    {bookings.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">No reservations registered for this hotel property yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                              <th className="pb-3">Booking ID</th>
                              <th className="pb-3">Room Type</th>
                              <th className="pb-3">Check-in</th>
                              <th className="pb-3">Check-out</th>
                              <th className="pb-3">Total Amount</th>
                              <th className="pb-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {bookings.map((b) => (
                              <tr key={b.id} className="hover:bg-gray-50">
                                <td className="py-3 font-bold text-gray-900">#BK-{b.id}</td>
                                <td className="py-3 font-medium">{b.roomType || 'Deluxe Suite'}</td>
                                <td className="py-3">{b.checkInDate}</td>
                                <td className="py-3">{b.checkOutDate}</td>
                                <td className="py-3 font-bold text-gray-900">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                                <td className="py-3">
                                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                                    {b.bookingStatus || 'CONFIRMED'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: HOTEL DETAILS & EDIT */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900">Hotel Information</h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleToggleActivate}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${selectedHotel.active !== false ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                        >
                          {selectedHotel.active !== false ? 'Deactivate Listing' : 'Activate Listing'}
                        </button>
                        <button
                          onClick={() => setIsEditHotelOpen(true)}
                          className="px-3.5 py-1.5 bg-gray-900 text-white hover:bg-black font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit Details
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Location</span>
                        <span className="font-bold text-gray-900">{selectedHotel.city}, {selectedHotel.state}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Street Address</span>
                        <span className="font-bold text-gray-900">{selectedHotel.contactInfo?.address || 'Not set'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Contact Phone</span>
                        <span className="font-bold text-gray-900">{selectedHotel.contactInfo?.phone || '+91 98220 12345'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block font-semibold mb-0.5">Contact Email</span>
                        <span className="font-bold text-gray-900">{selectedHotel.contactInfo?.email || 'manager@hotel.in'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-xs font-semibold mb-1">Description</span>
                      <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        {selectedHotel.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 3: ROOMS & INVENTORY */}
                {activeTab === 'rooms' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Hotel Rooms & Rates</h3>
                        <p className="text-xs text-gray-500">Configure room types and edit inventory surge pricing/availability.</p>
                      </div>
                      <button
                        onClick={() => setIsAddRoomOpen(true)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" />
                        Add New Room
                      </button>
                    </div>

                    <div className="space-y-4">
                      {rooms.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-6">No room types defined for this property yet.</p>
                      ) : (
                        rooms.map((room) => (
                          <div key={room.id} className="p-4 border border-gray-200 rounded-2xl bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-indigo-600" />
                                <h4 className="font-bold text-gray-900 text-sm">{room.type}</h4>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                <span>Base Rate: <strong className="text-gray-900">₹{room.basePrice?.toLocaleString('en-IN')}</strong>/night</span>
                                <span>·</span>
                                <span>Capacity: <strong className="text-gray-900">{room.capacity} Person(s)</strong></span>
                                <span>·</span>
                                <span>Total Units: <strong className="text-gray-900">{room.totalCount || 5}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenInventory(room)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                              >
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Edit Inventory & Pricing
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                                title="Delete Room"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-500">
                Please select a hotel from the sidebar to manage.
              </div>
            )}
          </div>
        </div>
      )}

      </main>

      {/* MODAL 1: ADD NEW HOTEL */}
      {isAddHotelOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Add New Hotel Property</h3>
              <button onClick={() => setIsAddHotelOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateHotel} className="space-y-4 text-xs font-medium text-gray-700">
              <div>
                <label className="block mb-1">Hotel Property Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Resort & Spa"
                  value={newHotel.name}
                  onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Goa"
                    value={newHotel.city}
                    onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="Goa"
                    value={newHotel.state}
                    onChange={(e) => setNewHotel({ ...newHotel, state: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your property amenities and surroundings..."
                  value={newHotel.description}
                  onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Base Price per Night (₹)</label>
                  <input
                    type="number"
                    required
                    value={newHotel.price}
                    onChange={(e) => setNewHotel({ ...newHotel, price: parseFloat(e.target.value) || 100 })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={newHotel.category}
                    onChange={(e) => setNewHotel({ ...newHotel, category: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="beach">Beachfront</option>
                    <option value="cabins">Cabins</option>
                    <option value="mansions">Mansions</option>
                    <option value="pools">Amazing Pools</option>
                    <option value="trending">Trending</option>
                    <option value="lake">Lakefront</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition shadow-md mt-2"
              >
                Save & Publish Hotel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT HOTEL DETAILS */}
      {isEditHotelOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Edit Hotel Details</h3>
              <button onClick={() => setIsEditHotelOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleUpdateHotel} className="space-y-4 text-xs font-medium text-gray-700">
              <div>
                <label className="block mb-1">Hotel Property Name</label>
                <input
                  type="text"
                  required
                  value={editHotelData.name}
                  onChange={(e) => setEditHotelData({ ...editHotelData, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editHotelData.city}
                    onChange={(e) => setEditHotelData({ ...editHotelData, city: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    value={editHotelData.state}
                    onChange={(e) => setEditHotelData({ ...editHotelData, state: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Street Address</label>
                <input
                  type="text"
                  value={editHotelData.contactInfo.address}
                  onChange={(e) => setEditHotelData({ ...editHotelData, contactInfo: { ...editHotelData.contactInfo, address: e.target.value } })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editHotelData.contactInfo.phone}
                    onChange={(e) => setEditHotelData({ ...editHotelData, contactInfo: { ...editHotelData.contactInfo, phone: e.target.value } })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={editHotelData.contactInfo.email}
                    onChange={(e) => setEditHotelData({ ...editHotelData, contactInfo: { ...editHotelData.contactInfo, email: e.target.value } })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editHotelData.description}
                  onChange={(e) => setEditHotelData({ ...editHotelData, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition shadow-md mt-2"
              >
                Update Hotel Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW ROOM */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Add Room Type</h3>
              <button onClick={() => setIsAddRoomOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs font-medium text-gray-700">
              <div>
                <label className="block mb-1">Room Type Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Sea View Suite"
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newRoom.basePrice}
                    onChange={(e) => setNewRoom({ ...newRoom, basePrice: parseFloat(e.target.value) || 100 })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 2 })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1">Total Units</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newRoom.totalCount}
                    onChange={(e) => setNewRoom({ ...newRoom, totalCount: parseInt(e.target.value) || 5 })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md mt-2"
              >
                Create Room Type
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: INVENTORY & SURGE PRICING MANAGEMENT */}
      {isInventoryOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Manage Room Inventory & Surge Pricing</h3>
                <p className="text-xs text-gray-500">Room: <strong>{selectedRoom.type}</strong> (Base: ₹{selectedRoom.basePrice?.toLocaleString('en-IN')}/night)</p>
              </div>
              <button onClick={() => setIsInventoryOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Inventory Update Form matching UpdateInventoryRequestDto */}
            <form onSubmit={handleUpdateInventorySubmit} className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Batch Update Inventory Rules</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-gray-700">
                <div>
                  <label className="block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={inventoryForm.startDate}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, startDate: e.target.value })}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={inventoryForm.endDate}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, endDate: e.target.value })}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-gray-700">
                <div>
                  <label className="block mb-1">Surge Factor Multiplier (e.g. 1.2 = +20%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="5.0"
                    required
                    value={inventoryForm.surgeFactor}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, surgeFactor: e.target.value })}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inventoryForm.closed}
                      onChange={(e) => setInventoryForm({ ...inventoryForm, closed: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-bold text-rose-700 text-xs">Close Inventory for Date Range</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                Apply Inventory & Surge Changes
              </button>
            </form>

            {/* Inventory Calendar Schedule Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">7-Day Inventory Status View</h4>
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase">
                      <th className="p-3">Date</th>
                      <th className="p-3">Total Units</th>
                      <th className="p-3">Booked</th>
                      <th className="p-3">Surge Factor</th>
                      <th className="p-3">Final Rate</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {roomInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 font-semibold text-gray-900">{item.date}</td>
                        <td className="p-3 font-medium">{item.totalCount}</td>
                        <td className="p-3">{item.bookedCount}</td>
                        <td className="p-3 font-bold text-indigo-600">{item.surgeFactor}x</td>
                        <td className="p-3 font-bold text-gray-900">₹{item.price?.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${item.closed ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                            {item.closed ? 'CLOSED' : 'OPEN'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
