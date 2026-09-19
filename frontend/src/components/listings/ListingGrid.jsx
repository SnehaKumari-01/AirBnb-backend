import React from 'react';
import { ListingCard } from './ListingCard';
import { Search } from 'lucide-react';

export const ListingGrid = ({ hotels, loading, onResetFilters }) => {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="animate-pulse flex flex-col gap-3">
            <div className="aspect-square w-full bg-gray-200 rounded-2xl"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-1"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">No match found</h3>
          <p className="text-gray-500 text-sm">
            We couldn't find any hotels or properties matching your search criteria.
          </p>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="mt-2 px-6 py-2.5 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-black transition shadow-sm cursor-pointer"
            >
              Show All Homes
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {hotels.map((hotel) => (
        <ListingCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};
