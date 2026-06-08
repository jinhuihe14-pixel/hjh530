import { create } from 'zustand';
import { patrolRoutes, patrolRecords } from '@/data/heatmapPatrol';
import { facilities, getFacilityById } from '@/data/facilities';
import type { PatrolRoute, PatrolRecord, Facility, FacilityStatus } from '@/types';

interface PatrolState {
  routes: PatrolRoute[];
  records: PatrolRecord[];
  selectedRouteId: string | null;
  selectedRecordId: string | null;
  isPatrolMode: boolean;
  currentCheckIndex: number;

  setSelectedRoute: (id: string | null) => void;
  setSelectedRecord: (id: string | null) => void;
  togglePatrolMode: () => void;
  getRouteFacilities: (routeId: string) => Facility[];
  getCurrentRecord: () => PatrolRecord | undefined;
  getCurrentRoute: () => PatrolRoute | undefined;
  startPatrol: (routeId: string) => void;
  nextCheck: () => void;
  prevCheck: () => void;
  completeCheck: (facilityId: string, status: FacilityStatus, notes?: string) => void;
}

export const usePatrolStore = create<PatrolState>((set, get) => ({
  routes: patrolRoutes,
  records: patrolRecords,
  selectedRouteId: null,
  selectedRecordId: null,
  isPatrolMode: false,
  currentCheckIndex: 0,

  setSelectedRoute: (id) => set({ selectedRouteId: id }),

  setSelectedRecord: (id) => set({ selectedRecordId: id }),

  togglePatrolMode: () => {
    set((state) => ({ isPatrolMode: !state.isPatrolMode }));
  },

  getRouteFacilities: (routeId) => {
    const route = patrolRoutes.find((r) => r.id === routeId);
    if (!route) return [];
    return route.facilityIds
      .map((id) => getFacilityById(id))
      .filter((f): f is Facility => f !== undefined);
  },

  getCurrentRecord: () => {
    const { selectedRecordId, records } = get();
    return records.find((r) => r.id === selectedRecordId);
  },

  getCurrentRoute: () => {
    const { selectedRouteId, routes } = get();
    return routes.find((r) => r.id === selectedRouteId);
  },

  startPatrol: (routeId) => {
    set({
      selectedRouteId: routeId,
      isPatrolMode: true,
      currentCheckIndex: 0,
    });
  },

  nextCheck: () => {
    const { currentCheckIndex, selectedRouteId, routes } = get();
    const route = routes.find((r) => r.id === selectedRouteId);
    if (!route) return;
    if (currentCheckIndex < route.facilityIds.length - 1) {
      set({ currentCheckIndex: currentCheckIndex + 1 });
    }
  },

  prevCheck: () => {
    const { currentCheckIndex } = get();
    if (currentCheckIndex > 0) {
      set({ currentCheckIndex: currentCheckIndex - 1 });
    }
  },

  completeCheck: (facilityId, status, notes) => {
    console.log('巡检完成:', facilityId, status, notes);
  },
}));
