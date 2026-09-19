import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/common/Navbar';
import { CategoryBar } from '../components/categories/CategoryBar';
import { ListingGrid } from '../components/listings/ListingGrid';
import { ListingCard } from '../components/listings/ListingCard';
import { Footer } from '../components/common/Footer';
import { SearchModal } from '../components/search/SearchModal';
import { hotelService } from '../services/hotelService';
import { Sparkles, MapPin } from 'lucide-react';

export const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchParams, setSearchParams] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchHotels = async (params = {}) => {
    setLoading(true);
    try {
      const data = await hotelService.searchHotels(params);
      setHotels(data);
    } catch (err) {
      console.error('Failed to fetch hotels', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels({
      category: activeCategory,
      ...searchParams
    });
  }, [activeCategory, searchParams]);

  const handleSearchSubmit = (params) => {
    setSearchParams(params);
  };

  const handleResetHome = () => {
    setActiveCategory('all');
    setSearchParams({});
    fetchHotels({ category: 'all' });
  };

  const isAllView = activeCategory === 'all' && !searchParams.city;

  // Location Groupings for "All Homes" Homepage Layout
  const kolkataHotels = hotels.filter(h => 
    h.city?.toLowerCase().includes('kolkata') || h.state?.toLowerCase().includes('bengal')
  );
  
  const mumbaiHotels = hotels.filter(h => 
    h.city?.toLowerCase().includes('mumbai') || h.state?.toLowerCase().includes('maharashtra')
  );

  const hyderabadHotels = hotels.filter(h => 
    h.city?.toLowerCase().includes('hyderabad') || h.state?.toLowerCase().includes('telangana')
  );

  const goaHotels = hotels.filter(h => 
    h.city?.toLowerCase().includes('goa') || h.state?.toLowerCase().includes('goa')
  );

  const rajasthanHotels = hotels.filter(h => 
    h.city?.toLowerCase().includes('jaipur') || h.city?.toLowerCase().includes('udaipur') || h.state?.toLowerCase().includes('rajasthan')
  );

  const keralaHotels = hotels.filter(h => 
    h.city?.toLowerCase().includes('kerala') || h.city?.toLowerCase().includes('alleppey') || h.city?.toLowerCase().includes('munnar') || h.state?.toLowerCase().includes('kerala')
  );

  const himachalHotels = hotels.filter(h => 
    h.city?.toLowerCase().includes('manali') || h.state?.toLowerCase().includes('himachal')
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar 
        onOpenSearch={() => setIsSearchOpen(true)} 
        onGoHome={handleResetHome} 
      />
      
      <CategoryBar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchParams({});
        }}
        onOpenFilters={() => setIsSearchOpen(true)}
      />

      <main className="grow">
        {loading ? (
          <ListingGrid loading={true} />
        ) : isAllView ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            
            {/* Kolkata Section */}
            {kolkataHotels.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#FF385C]" />
                      Popular homes in Kolkata
                    </h2>
                    <p className="text-xs text-gray-500">Colonial suites, heritage penthouses & riverfront residencies</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {kolkataHotels.map(hotel => (
                    <ListingCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}

            {/* Mumbai Section */}
            {mumbaiHotels.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#FF385C]" />
                      Popular homes in Mumbai
                    </h2>
                    <p className="text-xs text-gray-500">Marine Drive sea view penthouses & Bandra heritage villas</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {mumbaiHotels.map(hotel => (
                    <ListingCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}

            {/* Hyderabad Section */}
            {hyderabadHotels.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#FF385C]" />
                      Popular homes in Hyderabad
                    </h2>
                    <p className="text-xs text-gray-500">Nizami palace estates & Banjara Hills pool suites</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {hyderabadHotels.map(hotel => (
                    <ListingCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}

            {/* Goa Section */}
            {goaHotels.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#FF385C]" />
                      Popular homes in Goa
                    </h2>
                    <p className="text-xs text-gray-500">Beachfront villas, sunset infinity pools & coastal huts</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {goaHotels.map(hotel => (
                    <ListingCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}

            {/* Rajasthan Section (Jaipur & Udaipur) */}
            {rajasthanHotels.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#FF385C]" />
                      Popular homes in Jaipur & Udaipur
                    </h2>
                    <p className="text-xs text-gray-500">Royal Rajasthan havelis, lake view palaces & marble suites</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {rajasthanHotels.map(hotel => (
                    <ListingCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}

            {/* Kerala & Munnar Section */}
            {keralaHotels.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#FF385C]" />
                      Popular homes in Kerala & Munnar
                    </h2>
                    <p className="text-xs text-gray-500">Backwater floating houseboats & misty tea estate bungalows</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {keralaHotels.map(hotel => (
                    <ListingCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}

            {/* Himachal Section (Manali) */}
            {himachalHotels.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#FF385C]" />
                      Popular homes in Himachal Pradesh
                    </h2>
                    <p className="text-xs text-gray-500">Cedar wood mountain chalets & fireplace retreats</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {himachalHotels.map(hotel => (
                    <ListingCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}

          </div>
        ) : (
          <div>
            {searchParams.city && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Stays in "{searchParams.city}"
                </h2>
                <p className="text-xs text-gray-500 mt-1">Found {hotels.length} property match(es)</p>
              </div>
            )}
            <ListingGrid 
              hotels={hotels} 
              loading={loading} 
              onResetFilters={handleResetHome} 
            />
          </div>
        )}
      </main>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearchSubmit}
      />
    </div>
  );
};
