import { create } from 'zustand';
import { trafficRecords, roadSegments, getTrafficStatsByDate } from '@/data/vehicles';
import type { TrafficRecord, TrafficStats, RoadSegment, VehicleType } from '@/types';

interface TrafficState {
  records: TrafficRecord[];
  roadSegments: RoadSegment[];
  selectedDate: string;
  stats: TrafficStats | null;
  selectedRoadId: string | null;
  isHeatmapVisible: boolean;
  activeTab: 'overview' | 'records' | 'roads';

  setSelectedDate: (date: string) => void;
  loadStats: (date: string) => void;
  selectRoad: (id: string | null) => void;
  setIsHeatmapVisible: (visible: boolean) => void;
  setActiveTab: (tab: 'overview' | 'records' | 'roads') => void;
  getRecordsByDate: (date: string) => TrafficRecord[];
  getCongestedRoads: () => RoadSegment[];
  getPeakHours: () => { hour: number; count: number; type: 'in' | 'out' }[];
  getVehicleTypeDistribution: () => { type: VehicleType; count: number; percentage: number }[];
  getTodayRecords: () => TrafficRecord[];
  getRecordsByGate: (gateId: string) => TrafficRecord[];
}

const today = '2026-06-08';

export const useTrafficStore = create<TrafficState>((set, get) => ({
  records: trafficRecords,
  roadSegments,
  selectedDate: today,
  stats: getTrafficStatsByDate(today),
  selectedRoadId: null,
  isHeatmapVisible: false,
  activeTab: 'overview',

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().loadStats(date);
  },

  loadStats: (date) => {
    const stats = getTrafficStatsByDate(date);
    set({ stats });
  },

  selectRoad: (id) => set({ selectedRoadId: id }),

  setIsHeatmapVisible: (visible) => set({ isHeatmapVisible: visible }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  getRecordsByDate: (date) => {
    return get().records.filter((r) => r.date === date);
  },

  getCongestedRoads: () => {
    return get().roadSegments.filter((r) => r.congestionLevel === 'high');
  },

  getPeakHours: () => {
    const { stats } = get();
    if (!stats) return [];

    const peakHours: { hour: number; count: number; type: 'in' | 'out' }[] = [];

    const maxIn = Math.max(...stats.hourly.map((h) => h.in));
    const maxOut = Math.max(...stats.hourly.map((h) => h.out));

    stats.hourly.forEach((h) => {
      if (h.in === maxIn) {
        peakHours.push({ hour: h.hour, count: h.in, type: 'in' });
      }
      if (h.out === maxOut) {
        peakHours.push({ hour: h.hour, count: h.out, type: 'out' });
      }
    });

    return peakHours;
  },

  getVehicleTypeDistribution: () => {
    const { stats } = get();
    if (!stats) return [];

    const total = Object.values(stats.byType).reduce((sum, count) => sum + count, 0);

    return (Object.entries(stats.byType) as [VehicleType, number][]).map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  },

  getTodayRecords: () => {
    return get().records.filter((r) => r.date === today).slice(0, 50);
  },

  getRecordsByGate: (gateId) => {
    return get().records.filter((r) => r.gateId === gateId);
  },
}));
