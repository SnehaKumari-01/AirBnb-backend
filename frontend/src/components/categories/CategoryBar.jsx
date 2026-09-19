import React from 'react';
import { 
  Umbrella, Home, Castle, Waves, Flame, Building, 
  Compass, Sun, Trees, Box, Tent, SlidersHorizontal, Layers
} from 'lucide-react';
import { MOCK_CATEGORIES } from '../../mock/mockData';

const iconMap = {
  Building, Umbrella, Home, Castle, Waves, Flame,
  Compass, Sun, Trees, Box, Tent
};

export const CategoryBar = ({ activeCategory, onSelectCategory, onOpenFilters }) => {
  return (
    <div className="sticky top-20 z-30 bg-white border-b border-gray-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Horizontal Category Icons List */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2 scroll-smooth">
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex flex-col items-center gap-2 min-w-fit pb-1 text-xs font-semibold cursor-pointer transition border-b-2 ${
              activeCategory === 'all'
                ? 'border-gray-900 text-gray-900 opacity-100'
                : 'border-transparent text-gray-500 hover:text-gray-900 opacity-70 hover:opacity-100'
            }`}
          >
            <Layers className="h-6 w-6 stroke-[1.75]" />
            <span>All Homes</span>
          </button>

          {MOCK_CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Home;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-2 min-w-fit pb-1 text-xs font-semibold cursor-pointer transition border-b-2 ${
                  isActive
                    ? 'border-gray-900 text-gray-900 opacity-100'
                    : 'border-transparent text-gray-500 hover:text-gray-900 opacity-70 hover:opacity-100'
                }`}
              >
                <IconComponent className="h-6 w-6 stroke-[1.75]" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Trigger Button */}
        <button 
          onClick={onOpenFilters}
          className="hidden sm:flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-semibold hover:border-gray-900 transition shadow-xs bg-white min-w-fit cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </button>

      </div>
    </div>
  );
};
