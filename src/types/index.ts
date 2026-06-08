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

export type ActivePanel =
  | 'none'
  | 'nav'
  | 'shops'
  | 'heatmap'
  | 'patrol'
  | 'layers'
  | 'search'
  | 'vehicles'
  | 'traffic'
  | 'platforms'
  | 'annotations';

export type VehicleType = 'sedan' | 'suv' | 'truck' | 'van' | 'bus' | 'motorcycle';
export type VehicleStatus = 'inside' | 'outside' | 'restricted';
export type VehiclePermitType = 'permanent' | 'temporary' | 'visitor';

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  ownerName: string;
  ownerPhone?: string;
  permitType: VehiclePermitType;
  status: VehicleStatus;
  color?: string;
  brand?: string;
  enterTime?: string;
  exitTime?: string;
  validFrom?: string;
  validTo?: string;
  permittedGates: string[];
  position?: { x: number; z: number };
  notes?: string;
  createdAt: string;
}

export interface Gate {
  id: string;
  name: string;
  type: 'entrance' | 'exit' | 'both';
  position: { x: number; z: number };
  status: 'open' | 'closed' | 'fault';
}

export interface TrafficRecord {
  id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  gateId: string;
  gateName: string;
  direction: 'in' | 'out';
  timestamp: string;
  date: string;
  hour: number;
}

export interface TrafficStats {
  date: string;
  totalIn: number;
  totalOut: number;
  peakHourIn: number;
  peakHourOut: number;
  byType: Record<VehicleType, number>;
  hourly: { hour: number; in: number; out: number }[];
}

export interface RoadSegment {
  id: string;
  name: string;
  startPoint: { x: number; z: number };
  endPoint: { x: number; z: number };
  length: number;
  lanes: number;
  currentSpeed: number;
  congestionLevel: 'low' | 'medium' | 'high';
  vehicleCount: number;
}

export type PlatformStatus = 'idle' | 'occupied' | 'reserved' | 'maintenance' | 'overtime';

export interface Platform {
  id: string;
  name: string;
  type: 'loading' | 'unloading' | 'both';
  position: { x: number; z: number };
  status: PlatformStatus;
  currentVehicle?: string;
  currentPlateNumber?: string;
  reservedBy?: string;
  reservedFrom?: string;
  reservedTo?: string;
  occupiedSince?: string;
  maxDuration: number;
  remainingTime?: number;
  notes?: string;
}

export type AnnotationCategory = 'illegal_parking' | 'road_damage' | 'obstacle' | 'garbage' | 'facility_damage' | 'other';
export type AnnotationStatus = 'open' | 'processing' | 'resolved';
export type AnnotationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Annotation {
  id: string;
  category: AnnotationCategory;
  title: string;
  description: string;
  status: AnnotationStatus;
  priority: AnnotationPriority;
  position: { x: number; z: number };
  floorId?: string;
  reporter: string;
  reporterPhone?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignee?: string;
  images?: string[];
  tags?: string[];
}
