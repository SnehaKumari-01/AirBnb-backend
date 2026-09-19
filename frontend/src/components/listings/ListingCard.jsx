import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

export const ListingCard = ({ hotel }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = hotel.photos?.length > 0 
    ? hotel.photos 
    : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'];

  const fav = isFavorite(hotel.id);

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div 
      onClick={() => navigate(`/hotel/${hotel.id}`)}
      className="group cursor-pointer flex flex-col gap-2 relative transition hover:-translate-y-1"
    >
      {/* Photo Carousel Container */}
      <div className="aspect-square w-full rounded-2xl overflow-hidden relative bg-gray-200 shadow-xs">
        <img
          src={photos[currentPhotoIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(hotel.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 active:scale-95 transition z-10"
        >
          <Heart
            className={`h-6 w-6 transition ${
              fav 
                ? 'fill-rose-500 stroke-rose-500' 
                : 'fill-black/30 stroke-white stroke-[2]'
            }`}
          />
        </button>

        {/* Carousel Prev/Next Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="h-4 w-4 text-gray-800" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="h-4 w-4 text-gray-800" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {photos.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition ${
                  idx === currentPhotoIndex ? 'bg-white scale-125' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Card Body */}
      <div className="flex flex-col text-sm pt-1">
        <div className="flex items-center justify-between font-semibold text-gray-900">
          <span className="truncate">{hotel.city}, {hotel.state}</span>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-gray-900 stroke-none" />
            <span>{hotel.rating || '4.95'}</span>
          </div>
        </div>

        <p className="text-gray-500 text-xs truncate">{hotel.distance || '1,200 km away'}</p>
        <p className="text-gray-500 text-xs">{hotel.dates || 'Sep 15 - 20'}</p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-bold text-gray-900 text-base">₹{hotel.price?.toLocaleString('en-IN') || '5,500'}</span>
          <span className="text-gray-600 text-xs">night</span>
        </div>
      </div>
    </div>
  );
};
