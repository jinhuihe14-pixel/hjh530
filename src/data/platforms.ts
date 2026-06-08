import type { Platform, PlatformStatus } from '@/types';

export const platformStatusNames: Record<PlatformStatus, string> = {
  idle: '空闲',
  occupied: '使用中',
  reserved: '已预约',
  maintenance: '维护中',
  overtime: '超时占用',
};

export const platformStatusColors: Record<PlatformStatus, string> = {
  idle: '#22c55e',
  occupied: '#3b82f6',
  reserved: '#f59e0b',
  maintenance: '#6b7280',
  overtime: '#ef4444',
};

export const platforms: Platform[] = [
  {
    id: 'p1',
    name: '1号装卸月台',
    type: 'loading',
    position: { x: 50, z: 45 },
    status: 'occupied',
    currentVehicle: 'v3',
    currentPlateNumber: '京C·11111',
    occupiedSince: '2026-06-08 09:00:00',
    maxDuration: 120,
    remainingTime: 30,
    notes: '货物卸车中',
  },
  {
    id: 'p2',
    name: '2号装卸月台',
    type: 'unloading',
    position: { x: 55, z: 45 },
    status: 'idle',
    maxDuration: 90,
  },
  {
    id: 'p3',
    name: '3号装卸月台',
    type: 'both',
    position: { x: 60, z: 45 },
    status: 'reserved',
    reservedBy: '物流部-李强',
    reservedFrom: '2026-06-08 14:00:00',
    reservedTo: '2026-06-08 16:00:00',
    maxDuration: 120,
    notes: '原材料配送预约',
  },
  {
    id: 'p4',
    name: '4号装卸月台',
    type: 'loading',
    position: { x: 65, z: 45 },
    status: 'overtime',
    currentVehicle: 'v9',
    currentPlateNumber: '京J·77777',
    occupiedSince: '2026-06-08 10:00:00',
    maxDuration: 60,
    remainingTime: -45,
    notes: '设备配送，已超时45分钟',
  },
  {
    id: 'p5',
    name: '5号装卸月台',
    type: 'unloading',
    position: { x: 70, z: 45 },
    status: 'maintenance',
    maxDuration: 90,
    notes: '地磅校准维护中',
  },
  {
    id: 'p6',
    name: '6号装卸月台',
    type: 'both',
    position: { x: -50, z: 45 },
    status: 'idle',
    maxDuration: 120,
  },
  {
    id: 'p7',
    name: '7号装卸月台',
    type: 'loading',
    position: { x: -55, z: 45 },
    status: 'occupied',
    currentVehicle: 'v11',
    currentPlateNumber: '京L·99999',
    occupiedSince: '2026-06-08 08:30:00',
    maxDuration: 180,
    remainingTime: 90,
    notes: '后勤物资装卸',
  },
  {
    id: 'p8',
    name: '8号装卸月台',
    type: 'unloading',
    position: { x: -60, z: 45 },
    status: 'reserved',
    reservedBy: '仓储部-王芳',
    reservedFrom: '2026-06-08 13:30:00',
    reservedTo: '2026-06-08 15:30:00',
    maxDuration: 120,
    notes: '成品出库预约',
  },
];

export function getPlatformById(id: string): Platform | undefined {
  return platforms.find((p) => p.id === id);
}

export function getPlatformsByStatus(status: PlatformStatus): Platform[] {
  return platforms.filter((p) => p.status === status);
}

export function getOvertimePlatforms(): Platform[] {
  return platforms.filter((p) => p.status === 'overtime');
}

export function getUpcomingReservations(hours: number = 2): Platform[] {
  return platforms.filter((p) => {
    if (p.status !== 'reserved' || !p.reservedFrom) return false;
    const now = new Date('2026-06-08T11:00:00');
    const reserved = new Date(p.reservedFrom);
    const diffMs = reserved.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= hours;
  });
}
