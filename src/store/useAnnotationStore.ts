import { create } from 'zustand';
import { annotations as initialAnnotations } from '@/data/annotations';
import type { Annotation, AnnotationCategory, AnnotationStatus, AnnotationPriority } from '@/types';

interface AnnotationState {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  filterCategory: AnnotationCategory | null;
  filterStatus: AnnotationStatus | null;
  filterPriority: AnnotationPriority | null;
  searchQuery: string;
  dateRange: { start: string; end: string } | null;
  isAddAnnotationMode: boolean;
  isAnnotationDetailOpen: boolean;

  selectAnnotation: (id: string | null) => void;
  setFilterCategory: (category: AnnotationCategory | null) => void;
  setFilterStatus: (status: AnnotationStatus | null) => void;
  setFilterPriority: (priority: AnnotationPriority | null) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: { start: string; end: string } | null) => void;
  setIsAddAnnotationMode: (mode: boolean) => void;
  setIsAnnotationDetailOpen: (open: boolean) => void;

  getFilteredAnnotations: () => Annotation[];
  getAnnotationById: (id: string) => Annotation | undefined;
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;

  updateStatus: (id: string, status: AnnotationStatus) => void;
  assignAnnotation: (id: string, assignee: string) => void;
  resolveAnnotation: (id: string) => void;

  getStatistics: () => {
    total: number;
    open: number;
    processing: number;
    resolved: number;
    byCategory: Record<AnnotationCategory, number>;
    byPriority: Record<AnnotationPriority, number>;
  };

  getAnnotationsByDate: (date: string) => Annotation[];
  searchAnnotations: (query: string) => Annotation[];
}

export const useAnnotationStore = create<AnnotationState>((set, get) => ({
  annotations: initialAnnotations,
  selectedAnnotationId: null,
  filterCategory: null,
  filterStatus: null,
  filterPriority: null,
  searchQuery: '',
  dateRange: null,
  isAddAnnotationMode: false,
  isAnnotationDetailOpen: false,

  selectAnnotation: (id) => set({ selectedAnnotationId: id, isAnnotationDetailOpen: !!id }),

  setFilterCategory: (category) => set({ filterCategory: category }),

  setFilterStatus: (status) => set({ filterStatus: status }),

  setFilterPriority: (priority) => set({ filterPriority: priority }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setDateRange: (range) => set({ dateRange: range }),

  setIsAddAnnotationMode: (mode) => set({ isAddAnnotationMode: mode }),

  setIsAnnotationDetailOpen: (open) => set({ isAnnotationDetailOpen: open }),

  getFilteredAnnotations: () => {
    const { annotations, filterCategory, filterStatus, filterPriority, searchQuery, dateRange } = get();
    let result = annotations;

    if (filterCategory) {
      result = result.filter((a) => a.category === filterCategory);
    }
    if (filterStatus) {
      result = result.filter((a) => a.status === filterStatus);
    }
    if (filterPriority) {
      result = result.filter((a) => a.priority === filterPriority);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.reporter.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (dateRange) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end + ' 23:59:59');
      result = result.filter((a) => {
        const created = new Date(a.createdAt);
        return created >= start && created <= end;
      });
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getAnnotationById: (id) => {
    return get().annotations.find((a) => a.id === id);
  },

  addAnnotation: (annotation) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newAnnotation: Annotation = {
      ...annotation,
      id: `a${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ annotations: [newAnnotation, ...state.annotations] }));
  },

  updateAnnotation: (id, updates) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: now } : a,
      ),
    }));
  },

  deleteAnnotation: (id) => {
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
      selectedAnnotationId: state.selectedAnnotationId === id ? null : state.selectedAnnotationId,
    }));
  },

  updateStatus: (id, status) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const updates: Partial<Annotation> = { status, updatedAt: now };
    if (status === 'resolved') {
      updates.resolvedAt = now;
    }
    set((state) => ({
      annotations: state.annotations.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  },

  assignAnnotation: (id, assignee) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id ? { ...a, assignee, updatedAt: now, status: 'processing' } : a,
      ),
    }));
  },

  resolveAnnotation: (id) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    set((state) => ({
      annotations: state.annotations.map((a) =>
        a.id === id ? { ...a, status: 'resolved', resolvedAt: now, updatedAt: now } : a,
      ),
    }));
  },

  getStatistics: () => {
    const { annotations } = get();
    const byCategory: Record<AnnotationCategory, number> = {
      illegal_parking: 0,
      road_damage: 0,
      obstacle: 0,
      garbage: 0,
      facility_damage: 0,
      other: 0,
    };
    const byPriority: Record<AnnotationPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    annotations.forEach((a) => {
      byCategory[a.category]++;
      byPriority[a.priority]++;
    });

    return {
      total: annotations.length,
      open: annotations.filter((a) => a.status === 'open').length,
      processing: annotations.filter((a) => a.status === 'processing').length,
      resolved: annotations.filter((a) => a.status === 'resolved').length,
      byCategory,
      byPriority,
    };
  },

  getAnnotationsByDate: (date) => {
    return get().annotations.filter((a) => a.createdAt.startsWith(date));
  },

  searchAnnotations: (query) => {
    const q = query.toLowerCase();
    return get().annotations.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.reporter.toLowerCase().includes(q),
    );
  },
}));
