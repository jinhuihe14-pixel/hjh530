import { create } from 'zustand';
import { floors } from '@/data/floors';
import type { ActivePanel } from '@/types';

interface SceneState {
  currentFloor: string;
  visibleFloors: string[];
  visibleLayers: string[];
  activePanel: ActivePanel;
  isHeatmapVisible: boolean;
  searchQuery: string;
  isSidebarCollapsed: boolean;
  resetViewTrigger: number;
  zoomInTrigger: number;
  zoomOutTrigger: number;

  setCurrentFloor: (id: string) => void;
  toggleFloor: (id: string) => void;
  showAllFloors: () => void;
  showSingleFloor: (id: string) => void;
  toggleLayer: (layer: string) => void;
  setActivePanel: (panel: ActivePanel) => void;
  toggleHeatmap: () => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  resetView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const defaultLayers = ['shops', 'escalators', 'elevators', 'toilets', 'exits', 'roads', 'vehicles', 'platforms', 'annotations'];

export const useSceneStore = create<SceneState>((set, get) => ({
  currentFloor: 'f1',
  visibleFloors: floors.map((f) => f.id),
  visibleLayers: defaultLayers,
  activePanel: 'none',
  isHeatmapVisible: false,
  searchQuery: '',
  isSidebarCollapsed: false,
  resetViewTrigger: 0,
  zoomInTrigger: 0,
  zoomOutTrigger: 0,

  setCurrentFloor: (id) => set({ currentFloor: id }),

  toggleFloor: (id) => {
    const { visibleFloors } = get();
    const exists = visibleFloors.includes(id);
    if (exists) {
      set({ visibleFloors: visibleFloors.filter((f) => f !== id) });
    } else {
      set({ visibleFloors: [...visibleFloors, id] });
    }
  },

  showAllFloors: () => {
    set({ visibleFloors: floors.map((f) => f.id) });
  },

  showSingleFloor: (id) => {
    set({ visibleFloors: [id], currentFloor: id });
  },

  toggleLayer: (layer) => {
    const { visibleLayers } = get();
    const exists = visibleLayers.includes(layer);
    if (exists) {
      set({ visibleLayers: visibleLayers.filter((l) => l !== layer) });
    } else {
      set({ visibleLayers: [...visibleLayers, layer] });
    }
  },

  setActivePanel: (panel) => {
    const { activePanel } = get();
    set({ activePanel: activePanel === panel ? 'none' : panel });
  },

  toggleHeatmap: () => {
    set((state) => ({ isHeatmapVisible: !state.isHeatmapVisible }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleSidebar: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },

  resetView: () => {
    set((state) => ({ resetViewTrigger: state.resetViewTrigger + 1 }));
  },

  zoomIn: () => {
    set((state) => ({ zoomInTrigger: state.zoomInTrigger + 1 }));
  },

  zoomOut: () => {
    set((state) => ({ zoomOutTrigger: state.zoomOutTrigger + 1 }));
  },
}));
