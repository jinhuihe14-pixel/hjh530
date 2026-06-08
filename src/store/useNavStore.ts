import { create } from 'zustand';
import { findPath } from '@/utils/pathfinding';
import type { NavNode, NavRoute } from '@/types';

interface NavState {
  isNavActive: boolean;
  startPoint: NavNode | null;
  endPoint: NavNode | null;
  route: NavRoute | null;
  navProgress: number;
  isAnimating: boolean;

  setStartPoint: (point: NavNode | null) => void;
  setEndPoint: (point: NavNode | null) => void;
  calculateRoute: () => void;
  startNavigation: () => void;
  stopNavigation: () => void;
  setNavProgress: (progress: number) => void;
  swapPoints: () => void;
  clearRoute: () => void;
}

export const useNavStore = create<NavState>((set, get) => ({
  isNavActive: false,
  startPoint: null,
  endPoint: null,
  route: null,
  navProgress: 0,
  isAnimating: false,

  setStartPoint: (point) => {
    set({ startPoint: point });
    const { endPoint } = get();
    if (point && endPoint) {
      get().calculateRoute();
    }
  },

  setEndPoint: (point) => {
    set({ endPoint: point });
    const { startPoint } = get();
    if (startPoint && point) {
      get().calculateRoute();
    }
  },

  calculateRoute: () => {
    const { startPoint, endPoint } = get();
    if (!startPoint || !endPoint) {
      set({ route: null });
      return;
    }
    const route = findPath(startPoint.id, endPoint.id);
    set({ route });
  },

  startNavigation: () => {
    set({ isNavActive: true, isAnimating: true, navProgress: 0 });
  },

  stopNavigation: () => {
    set({ isNavActive: false, isAnimating: false });
  },

  setNavProgress: (progress) => set({ navProgress: progress }),

  swapPoints: () => {
    const { startPoint, endPoint } = get();
    set({ startPoint: endPoint, endPoint: startPoint });
    get().calculateRoute();
  },

  clearRoute: () => {
    set({
      startPoint: null,
      endPoint: null,
      route: null,
      isNavActive: false,
      isAnimating: false,
      navProgress: 0,
    });
  },
}));
