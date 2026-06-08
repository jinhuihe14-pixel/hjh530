import type { Floor } from '@/types';

export const floors: Floor[] = [
  {
    id: 'b1',
    name: 'B1 地下车库',
    level: -1,
    height: 3.5,
    baseY: -3.5,
    visible: true,
    color: '#1a1a2e',
    dimensions: { width: 80, depth: 60 },
  },
  {
    id: 'f1',
    name: 'F1 一层',
    level: 1,
    height: 5,
    baseY: 0,
    visible: true,
    color: '#0f1419',
    dimensions: { width: 80, depth: 60 },
  },
  {
    id: 'f2',
    name: 'F2 二层',
    level: 2,
    height: 4.5,
    baseY: 5,
    visible: true,
    color: '#0f1419',
    dimensions: { width: 80, depth: 60 },
  },
  {
    id: 'f3',
    name: 'F3 三层',
    level: 3,
    height: 4.5,
    baseY: 9.5,
    visible: true,
    color: '#0f1419',
    dimensions: { width: 80, depth: 60 },
  },
  {
    id: 'f4',
    name: 'F4 四层',
    level: 4,
    height: 5,
    baseY: 14,
    visible: true,
    color: '#0f1419',
    dimensions: { width: 60, depth: 50 },
  },
];

export const getFloorById = (id: string): Floor | undefined => {
  return floors.find((f) => f.id === id);
};

export const getFloorByLevel = (level: number): Floor | undefined => {
  return floors.find((f) => f.level === level);
};
