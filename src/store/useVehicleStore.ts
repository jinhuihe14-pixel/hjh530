import { create } from 'zustand';
import { vehicles as initialVehicles, gates, searchVehicles as searchVehiclesFromData } from '@/data/vehicles';
import type { Vehicle, VehiclePermitType, VehicleStatus, VehicleType, Gate } from '@/types';

interface VehicleState {
  vehicles: Vehicle[];
  gates: Gate[];
  selectedVehicleId: string | null;
  filterStatus: VehicleStatus | null;
  filterPermitType: VehiclePermitType | null;
  filterType: VehicleType | null;
  searchQuery: string;
  isAddVehicleModalOpen: boolean;
  selectedGateId: string | null;

  selectVehicle: (id: string | null) => void;
  setFilterStatus: (status: VehicleStatus | null) => void;
  setFilterPermitType: (type: VehiclePermitType | null) => void;
  setFilterType: (type: VehicleType | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredVehicles: () => Vehicle[];
  getVehicleById: (id: string) => Vehicle | undefined;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setAddVehicleModalOpen: (open: boolean) => void;
  selectGate: (id: string | null) => void;
  getInsideVehicles: () => Vehicle[];
  getPermanentVehicles: () => Vehicle[];
  getTemporaryVehicles: () => Vehicle[];
  getRestrictedVehicles: () => Vehicle[];
  checkVehiclePermission: (plateNumber: string, gateId: string) => boolean;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: initialVehicles,
  gates,
  selectedVehicleId: null,
  filterStatus: null,
  filterPermitType: null,
  filterType: null,
  searchQuery: '',
  isAddVehicleModalOpen: false,
  selectedGateId: null,

  selectVehicle: (id) => set({ selectedVehicleId: id }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setFilterPermitType: (type) => set({ filterPermitType: type }),

  setFilterType: (type) => set({ filterType: type }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredVehicles: () => {
    const { vehicles, filterStatus, filterPermitType, filterType, searchQuery } = get();
    let result = vehicles;

    if (filterStatus) {
      result = result.filter((v) => v.status === filterStatus);
    }
    if (filterPermitType) {
      result = result.filter((v) => v.permitType === filterPermitType);
    }
    if (filterType) {
      result = result.filter((v) => v.type === filterType);
    }
    if (searchQuery) {
      result = searchVehiclesFromData(searchQuery).filter((v) => result.includes(v));
    }

    return result;
  },

  getVehicleById: (id) => {
    return get().vehicles.find((v) => v.id === id);
  },

  addVehicle: (vehicle) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `v${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    set((state) => ({ vehicles: [...state.vehicles, newVehicle] }));
  },

  updateVehicle: (id, updates) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  },

  deleteVehicle: (id) => {
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
      selectedVehicleId: state.selectedVehicleId === id ? null : state.selectedVehicleId,
    }));
  },

  setAddVehicleModalOpen: (open) => set({ isAddVehicleModalOpen: open }),

  selectGate: (id) => set({ selectedGateId: id }),

  getInsideVehicles: () => get().vehicles.filter((v) => v.status === 'inside'),

  getPermanentVehicles: () => get().vehicles.filter((v) => v.permitType === 'permanent'),

  getTemporaryVehicles: () => get().vehicles.filter((v) => v.permitType === 'temporary' || v.permitType === 'visitor'),

  getRestrictedVehicles: () => get().vehicles.filter((v) => v.status === 'restricted'),

  checkVehiclePermission: (plateNumber, gateId) => {
    const vehicle = get().vehicles.find((v) => v.plateNumber === plateNumber);
    if (!vehicle) return false;
    if (vehicle.status === 'restricted') return false;
    if (vehicle.validTo && new Date(vehicle.validTo) < new Date()) return false;
    return vehicle.permittedGates.includes(gateId);
  },
}));
