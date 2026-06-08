import type {
  Vehicle,
  VehicleType,
  VehiclePermitType,
  Gate,
  TrafficRecord,
  TrafficStats,
  RoadSegment,
} from '@/types';

export const vehicleTypeNames: Record<VehicleType, string> = {
  sedan: '轿车',
  suv: 'SUV',
  truck: '货车',
  van: '面包车',
  bus: '大巴',
  motorcycle: '摩托车',
};

export const permitTypeNames: Record<VehiclePermitType, string> = {
  permanent: '常驻车辆',
  temporary: '临时车辆',
  visitor: '来访车辆',
};

export const gates: Gate[] = [
  { id: 'g1', name: '东门', type: 'both', position: { x: 80, z: 0 }, status: 'open' },
  { id: 'g2', name: '西门', type: 'both', position: { x: -80, z: 0 }, status: 'open' },
  { id: 'g3', name: '南门', type: 'entrance', position: { x: 0, z: 60 }, status: 'open' },
  { id: 'g4', name: '北门', type: 'exit', position: { x: 0, z: -60 }, status: 'closed' },
  { id: 'g5', name: '物流门', type: 'both', position: { x: 60, z: 50 }, status: 'open' },
];

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    plateNumber: '京A·12345',
    type: 'sedan',
    ownerName: '张伟',
    ownerPhone: '13800138001',
    permitType: 'permanent',
    status: 'inside',
    color: '黑色',
    brand: '奥迪A6',
    enterTime: '2026-06-08 08:15:00',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    permittedGates: ['g1', 'g2', 'g3', 'g4'],
    position: { x: 20, z: -15 },
    createdAt: '2026-01-15 10:00:00',
  },
  {
    id: 'v2',
    plateNumber: '京B·67890',
    type: 'suv',
    ownerName: '李娜',
    ownerPhone: '13900139002',
    permitType: 'permanent',
    status: 'inside',
    color: '白色',
    brand: '特斯拉Model Y',
    enterTime: '2026-06-08 07:45:00',
    validFrom: '2026-03-01',
    validTo: '2027-02-28',
    permittedGates: ['g1', 'g2'],
    position: { x: -25, z: 20 },
    createdAt: '2026-02-20 14:30:00',
  },
  {
    id: 'v3',
    plateNumber: '京C·11111',
    type: 'truck',
    ownerName: '王强',
    ownerPhone: '13700137003',
    permitType: 'temporary',
    status: 'inside',
    color: '蓝色',
    brand: '东风卡车',
    enterTime: '2026-06-08 09:00:00',
    validFrom: '2026-06-08',
    validTo: '2026-06-08',
    permittedGates: ['g5'],
    position: { x: 50, z: 35 },
    notes: '货物运输，单次通行',
    createdAt: '2026-06-08 08:30:00',
  },
  {
    id: 'v4',
    plateNumber: '京D·22222',
    type: 'van',
    ownerName: '赵敏',
    ownerPhone: '13600136004',
    permitType: 'visitor',
    status: 'outside',
    color: '银色',
    brand: '五菱宏光',
    exitTime: '2026-06-08 10:30:00',
    validFrom: '2026-06-08',
    validTo: '2026-06-08',
    permittedGates: ['g1', 'g3'],
    notes: '来访客户，当日有效',
    createdAt: '2026-06-08 09:00:00',
  },
  {
    id: 'v5',
    plateNumber: '京E·33333',
    type: 'sedan',
    ownerName: '陈刚',
    ownerPhone: '13500135005',
    permitType: 'permanent',
    status: 'outside',
    color: '红色',
    brand: '本田雅阁',
    exitTime: '2026-06-07 18:00:00',
    validFrom: '2026-02-01',
    validTo: '2027-01-31',
    permittedGates: ['g1', 'g2', 'g3'],
    createdAt: '2026-01-25 09:15:00',
  },
  {
    id: 'v6',
    plateNumber: '京F·44444',
    type: 'bus',
    ownerName: '刘芳',
    ownerPhone: '13400134006',
    permitType: 'temporary',
    status: 'restricted',
    color: '黄色',
    brand: '宇通客车',
    validFrom: '2026-06-01',
    validTo: '2026-06-07',
    permittedGates: ['g1'],
    notes: '班车服务，已过期',
    createdAt: '2026-05-28 11:00:00',
  },
  {
    id: 'v7',
    plateNumber: '京G·55555',
    type: 'suv',
    ownerName: '周杰',
    ownerPhone: '13300133007',
    permitType: 'permanent',
    status: 'inside',
    color: '灰色',
    brand: '宝马X5',
    enterTime: '2026-06-08 08:30:00',
    validFrom: '2026-04-01',
    validTo: '2027-03-31',
    permittedGates: ['g1', 'g2', 'g3', 'g4'],
    position: { x: 10, z: 30 },
    createdAt: '2026-03-10 16:45:00',
  },
  {
    id: 'v8',
    plateNumber: '京H·66666',
    type: 'motorcycle',
    ownerName: '吴磊',
    ownerPhone: '13200132008',
    permitType: 'permanent',
    status: 'inside',
    color: '黑色',
    brand: '本田CB400',
    enterTime: '2026-06-08 09:15:00',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    permittedGates: ['g1', 'g2'],
    position: { x: -15, z: -25 },
    createdAt: '2026-01-20 10:30:00',
  },
  {
    id: 'v9',
    plateNumber: '京J·77777',
    type: 'truck',
    ownerName: '郑涛',
    ownerPhone: '13100131009',
    permitType: 'visitor',
    status: 'inside',
    color: '绿色',
    brand: '福田货车',
    enterTime: '2026-06-08 10:00:00',
    validFrom: '2026-06-08',
    validTo: '2026-06-08',
    permittedGates: ['g5'],
    position: { x: 45, z: 40 },
    notes: '设备配送，限时2小时',
    createdAt: '2026-06-08 09:30:00',
  },
  {
    id: 'v10',
    plateNumber: '京K·88888',
    type: 'sedan',
    ownerName: '孙丽',
    ownerPhone: '13000130010',
    permitType: 'visitor',
    status: 'outside',
    color: '白色',
    brand: '大众帕萨特',
    exitTime: '2026-06-08 11:00:00',
    validFrom: '2026-06-08',
    validTo: '2026-06-08',
    permittedGates: ['g1', 'g3'],
    notes: '面试人员',
    createdAt: '2026-06-08 08:45:00',
  },
  {
    id: 'v11',
    plateNumber: '京L·99999',
    type: 'van',
    ownerName: '钱勇',
    ownerPhone: '15800158011',
    permitType: 'permanent',
    status: 'inside',
    color: '白色',
    brand: '依维柯',
    enterTime: '2026-06-08 06:30:00',
    validFrom: '2026-02-15',
    validTo: '2027-02-14',
    permittedGates: ['g5', 'g1'],
    position: { x: 55, z: -20 },
    notes: '后勤保障车',
    createdAt: '2026-02-10 13:20:00',
  },
  {
    id: 'v12',
    plateNumber: '京M·00001',
    type: 'suv',
    ownerName: '马军',
    ownerPhone: '15900159012',
    permitType: 'temporary',
    status: 'restricted',
    color: '蓝色',
    brand: '哈弗H6',
    validFrom: '2026-06-01',
    validTo: '2026-06-05',
    permittedGates: ['g2'],
    notes: '装修施工车辆，已过期',
    createdAt: '2026-05-30 09:00:00',
  },
];

