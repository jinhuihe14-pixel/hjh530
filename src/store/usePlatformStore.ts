import { create } from 'zustand';
import { platforms as initialPlatforms, getOvertimePlatforms, getUpcomingReservations } from '@/data/platforms';
import type { Platform, PlatformStatus } from '@/types';

interface PlatformState {
  platforms: Platform[];
  selectedPlatformId: string | null;
  filterStatus: PlatformStatus | null;
  activeTab: 'all' | 'occupied' | 'reserved' | 'overtime';
  showReminders: boolean;
  reminderThreshold: number;

  selectPlatform: (id: string | null) => void;
  setFilterStatus: (status: PlatformStatus | null) => void;
  setActiveTab: (tab: 'all' | 'occupied' | 'reserved' | 'overtime') => void;
  setShowReminders: (show: boolean) => void;
  setReminderThreshold: (minutes: number) => void;
  getFilteredPlatforms: () => Platform[];
  getPlatformById: (id: string) => Platform | undefined;
  getOvertimePlatforms: () => Platform[];
  getUpcomingReservations: () => Platform[];
  updatePlatformStatus: (id: string, status: PlatformStatus) => void;
  updatePlatform: (id: string, updates: Partial<Platform>) => void;
  createReservation: (platformId: string, reservedBy: string, from: string, to: string, notes?: string) => void;
  cancelReservation: (platformId: string) => void;
  occupyPlatform: (platformId: string, vehicleId: string, plateNumber: string) => void;
  releasePlatform: (platformId: string) => void;
  getStatistics: () => { total: number; idle: number; occupied: number; reserved: number; overtime: number; maintenance: number };
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  platforms: initialPlatforms,
  selectedPlatformId: null,
  filterStatus: null,
  activeTab: 'all',
  showReminders: true,
  reminderThreshold: 15,

  selectPlatform: (id) => set({ selectedPlatformId: id }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setShowReminders: (show) => set({ showReminders: show }),

  setReminderThreshold: (minutes) => set({ reminderThreshold: minutes }),

  getFilteredPlatforms: () => {
    const { platforms, activeTab } = get();
    switch (activeTab) {
      case 'occupied':
        return platforms.filter((p) => p.status === 'occupied');
      case 'reserved':
        return platforms.filter((p) => p.status === 'reserved');
      case 'overtime':
        return platforms.filter((p) => p.status === 'overtime');
      default:
        return platforms;
    }
  },

  getPlatformById: (id) => {
    return get().platforms.find((p) => p.id === id);
  },

  getOvertimePlatforms: () => getOvertimePlatforms(),

  getUpcomingReservations: () => getUpcomingReservations(2),

  updatePlatformStatus: (id, status) => {
    set((state) => ({
      platforms: state.platforms.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  },

  updatePlatform: (id, updates) => {
    set((state) => ({
      platforms: state.platforms.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  createReservation: (platformId, reservedBy, from, to, notes) => {
    set((state) => ({
      platforms: state.platforms.map((p) =>
        p.id === platformId
          ? { ...p, status: 'reserved' as PlatformStatus, reservedBy, reservedFrom: from, reservedTo: to, notes }
          : p,
      ),
    }));
  },

  cancelReservation: (platformId) => {
    set((state) => ({
      platforms: state.platforms.map((p) =>
        p.id === platformId
          ? { ...p, status: 'idle' as PlatformStatus, reservedBy: undefined, reservedFrom: undefined, reservedTo: undefined }
          : p,
      ),
    }));
  },

  occupyPlatform: (platformId, vehicleId, plateNumber) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    set((state) => ({
      platforms: state.platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              status: 'occupied' as PlatformStatus,
              currentVehicle: vehicleId,
              currentPlateNumber: plateNumber,
              occupiedSince: now,
              remainingTime: p.maxDuration,
            }
          : p,
      ),
    }));
  },

  releasePlatform: (platformId) => {
    set((state) => ({
      platforms: state.platforms.map((p) =>
        p.id === platformId
          ? {
              ...p,
              status: 'idle' as PlatformStatus,
              currentVehicle: undefined,
              currentPlateNumber: undefined,
              occupiedSince: undefined,
              remainingTime: undefined,
            }
          : p,
      ),
    }));
  },

  getStatistics: () => {
    const { platforms } = get();
    return {
      total: platforms.length,
      idle: platforms.filter((p) => p.status === 'idle').length,
      occupied: platforms.filter((p) => p.status === 'occupied').length,
      reserved: platforms.filter((p) => p.status === 'reserved').length,
      overtime: platforms.filter((p) => p.status === 'overtime').length,
      maintenance: platforms.filter((p) => p.status === 'maintenance').length,
    };
  },
}));
