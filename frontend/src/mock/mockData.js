export const MOCK_CATEGORIES = [
  { id: 'rooms', label: 'Rooms', icon: 'Building' },
  { id: 'beach', label: 'Beachfront', icon: 'Umbrella' },
  { id: 'cabins', label: 'Cabins', icon: 'Home' },
  { id: 'mansions', label: 'Mansions', icon: 'Castle' },
  { id: 'pools', label: 'Amazing Pools', icon: 'Waves' },
  { id: 'trending', label: 'Trending', icon: 'Flame' },
  { id: 'lake', label: 'Lakefront', icon: 'Compass' },
  { id: 'tropical', label: 'Tropical', icon: 'Sun' },
  { id: 'countryside', label: 'Countryside', icon: 'Trees' },
  { id: 'tiny', label: 'Eco Cottages', icon: 'Box' },
  { id: 'camping', label: 'Camping', icon: 'Tent' },
];

export const MOCK_HOTELS = [
  // --- KOLKATA ---
  {
    id: 101,
    name: 'The Victoria Heritage Suite',
    city: 'Kolkata',
    state: 'West Bengal',
    description: 'Stunning British colonial heritage penthouse near Victoria Memorial and Park Street, featuring high ceilings, teak wood furnishings, private balcony, and authentic Bengali cuisine.',
    photos: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Park View', 'Teak Interiors', 'Complimentary Breakfast', 'High-Speed Wi-Fi', 'Air Conditioning', '24/7 Security'],
    contactInfo: {
      address: 'Camac Street, Near Park Street, Kolkata',
      phone: '+91 33 2280 4000',
      email: 'stay@victoriaheritage.in'
    },
    active: true,
    price: 4800,
    rating: 4.92,
    reviewsCount: 110,
    category: 'rooms',
    hostEmail: 'subhashish@kolkata.in',
    hostName: 'Subhashish Roy',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    distance: 'Kolkata, West Bengal',
    dates: 'Sep 20 - 25',
    rooms: [
      {
        id: 1011,
        type: 'Colonial Deluxe Room',
        basePrice: 4800,
        photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'],
        capacity: 2,
        amenities: ['King Bed', 'City View', 'Breakfast Included']
      }
    ]
  },
  {
    id: 102,
    name: 'Hooghly Riverfront Residency',
    city: 'Kolkata',
    state: 'West Bengal',
    description: 'Serene luxury riverfront condo offering panoramic views of the Howrah Bridge, private sunset lounge deck, and traditional Kolkata sweets.',
    photos: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Riverfront View', 'Rooftop Lounge', 'Free Parking', 'Chef Service', 'Wi-Fi'],
    contactInfo: {
      address: 'Strand Road, Prinsep Ghat Area, Kolkata',
      phone: '+91 33 2248 1122',
      email: 'hooghly@residency-kolkata.com'
    },
    active: true,
    price: 6200,
    rating: 4.88,
    reviewsCount: 84,
    category: 'rooms',
    hostEmail: 'subhashish@kolkata.in',
    hostName: 'Subhashish Roy',
    hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    distance: 'Kolkata Riverfront',
    dates: 'Oct 1 - 6',
    rooms: [
      {
        id: 1021,
        type: 'River View Executive Suite',
        basePrice: 6200,
        photos: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'],
        capacity: 3,
        amenities: ['Queen Bed', 'Private Balcony', 'River Panorama']
      }
    ]
  },

  // --- MUMBAI ---
  {
    id: 201,
    name: 'Marine Drive Seafront Penthouse',
    city: 'Mumbai',
    state: 'Maharashtra',
    description: 'Iconic Queen’s Necklace sea-facing luxury penthouse on Marine Drive with floor-to-ceiling glass windows, ocean sunset views, and private elevator.',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Ocean View', 'Private Elevator', 'High-Speed Wi-Fi', 'Smart Home Controls', '24/7 Concierge'],
    contactInfo: {
      address: 'Marine Drive, Nariman Point, Mumbai',
      phone: '+91 22 6655 8899',
      email: 'penthouse@marinedrive.in'
    },
    active: true,
    price: 11500,
    rating: 4.97,
    reviewsCount: 192,
    category: 'beach',
    hostEmail: 'siddharth@mumbai.in',
    hostName: 'Siddharth Mehta',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    distance: 'Marine Drive, Mumbai',
    dates: 'Sep 25 - 30',
    rooms: [
      {
        id: 2011,
        type: 'Presidential Sea View Penthouse',
        basePrice: 11500,
        photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        capacity: 4,
        amenities: ['King Bed', 'Jacuzzi', 'Ocean Skyline View']
      }
    ]
  },
  {
    id: 202,
    name: 'Bandra West Art-Deco Villa',
    city: 'Mumbai',
    state: 'Maharashtra',
    description: 'Charming Portuguese-influenced heritage bungalow in hip Bandra West near Bandstand with private garden patio, cozy reading nook, and organic cafe access.',
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Garden', 'Art Gallery', 'Pet Friendly', 'Free Breakfast', 'Wi-Fi'],
    contactInfo: {
      address: 'Pali Hill, Bandra West, Mumbai',
      phone: '+91 22 2640 1234',
      email: 'hello@bandra villa.in'
    },
    active: true,
    price: 9200,
    rating: 4.91,
    reviewsCount: 140,
    category: 'mansions',
    hostEmail: 'siddharth@mumbai.in',
    hostName: 'Siddharth Mehta',
    hostImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    distance: 'Bandra West, Mumbai',
    dates: 'Oct 5 - 10',
    rooms: [
      {
        id: 2021,
        type: 'Garden Bungalow Suite',
        basePrice: 9200,
        photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
        capacity: 2,
        amenities: ['Four-Poster Bed', 'Garden Patio', 'Espresso Machine']
      }
    ]
  },

  // --- HYDERABAD ---
  {
    id: 301,
    name: 'Taj Falaknuma View Nizam Palace',
    city: 'Hyderabad',
    state: 'Telangana',
    description: 'Royal Nizami architecture estate overlooking historic Hyderabad, featuring authentic Hyderabadi Biryani dining, marble courtyards, and grand royal suites.',
    photos: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Palace Courtyard', 'Authentic Nizami Cuisine', 'Swimming Pool', 'Spa & Wellness', 'Valet Parking'],
    contactInfo: {
      address: 'Engine Bowli, Falaknuma, Hyderabad',
      phone: '+91 40 6629 8585',
      email: 'royal@hyderabadpalace.in'
    },
    active: true,
    price: 10500,
    rating: 4.96,
    reviewsCount: 160,
    category: 'mansions',
    hostEmail: 'asad@hyderabad.in',
    hostName: 'Mir Asad Ali Khan',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    distance: 'Falaknuma, Hyderabad',
    dates: 'Sep 22 - 27',
    rooms: [
      {
        id: 3011,
        type: 'Nizam Heritage Suite',
        basePrice: 10500,
        photos: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
        capacity: 3,
        amenities: ['King Bed', 'Royal Chandelier', 'Palace Gardens View']
      }
    ]
  },
  {
    id: 302,
    name: 'Banjara Hills Luxury Residency',
    city: 'Hyderabad',
    state: 'Telangana',
    description: 'Modern luxury penthouse in upscale Banjara Hills with private rooftop infinity pool, skyline views, and smart home automation.',
    photos: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Rooftop Pool', 'City Skyline View', 'Gym', 'Free High-Speed Wi-Fi', 'EV Charger'],
    contactInfo: {
      address: 'Road No. 12, Banjara Hills, Hyderabad',
      phone: '+91 40 2335 9900',
      email: 'stay@banjarapenthouse.in'
    },
    active: true,
    price: 5800,
    rating: 4.89,
    reviewsCount: 95,
    category: 'pools',
    hostEmail: 'asad@hyderabad.in',
    hostName: 'Pooja Reddy',
    hostImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    distance: 'Banjara Hills, Hyderabad',
    dates: 'Oct 8 - 14',
    rooms: [
      {
        id: 3021,
        type: 'Skyline Pool Suite',
        basePrice: 5800,
        photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
        capacity: 2,
        amenities: ['King Bed', 'Private Infinity Pool', 'City View']
      }
    ]
  },

  // --- GOA ---
  {
    id: 401,
    name: 'Villa Sea Breeze Resort',
    city: 'Goa',
    state: 'Goa',
    description: 'Luxury Mediterranean-style beach villa situated right on Baga Beach with private infinity pool, sunset deck, and authentic Goan seafood dining.',
    photos: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Sea View', 'Private Pool', 'Free High-Speed Wi-Fi', 'Air Conditioning', 'Beach Access', 'Free Parking'],
    contactInfo: {
      address: 'Calangute - Baga Rd, Near Tito\'s Lane, North Goa',
      phone: '+91 98220 12345',
      email: 'stay@seabreeze-goa.com'
    },
    active: true,
    price: 8500,
    rating: 4.96,
    reviewsCount: 148,
    category: 'beach',
    hostEmail: 'rohan@goa.in',
    hostName: 'Rohan & Ananya Fernandes',
    hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    distance: 'North Goa Beachfront',
    dates: 'Sep 15 - 20',
    rooms: [
      {
        id: 4011,
        type: 'Ocean Front Suite with Jacuzzi',
        basePrice: 8500,
        photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
        capacity: 2,
        amenities: ['King Bed', 'Jacuzzi Bath', 'Private Balcony', 'Sea View']
      }
    ]
  },
  {
    id: 402,
    name: 'Palolem Palms Beachfront Cottage',
    city: 'Goa',
    state: 'Goa',
    description: 'Charming wooden eco-cottage steps away from white sands of Palolem Beach with hammock deck and fresh seafood bar.',
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Beachfront', 'Hammock Deck', 'Seafood Restaurant', 'Kayaking', 'Wi-Fi'],
    contactInfo: {
      address: 'Palolem Beach, South Goa',
      phone: '+91 98221 99887',
      email: 'palolem@goapalms.in'
    },
    active: true,
    price: 4200,
    rating: 4.86,
    reviewsCount: 104,
    category: 'tropical',
    hostEmail: 'rohan@goa.in',
    hostName: 'Joao D’Silva',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    distance: 'South Goa Beachfront',
    dates: 'Oct 12 - 17',
    rooms: [
      {
        id: 4021,
        type: 'Wooden Beach Hut',
        basePrice: 4200,
        photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
        capacity: 2,
        amenities: ['Double Bed', 'Beach Deck', 'Sea View']
      }
    ]
  },

  // --- JAIPUR & UDAIPUR ---
  {
    id: 501,
    name: 'Pink City Royal Palace Stays',
    city: 'Jaipur',
    state: 'Rajasthan',
    description: 'Heritage Marwar palace located in central Jaipur near Hawa Mahal featuring royal courtyards, marble swimming pool, and authentic Rajasthani Thali.',
    photos: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Courtyard Pool', 'Marble Architecture', 'Traditional Folk Dance', 'Free Wi-Fi', 'Airport Shuttle'],
    contactInfo: {
      address: 'Amer Road, Near Jal Mahal, Jaipur',
      phone: '+91 141 263 5555',
      email: 'namaste@jaipurpalace.in'
    },
    active: true,
    price: 9500,
    rating: 4.91,
    reviewsCount: 185,
    category: 'mansions',
    hostEmail: 'ranvijay@rajasthan.in',
    hostName: 'Ranvijay Singh Rathore',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    distance: 'Jaipur, Rajasthan',
    dates: 'Sep 18 - 24',
    rooms: [
      {
        id: 5011,
        type: 'Heritage Maharani Suite',
        basePrice: 9500,
        photos: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'],
        capacity: 2,
        amenities: ['King Bed', 'Marble Bath', 'Royalty Welcome Drink']
      }
    ]
  },
  {
    id: 601,
    name: 'Taj Lake Palace View Haveli',
    city: 'Udaipur',
    state: 'Rajasthan',
    description: '300-year-old restored Royal Rajasthani Palace overlooking Lake Pichola and the City Palace with traditional Jharokhas and rooftop dining.',
    photos: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Lake Pichola View', 'Rooftop Restaurant', 'Cultural Folk Dance', 'Swimming Pool', 'Spa'],
    contactInfo: {
      address: 'Hanuman Ghat, Lake Pichola, Udaipur',
      phone: '+91 294 242 9900',
      email: 'royal@udaipurhaveli.com'
    },
    active: true,
    price: 12500,
    rating: 4.98,
    reviewsCount: 95,
    category: 'lake',
    hostEmail: 'ranvijay@rajasthan.in',
    hostName: 'Mahipal Singh Mewar',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    distance: 'Udaipur, Rajasthan',
    dates: 'Sep 22 - 28',
    rooms: [
      {
        id: 6011,
        type: 'Royal Jharokha Heritage Suite',
        basePrice: 12500,
        photos: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
        capacity: 4,
        amenities: ['Four Poster Bed', 'Lake View Balcony', 'Ayurvedic Massage']
      }
    ]
  },

  // --- KERALA & MUNNAR ---
  {
    id: 701,
    name: 'Kerala Backwater Floating Villa',
    city: 'Kerala',
    state: 'Kerala',
    description: 'Serene luxury houseboat and backwater eco-resort surrounded by coconut groves, paddy fields, and traditional Keralite Shikara boat rides.',
    photos: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Backwater View', 'Ayurvedic Spa', 'Private Boat Cruise', 'Fresh Karimeen Dining', 'Yoga Deck'],
    contactInfo: {
      address: 'Punnamada Lake Jetty, Alleppey, Kerala',
      phone: '+91 477 223 8888',
      email: 'stay@keralabackwater.in'
    },
    active: true,
    price: 6800,
    rating: 4.93,
    reviewsCount: 165,
    category: 'tropical',
    hostEmail: 'suresh@kerala.in',
    hostName: 'Suresh Kumar',
    hostImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    distance: 'Alleppey, Kerala',
    dates: 'Oct 10 - 15',
    rooms: [
      {
        id: 7011,
        type: 'Premium Backwater Suite',
        basePrice: 6800,
        photos: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'],
        capacity: 2,
        amenities: ['Teak Bedding', 'Private Deck', 'Sunset Cruise Included']
      }
    ]
  },
  {
    id: 801,
    name: 'Munnar Tea Estate Sanctuary',
    city: 'Munnar',
    state: 'Kerala',
    description: 'Colonial British tea bungalow Nestled amid 100 acres of misty tea plantations with private trekking trails and organic tea tasting.',
    photos: [
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Tea Garden View', 'Plantation Walk', 'Fireplace', 'High Tea Included', 'Bird Watching'],
    contactInfo: {
      address: 'Mattupetty Road, Tea Estate Valley, Munnar',
      phone: '+91 4865 230 111',
      email: 'reservations@munnarteaestate.in'
    },
    active: true,
    price: 7200,
    rating: 4.95,
    reviewsCount: 130,
    category: 'countryside',
    hostEmail: 'suresh@kerala.in',
    hostName: 'Deepak & Priyamvada',
    hostImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    distance: 'Munnar, Kerala',
    dates: 'Nov 1 - 6',
    rooms: [
      {
        id: 8011,
        type: 'Colonial Plantation Suite',
        basePrice: 7200,
        photos: ['https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80'],
        capacity: 3,
        amenities: ['King Bed', 'Garden Verandah', 'Estate Breakfast']
      }
    ]
  },

  // --- MANALI ---
  {
    id: 901,
    name: 'The Himalayan Pine Wood Chalet',
    city: 'Manali',
    state: 'Himachal Pradesh',
    description: 'Cozy pine wood cedar chalet featuring panoramic snow-peak Solang Valley views, roaring stone fireplace, private bonfire pit, and apple orchard surroundings.',
    photos: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Mountain View', 'Stone Fireplace', 'Heated Blanket', 'Bonfire Setup', 'Wi-Fi'],
    contactInfo: {
      address: 'Old Manali Village, Near Manu Temple, Manali',
      phone: '+91 98160 44000',
      email: 'info@manalichalet.in'
    },
    active: true,
    price: 5500,
    rating: 4.89,
    reviewsCount: 112,
    category: 'cabins',
    hostEmail: 'vikram@manali.in',
    hostName: 'Vikram Thakur',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    distance: 'Manali, Himachal Pradesh',
    dates: 'Oct 2 - 7',
    rooms: [
      {
        id: 9011,
        type: 'Fireplace Cedar Suite',
        basePrice: 5500,
        photos: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'],
        capacity: 3,
        amenities: ['Fireplace', 'Teak Wood King Bed', 'Balcony', 'Heater']
      }
    ]
  }
];

export const MOCK_BOOKINGS = [
  {
    id: 9001,
    hotel: MOCK_HOTELS[0],
    roomId: 1011,
    roomType: 'Colonial Deluxe Room',
    checkInDate: '2026-09-20',
    checkOutDate: '2026-09-25',
    guestsCount: 2,
    totalPrice: 24000,
    bookingStatus: 'CONFIRMED',
    guests: [
      { name: 'Aarav Sharma', gender: 'MALE', age: 29 },
      { name: 'Priya Sharma', gender: 'FEMALE', age: 28 }
    ],
    createdAt: '2026-08-30'
  }
];

export const MOCK_REPORTS = {
  hotelId: 101,
  totalBookings: 28,
  totalRevenue: 238000,
  averageRating: 4.96,
  occupancyRate: 88.5
};
