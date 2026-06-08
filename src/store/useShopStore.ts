import { create } from 'zustand';
import { shops, getShopsByFloor as getShopsByFloorData } from '@/data/shops';
import type { Shop, ShopCategory, ShopStatus } from '@/types';

interface ShopState {
  shops: Shop[];
  selectedShopId: string | null;
  filterCategory: ShopCategory | null;
  filterStatus: ShopStatus | null;
  searchQuery: string;

  selectShop: (id: string | null) => void;
  getShopById: (id: string) => Shop | undefined;
  getShopsByFloor: (floorId: string) => Shop[];
  getFilteredShops: () => Shop[];
  setFilterCategory: (category: ShopCategory | null) => void;
  setFilterStatus: (status: ShopStatus | null) => void;
  setSearchQuery: (query: string) => void;
  getVacantShops: () => Shop[];
  getExpiringSoonShops: (days?: number) => Shop[];
}

export const useShopStore = create<ShopState>((set, get) => ({
  shops,
  selectedShopId: null,
  filterCategory: null,
  filterStatus: null,
  searchQuery: '',

  selectShop: (id) => set({ selectedShopId: id }),

  getShopById: (id) => shops.find((s) => s.id === id),

  getShopsByFloor: (floorId) => getShopsByFloorData(floorId),

  getFilteredShops: () => {
    const { shops, filterCategory, filterStatus, searchQuery } = get();
    return shops.filter((shop) => {
      if (filterCategory && shop.category !== filterCategory) return false;
      if (filterStatus && shop.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !shop.name.toLowerCase().includes(q) &&
          !shop.brand.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  },

  setFilterCategory: (category) => set({ filterCategory: category }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getVacantShops: () => shops.filter((s) => s.status === 'vacant'),

  getExpiringSoonShops: (days = 30) => {
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return shops.filter((shop) => {
      if (!shop.leaseEndDate) return false;
      const endDate = new Date(shop.leaseEndDate);
      return endDate <= threshold && endDate >= now;
    });
  },
}));