const today = '2026-06-08';
const yesterday = '2026-06-07';

function generateTrafficRecords(date: string, baseCount: number): TrafficRecord[] {
  const records: TrafficRecord[] = [];
  const vehicleTypes: VehicleType[] = ['sedan', 'suv', 'truck', 'van', 'bus', 'motorcycle'];
  const gateList = gates;

  for (let i = 0; i < baseCount; i++) {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    const isPeak = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const multiplier = isPeak ? 3 : 1;

    if (Math.random() > 1 / multiplier) continue;

    const gate = gateList[Math.floor(Math.random() * gateList.length)];
    const direction = Math.random() > 0.5 ? 'in' : 'out';
    const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    const plateNum = Math.floor(10000 + Math.random() * 89999);
    const platePrefix = ['京A', '京B', '京C', '京D', '京E', '京F'][Math.floor(Math.random() * 6)];

    records.push({
      id: `tr-${date}-${i}`,
      plateNumber: `${platePrefix}·${plateNum}`,
      vehicleType,
      gateId: gate.id,
      gateName: gate.name,
      direction,
      timestamp: `${date} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
      date,
      hour,
    });
  }

  return records.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export const trafficRecords: TrafficRecord[] = [
  ...generateTrafficRecords(today, 500),
  ...generateTrafficRecords(yesterday, 480),
];

export function getTrafficStatsByDate(date: string): TrafficStats {
  const dayRecords = trafficRecords.filter((r) => r.date === date);
  const inRecords = dayRecords.filter((r) => r.direction === 'in');
  const outRecords = dayRecords.filter((r) => r.direction === 'out');

  const byType: Record<VehicleType, number> = {
    sedan: 0,
    suv: 0,
    truck: 0,
    van: 0,
    bus: 0,
    motorcycle: 0,
  };

  dayRecords.forEach((r) => {
    byType[r.vehicleType]++;
  });

  const hourly: { hour: number; in: number; out: number }[] = [];
  for (let h = 0; h < 24; h++) {
    const hourIn = inRecords.filter((r) => r.hour === h).length;
    const hourOut = outRecords.filter((r) => r.hour === h).length;
    hourly.push({ hour: h, in: hourIn, out: hourOut });
  }

  const peakIn = Math.max(...hourly.map((h) => h.in));
  const peakOut = Math.max(...hourly.map((h) => h.out));

  return {
    date,
    totalIn: inRecords.length,
    totalOut: outRecords.length,
    peakHourIn: peakIn,
    peakHourOut: peakOut,
    byType,
    hourly,
  };
}

export const roadSegments: RoadSegment[] = [
  {
    id: 'r1',
    name: '中央大道',
    startPoint: { x: -70, z: 0 },
    endPoint: { x: 70, z: 0 },
    length: 140,
    lanes: 4,
    currentSpeed: 35,
    congestionLevel: 'medium',
    vehicleCount: 12,
  },
  {
    id: 'r2',
    name: '东侧环路',
    startPoint: { x: 60, z: -40 },
    endPoint: { x: 60, z: 40 },
    length: 80,
    lanes: 2,
    currentSpeed: 20,
    congestionLevel: 'high',
    vehicleCount: 8,
  },
  {
    id: 'r3',
    name: '西侧环路',
    startPoint: { x: -60, z: -40 },
    endPoint: { x: -60, z: 40 },
    length: 80,
    lanes: 2,
    currentSpeed: 45,
    congestionLevel: 'low',
    vehicleCount: 4,
  },
  {
    id: 'r4',
    name: '南区道路',
    startPoint: { x: -40, z: 50 },
    endPoint: { x: 40, z: 50 },
    length: 80,
    lanes: 2,
    currentSpeed: 25,
    congestionLevel: 'high',
    vehicleCount: 10,
  },
  {
    id: 'r5',
    name: '北区道路',
    startPoint: { x: -40, z: -50 },
    endPoint: { x: 40, z: -50 },
    length: 80,
    lanes: 2,
    currentSpeed: 50,
    congestionLevel: 'low',
    vehicleCount: 3,
  },
  {
    id: 'r6',
    name: '物流通道',
    startPoint: { x: 50, z: 30 },
    endPoint: { x: 70, z: 55 },
    length: 35,
    lanes: 2,
    currentSpeed: 15,
    congestionLevel: 'high',
    vehicleCount: 6,
  },
];

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getVehiclesByStatus(status: Vehicle['status']): Vehicle[] {
  return vehicles.filter((v) => v.status === status);
}

export function getVehiclesByPermitType(permitType: VehiclePermitType): Vehicle[] {
  return vehicles.filter((v) => v.permitType === permitType);
}

export function searchVehicles(query: string): Vehicle[] {
  const q = query.toLowerCase();
  return vehicles.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(q) ||
      v.ownerName.toLowerCase().includes(q) ||
      v.brand?.toLowerCase().includes(q),
  );
}

export function getGateById(id: string): Gate | undefined {
  return gates.find((g) => g.id === id);
}

export function getCongestedRoads(): RoadSegment[] {
  return roadSegments.filter((r) => r.congestionLevel === 'high');
}
