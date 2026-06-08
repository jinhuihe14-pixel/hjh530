export interface Floor {
  id: string;
  name: string;
  level: number;
  height: number;
  baseY: number;
  visible: boolean;
  color: string;
  dimensions: { width: number; depth: number };
}

export interface Shop {
  id: string;
  name: string;
  brand: string;
  floorId: string;
  category: ShopCategory;
  subCategory: string;
  status: ShopStatus;
  leaseEndDate?: string;
  area: number;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; depth: number; height: number };
  color: string;
  description?: string;
  phone?: string;
  openingHours?: string;
}

export type ShopCategory =
  | 'fashion'
  | 'food'
  | 'entertainment'
  | 'lifestyle'
  | 'electronics'
  | 'sports'
  | 'beauty'
  | 'home'
  | 'education'
  | 'services';

export type ShopStatus = 'operating' | 'vacant' | 'renovating';

export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  floorId: string;
  position: { x: number; y: number; z: number };
  status: FacilityStatus;
  lastInspection?: string;
  linkedFloor?: string;
  description?: string;
}

export type FacilityType =
  | 'escalator'
  | 'elevator'
  | 'toilet'
  | 'fire'
  | 'camera'
  | 'exit'
  | 'electric'
  | 'atm'
  | 'information';

export type FacilityStatus = 'normal' | 'warning' | 'fault';

export interface NavNode {
  id: string;
  floorId: string;
  position: { x: number; y: number; z: number };
  neighbors: string[];
  type: NavNodeType;
  name?: string;
}

export type NavNodeType = 'walkway' | 'escalator' | 'elevator' | 'entrance' | 'shop';

export interface NavRoute {
  nodes: NavNode[];
  totalDistance: number;
  estimatedTime: number;
  floorTransitions: { from: string; to: string; type: string }[];
}

export interface HeatmapPoint {
  x: number;
  z: number;
  intensity: number;
}

export interface HeatmapData {
  floorId: string;
  points: HeatmapPoint[];
  timestamp: string;
}

export interface PatrolRoute {
  id: string;
  name: string;
  facilityIds: string[];
  estimatedTime: number;
  distance: number;
}

export interface PatrolRecord {
  id: string;
  routeId: string;
  startTime: string;
  endTime?: string;
  inspector: string;
  status: 'pending' | 'in-progress' | 'completed';
  checks: PatrolCheck[];
}

export interface PatrolCheck {
  facilityId: string;
  checkedAt: string;
  status: FacilityStatus;
  notes?: string;
}

export type ActivePanel = 'none' | 'nav' | 'shops' | 'heatmap' | 'patrol' | 'layers' | 'search';
