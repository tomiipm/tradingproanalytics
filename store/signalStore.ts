import { create } from 'zustand';
import { Signal } from '@/types';
import { fetchSignals } from '@/utils/api';
import { generateMockSignals } from '@/utils/mockData';

interface SignalFilters {
  type?: string;
  strength?: string;
  category?: string;
}

interface SignalState {
  signals: Signal[];
  filteredSignals: Signal[];
  favoriteSignals: string[];
  isLoading: boolean;
  error: string | null;
  activeFilters: SignalFilters;
  fetchSignals: (isSubscribed?: boolean) => Promise<void>;
  toggleFavorite: (id: string) => void;
  filterSignals: () => void;
  setFilter: (filterType: string, value: string) => void;
  clearFilters: () => void;
  getSignalById: (id: string) => Signal | undefined;
}

export const useSignalStore = create<SignalState>((set, get) => ({
  signals: [],
  filteredSignals: [],
  favoriteSignals: [],
  isLoading: false,
  error: null,
  activeFilters: {},
  
  fetchSignals: async (isSubscribed = false) => {
    set({ isLoading: true, error: null });
    
    try {
      // Always attempt to fetch real signals from API
      const signals = await fetchSignals(isSubscribed);
      set({ signals, filteredSignals: signals });
    } catch (error) {
      console.error('Error fetching signals:', error);
      
      // Fall back to mock data only if API request fails
      const mockSignals = generateMockSignals(15);
      set({ 
        signals: mockSignals, 
        filteredSignals: mockSignals,
        error: error instanceof Error ? error.message : 'Failed to fetch signals'
      });
    } finally {
      set({ isLoading: false });
      
      // Apply any active filters
      get().filterSignals();
    }
  },
  
  toggleFavorite: (id: string) => {
    set((state) => {
      const favorites = [...state.favoriteSignals];
      const index = favorites.indexOf(id);
      
      if (index === -1) {
        favorites.push(id);
      } else {
        favorites.splice(index, 1);
      }
      
      return { favoriteSignals: favorites };
    });
  },
  
  filterSignals: () => {
    const { signals, activeFilters } = get();
    
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      set({ filteredSignals: signals });
      return;
    }
    
    const filtered = signals.filter(signal => {
      let match = true;
      
      if (activeFilters.type && signal.type !== activeFilters.type) {
        match = false;
      }
      
      if (activeFilters.strength && signal.strength !== activeFilters.strength) {
        match = false;
      }
      
      if (activeFilters.category) {
        if (activeFilters.category === 'CRYPTO') {
          // Check if the pair contains crypto identifiers
          if (!signal.isCrypto) {
            match = false;
          }
        } else if (activeFilters.category === 'FOREX') {
          // Check if the pair is a forex pair (not crypto, not indices)
          if (signal.isCrypto || signal.isIndex || signal.isCommodity) {
            match = false;
          }
        } else if (activeFilters.category === 'INDICES') {
          if (!signal.isIndex) {
            match = false;
          }
        } else if (activeFilters.category === 'COMMODITIES') {
          if (!signal.isCommodity) {
            match = false;
          }
        }
      }
      
      return match;
    });
    
    set({ filteredSignals: filtered });
  },
  
  setFilter: (filterType: string, value: string) => {
    set((state) => {
      const newFilters = { ...state.activeFilters };
      
      if (value === '') {
        delete newFilters[filterType as keyof SignalFilters];
      } else {
        newFilters[filterType as keyof SignalFilters] = value;
      }
      
      return { activeFilters: newFilters };
    });
    
    get().filterSignals();
  },
  
  clearFilters: () => {
    set({ activeFilters: {} });
    get().filterSignals();
  },
  
  getSignalById: (id: string) => {
    return get().signals.find(signal => signal.id === id);
  }
}));