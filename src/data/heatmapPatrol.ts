import type { HeatmapData, PatrolRoute, PatrolRecord } from '@/types';

function generateHeatmapPoints(
  floorId: string,
  centers: { x: number; z: number; intensity: number }[],
  count: number = 50
): HeatmapData {
  const points = [];
  for (const center of centers) {
    for (let i = 0; i < count / centers.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8;
      points.push({
        x: center.x + Math.cos(angle) * radius,
        z: center.z + Math.sin(angle) * radius,
        intensity: center.intensity * (0.5 + Math.random() * 0.5),
      });
    }
  }
  return {
    floorId,
    points,
    timestamp: new Date().toISOString(),
  };
}

export const heatmapData: Record<string, HeatmapData> = {
  f1: generateHeatmapPoints(
    'f1',
    [
      { x: 0, z: 0, intensity: 0.9 },
      { x: -15, z: -20, intensity: 0.8 },
      { x: 15, z: 20, intensity: 0.7 },
      { x: -30, z: -20, intensity: 0.6 },
      { x: 20, z: 0, intensity: 0.5 },
    ],
    80
  ),
  f2: generateHeatmapPoints(
    'f2',
    [
      { x: -15, z: 15, intensity: 0.9 },
      { x: 0, z: 15, intensity: 0.85 },
      { x: 15, z: 15, intensity: 0.8 },
      { x: -10, z: -15, intensity: 0.6 },
      { x: 10, z: -5, intensity: 0.5 },
    ],
    70
  ),
  f3: generateHeatmapPoints(
    'f3',
    [
      { x: -25, z: -20, intensity: 0.85 },
      { x: -15, z: 0, intensity: 0.7 },
      { x: 5, z: -20, intensity: 0.65 },
      { x: 20, z: 15, intensity: 0.5 },
    ],
    60
  ),
  f4: generateHeatmapPoints(
    'f4',
    [
      { x: -10, z: -15, intensity: 0.7 },
      { x: 10, z: -10, intensity: 0.6 },
      { x: -5, z: 5, intensity: 0.5 },
    ],
    40
  ),
  b1: generateHeatmapPoints(
    'b1',
    [
      { x: -10, z: 0, intensity: 0.6 },
      { x: 10, z: 0, intensity: 0.5 },
      { x: 0, z: 20, intensity: 0.4 },
    ],
    30
  ),
};

export const patrolRoutes: PatrolRoute[] = [
  {
    id: 'route-1',
    name: '一层消防巡检路线',
    facilityIds: ['f1-fire-1', 'f1-fire-2', 'f1-fire-3', 'f1-exit-1', 'f1-exit-2'],
    estimatedTime: 15,
    distance: 300,
  },
  {
    id: 'route-2',
    name: '全楼监控巡检路线',
    facilityIds: ['f1-cam-1', 'f1-cam-2', 'f1-cam-3', 'f2-cam-1', 'f2-cam-2', 'f3-cam-1', 'f3-cam-2', 'b1-cam-1', 'b1-cam-2', 'b1-cam-3'],
    estimatedTime: 45,
    distance: 800,
  },
  {
    id: 'route-3',
    name: '电梯扶梯巡检路线',
    facilityIds: ['f1-esc-1', 'f1-esc-2', 'f1-elev-1', 'f1-elev-2', 'f2-esc-1', 'f2-esc-2', 'f2-elev-1', 'f3-esc-1', 'f3-esc-2', 'f3-elev-1', 'f4-esc-1', 'f4-elev-1', 'b1-elev-1'],
    estimatedTime: 60,
    distance: 1000,
  },
  {
    id: 'route-4',
    name: '电气设备巡检路线',
    facilityIds: ['f2-electric-1', 'b1-electric-1'],
    estimatedTime: 20,
    distance: 200,
  },
];

export const patrolRecords: PatrolRecord[] = [
  {
    id: 'record-1',
    routeId: 'route-1',
    startTime: '2025-06-07 08:00:00',
    endTime: '2025-06-07 08:14:30',
    inspector: '张师傅',
    status: 'completed',
    checks: [
      { facilityId: 'f1-fire-1', checkedAt: '2025-06-07 08:02:00', status: 'normal' },
      { facilityId: 'f1-fire-2', checkedAt: '2025-06-07 08:05:00', status: 'normal' },
      { facilityId: 'f1-fire-3', checkedAt: '2025-06-07 08:08:00', status: 'fault', notes: '压力不足，需更换' },
      { facilityId: 'f1-exit-1', checkedAt: '2025-06-07 08:11:00', status: 'normal' },
      { facilityId: 'f1-exit-2', checkedAt: '2025-06-07 08:14:00', status: 'normal' },
    ],
  },
  {
    id: 'record-2',
    routeId: 'route-2',
    startTime: '2025-06-07 09:00:00',
    endTime: undefined,
    inspector: '李师傅',
    status: 'in-progress',
    checks: [
      { facilityId: 'f1-cam-1', checkedAt: '2025-06-07 09:02:00', status: 'normal' },
      { facilityId: 'f1-cam-2', checkedAt: '2025-06-07 09:05:00', status: 'normal' },
      { facilityId: 'f1-cam-3', checkedAt: '2025-06-07 09:08:00', status: 'normal' },
    ],
  },
  {
    id: 'record-3',
    routeId: 'route-3',
    startTime: '2025-06-06 14:00:00',
    endTime: '2025-06-06 15:02:00',
    inspector: '王师傅',
    status: 'completed',
    checks: [
      { facilityId: 'f1-esc-1', checkedAt: '2025-06-06 14:05:00', status: 'normal' },
      { facilityId: 'f1-esc-2', checkedAt: '2025-06-06 14:08:00', status: 'normal' },
      { facilityId: 'f1-elev-1', checkedAt: '2025-06-06 14:12:00', status: 'normal' },
      { facilityId: 'f1-elev-2', checkedAt: '2025-06-06 14:18:00', status: 'warning', notes: '需检修通知' },
    ],
  },
];
