import type { NavNode } from '@/types';

function createNode(
  id: string,
  floorId: string,
  x: number,
  y: number,
  z: number,
  type: NavNode['type'] = 'walkway',
  neighbors: string[] = [],
  name?: string
): NavNode {
  return {
    id,
    floorId,
    position: { x, y, z },
    neighbors,
    type,
    name,
  };
}

export const navNodes: NavNode[] = [
  // === F1 一层导航节点 ===
  // 主走廊
  createNode('f1-n-001', 'f1', -30, 0, -15, 'walkway', ['f1-n-002', 'f1-n-007']),
  createNode('f1-n-002', 'f1', -15, 0, -15, 'walkway', ['f1-n-001', 'f1-n-003', 'f1-n-008']),
  createNode('f1-n-003', 'f1', 0, 0, -15, 'walkway', ['f1-n-002', 'f1-n-004', 'f1-n-009']),
  createNode('f1-n-004', 'f1', 15, 0, -15, 'walkway', ['f1-n-003', 'f1-n-005', 'f1-n-010']),
  createNode('f1-n-005', 'f1', 30, 0, -15, 'walkway', ['f1-n-004', 'f1-n-006']),
  createNode('f1-n-006', 'f1', 35, 0, 0, 'walkway', ['f1-n-005', 'f1-n-012']),

  // 中庭区域
  createNode('f1-n-007', 'f1', -30, 0, 0, 'walkway', ['f1-n-001', 'f1-n-008', 'f1-n-013']),
  createNode('f1-n-008', 'f1', -15, 0, 0, 'walkway', ['f1-n-002', 'f1-n-007', 'f1-n-009', 'f1-n-014']),
  createNode('f1-n-009', 'f1', 0, 0, 0, 'walkway', ['f1-n-003', 'f1-n-008', 'f1-n-010', 'f1-n-015']),
  createNode('f1-n-010', 'f1', 15, 0, 0, 'walkway', ['f1-n-004', 'f1-n-009', 'f1-n-011', 'f1-n-016']),
  createNode('f1-n-011', 'f1', 30, 0, 0, 'walkway', ['f1-n-005', 'f1-n-010', 'f1-n-012']),

  // 北侧走廊
  createNode('f1-n-012', 'f1', 35, 0, 15, 'walkway', ['f1-n-006', 'f1-n-011', 'f1-n-017']),
  createNode('f1-n-013', 'f1', -30, 0, 15, 'walkway', ['f1-n-007', 'f1-n-014', 'f1-n-018']),
  createNode('f1-n-014', 'f1', -15, 0, 15, 'walkway', ['f1-n-008', 'f1-n-013', 'f1-n-015', 'f1-n-019']),
  createNode('f1-n-015', 'f1', 0, 0, 15, 'walkway', ['f1-n-009', 'f1-n-014', 'f1-n-016', 'f1-n-020']),
  createNode('f1-n-016', 'f1', 15, 0, 15, 'walkway', ['f1-n-010', 'f1-n-015', 'f1-n-017', 'f1-n-021']),
  createNode('f1-n-017', 'f1', 30, 0, 15, 'walkway', ['f1-n-012', 'f1-n-016', 'f1-n-022']),

  // 出入口
  createNode('f1-n-018', 'f1', -35, 0, 20, 'entrance', ['f1-n-013'], '西门'),
  createNode('f1-n-019', 'f1', -15, 0, 25, 'entrance', ['f1-n-014'], '北门'),
  createNode('f1-n-020', 'f1', 0, 0, 28, 'entrance', ['f1-n-015'], '东门'),
  createNode('f1-n-021', 'f1', 15, 0, 25, 'entrance', ['f1-n-016'], '南门'),
  createNode('f1-n-022', 'f1', 35, 0, 20, 'entrance', ['f1-n-017'], '东南门'),

  // 扶梯
  createNode('f1-n-esc-1', 'f1', -5, 0, 10, 'escalator', ['f1-n-015', 'f2-n-esc-1'], '扶梯1上行'),
  createNode('f1-n-esc-2', 'f1', 5, 0, 10, 'escalator', ['f1-n-015', 'f2-n-esc-2'], '扶梯2下行'),

  // 电梯
  createNode('f1-n-elev-1', 'f1', -35, 0, 10, 'elevator', ['f1-n-013', 'f2-n-elev-1', 'f3-n-elev-1', 'f4-n-elev-1', 'b1-n-elev-1'], '1号客梯'),

  // === F2 二层导航节点 ===
  createNode('f2-n-001', 'f2', -30, 5, -20, 'walkway', ['f2-n-002', 'f2-n-007']),
  createNode('f2-n-002', 'f2', -15, 5, -20, 'walkway', ['f2-n-001', 'f2-n-003', 'f2-n-008']),
  createNode('f2-n-003', 'f2', 0, 5, -20, 'walkway', ['f2-n-002', 'f2-n-004', 'f2-n-009']),
  createNode('f2-n-004', 'f2', 15, 5, -20, 'walkway', ['f2-n-003', 'f2-n-005', 'f2-n-010']),
  createNode('f2-n-005', 'f2', 30, 5, -20, 'walkway', ['f2-n-004', 'f2-n-006']),
  createNode('f2-n-006', 'f2', 35, 5, -10, 'walkway', ['f2-n-005', 'f2-n-012']),

  createNode('f2-n-007', 'f2', -30, 5, 0, 'walkway', ['f2-n-001', 'f2-n-008', 'f2-n-013']),
  createNode('f2-n-008', 'f2', -15, 5, 0, 'walkway', ['f2-n-002', 'f2-n-007', 'f2-n-009', 'f2-n-014']),
  createNode('f2-n-009', 'f2', 0, 5, 0, 'walkway', ['f2-n-003', 'f2-n-008', 'f2-n-010', 'f2-n-015']),
  createNode('f2-n-010', 'f2', 15, 5, 0, 'walkway', ['f2-n-004', 'f2-n-009', 'f2-n-011', 'f2-n-016']),
  createNode('f2-n-011', 'f2', 30, 5, 0, 'walkway', ['f2-n-005', 'f2-n-010', 'f2-n-012']),

  createNode('f2-n-012', 'f2', 35, 5, 15, 'walkway', ['f2-n-006', 'f2-n-011', 'f2-n-017']),
  createNode('f2-n-013', 'f2', -30, 5, 15, 'walkway', ['f2-n-007', 'f2-n-014', 'f2-n-018']),
  createNode('f2-n-014', 'f2', -15, 5, 15, 'walkway', ['f2-n-008', 'f2-n-013', 'f2-n-015', 'f2-n-019']),
  createNode('f2-n-015', 'f2', 0, 5, 15, 'walkway', ['f2-n-009', 'f2-n-014', 'f2-n-016', 'f2-n-020']),
  createNode('f2-n-016', 'f2', 15, 5, 15, 'walkway', ['f2-n-010', 'f2-n-015', 'f2-n-017']),
  createNode('f2-n-017', 'f2', 30, 5, 15, 'walkway', ['f2-n-012', 'f2-n-016']),

  createNode('f2-n-018', 'f2', -35, 5, 10, 'walkway', ['f2-n-013', 'f2-n-elev-1']),

  // 扶梯
  createNode('f2-n-esc-1', 'f2', -5, 5, 10, 'escalator', ['f2-n-015', 'f3-n-esc-1'], '扶梯1上行'),
  createNode('f2-n-esc-2', 'f2', 5, 5, 10, 'escalator', ['f2-n-015', 'f1-n-esc-2'], '扶梯2下行'),

  // 电梯
  createNode('f2-n-elev-1', 'f2', -35, 5, 10, 'elevator', ['f2-n-018', 'f1-n-elev-1', 'f3-n-elev-1', 'f4-n-elev-1', 'b1-n-elev-1'], '1号客梯'),

  // === F3 三层导航节点 ===
  createNode('f3-n-001', 'f3', -30, 9.5, -20, 'walkway', ['f3-n-002', 'f3-n-007']),
  createNode('f3-n-002', 'f3', -15, 9.5, -20, 'walkway', ['f3-n-001', 'f3-n-003', 'f3-n-008']),
  createNode('f3-n-003', 'f3', 0, 9.5, -20, 'walkway', ['f3-n-002', 'f3-n-004', 'f3-n-009']),
  createNode('f3-n-004', 'f3', 15, 9.5, -20, 'walkway', ['f3-n-003', 'f3-n-005', 'f3-n-010']),
  createNode('f3-n-005', 'f3', 30, 9.5, -20, 'walkway', ['f3-n-004', 'f3-n-006']),

  createNode('f3-n-006', 'f3', 35, 9.5, 0, 'walkway', ['f3-n-005', 'f3-n-012']),
  createNode('f3-n-007', 'f3', -30, 9.5, 0, 'walkway', ['f3-n-001', 'f3-n-008', 'f3-n-013']),
  createNode('f3-n-008', 'f3', -15, 9.5, 0, 'walkway', ['f3-n-002', 'f3-n-007', 'f3-n-009', 'f3-n-014']),
  createNode('f3-n-009', 'f3', 0, 9.5, 0, 'walkway', ['f3-n-003', 'f3-n-008', 'f3-n-010', 'f3-n-esc-1', 'f3-n-esc-2']),
  createNode('f3-n-010', 'f3', 15, 9.5, 0, 'walkway', ['f3-n-004', 'f3-n-009', 'f3-n-011']),
  createNode('f3-n-011', 'f3', 30, 9.5, 0, 'walkway', ['f3-n-005', 'f3-n-010', 'f3-n-012']),

  createNode('f3-n-012', 'f3', 35, 9.5, 15, 'walkway', ['f3-n-006', 'f3-n-011', 'f3-n-017']),
  createNode('f3-n-013', 'f3', -30, 9.5, 15, 'walkway', ['f3-n-007', 'f3-n-014', 'f3-n-018']),
  createNode('f3-n-014', 'f3', -15, 9.5, 15, 'walkway', ['f3-n-008', 'f3-n-013', 'f3-n-015']),
  createNode('f3-n-015', 'f3', 0, 9.5, 15, 'walkway', ['f3-n-009', 'f3-n-014', 'f3-n-016']),
  createNode('f3-n-016', 'f3', 15, 9.5, 15, 'walkway', ['f3-n-010', 'f3-n-015', 'f3-n-017']),
  createNode('f3-n-017', 'f3', 30, 9.5, 15, 'walkway', ['f3-n-012', 'f3-n-016']),
  createNode('f3-n-018', 'f3', -35, 9.5, 10, 'walkway', ['f3-n-013', 'f3-n-elev-1']),

  // 扶梯
  createNode('f3-n-esc-1', 'f3', -5, 9.5, 10, 'escalator', ['f3-n-009', 'f4-n-esc-1'], '扶梯1上行'),
  createNode('f3-n-esc-2', 'f3', 5, 9.5, 10, 'escalator', ['f3-n-009', 'f2-n-esc-2'], '扶梯2下行'),

  // 电梯
  createNode('f3-n-elev-1', 'f3', -35, 9.5, 10, 'elevator', ['f3-n-018', 'f1-n-elev-1', 'f2-n-elev-1', 'f4-n-elev-1', 'b1-n-elev-1'], '1号客梯'),

  // === F4 四层导航节点 ===
  createNode('f4-n-001', 'f4', -20, 14, -18, 'walkway', ['f4-n-002', 'f4-n-005']),
  createNode('f4-n-002', 'f4', -5, 14, -18, 'walkway', ['f4-n-001', 'f4-n-003', 'f4-n-006']),
  createNode('f4-n-003', 'f4', 10, 14, -18, 'walkway', ['f4-n-002', 'f4-n-004', 'f4-n-007']),
  createNode('f4-n-004', 'f4', 22, 14, -15, 'walkway', ['f4-n-003', 'f4-n-008']),

  createNode('f4-n-005', 'f4', -20, 14, 0, 'walkway', ['f4-n-001', 'f4-n-006', 'f4-n-009']),
  createNode('f4-n-006', 'f4', -5, 14, 0, 'walkway', ['f4-n-002', 'f4-n-005', 'f4-n-007', 'f4-n-esc-1']),
  createNode('f4-n-007', 'f4', 10, 14, 0, 'walkway', ['f4-n-003', 'f4-n-006', 'f4-n-008']),
  createNode('f4-n-008', 'f4', 22, 14, 5, 'walkway', ['f4-n-004', 'f4-n-007']),

  createNode('f4-n-009', 'f4', -20, 14, 10, 'walkway', ['f4-n-005', 'f4-n-elev-1']),

  // 扶梯
  createNode('f4-n-esc-1', 'f4', 0, 14, -5, 'escalator', ['f4-n-006', 'f3-n-esc-1'], '扶梯1下行'),

  // 电梯
  createNode('f4-n-elev-1', 'f4', -20, 14, 10, 'elevator', ['f4-n-009', 'f1-n-elev-1', 'f2-n-elev-1', 'f3-n-elev-1', 'b1-n-elev-1'], '1号客梯'),

  // === B1 地下车库导航节点 ===
  createNode('b1-n-001', 'b1', -30, -3.5, -20, 'walkway', ['b1-n-002', 'b1-n-005']),
  createNode('b1-n-002', 'b1', -10, -3.5, -20, 'walkway', ['b1-n-001', 'b1-n-003', 'b1-n-006']),
  createNode('b1-n-003', 'b1', 10, -3.5, -20, 'walkway', ['b1-n-002', 'b1-n-004', 'b1-n-007']),
  createNode('b1-n-004', 'b1', 30, -3.5, -20, 'walkway', ['b1-n-003', 'b1-n-008']),

  createNode('b1-n-005', 'b1', -30, -3.5, 0, 'walkway', ['b1-n-001', 'b1-n-006', 'b1-n-009']),
  createNode('b1-n-006', 'b1', -10, -3.5, 0, 'walkway', ['b1-n-002', 'b1-n-005', 'b1-n-007', 'b1-n-elev-1']),
  createNode('b1-n-007', 'b1', 10, -3.5, 0, 'walkway', ['b1-n-003', 'b1-n-006', 'b1-n-008']),
  createNode('b1-n-008', 'b1', 30, -3.5, 0, 'walkway', ['b1-n-004', 'b1-n-007', 'b1-n-010']),

  createNode('b1-n-009', 'b1', -30, -3.5, 20, 'walkway', ['b1-n-005', 'b1-n-011']),
  createNode('b1-n-010', 'b1', 30, -3.5, 20, 'walkway', ['b1-n-008', 'b1-n-012']),
  createNode('b1-n-011', 'b1', -15, -3.5, 25, 'entrance', ['b1-n-009'], '车库入口'),
  createNode('b1-n-012', 'b1', 15, -3.5, 25, 'entrance', ['b1-n-010'], '车库出口'),

  // 电梯
  createNode('b1-n-elev-1', 'b1', -35, -3.5, 10, 'elevator', ['b1-n-006', 'f1-n-elev-1', 'f2-n-elev-1', 'f3-n-elev-1', 'f4-n-elev-1'], '1号客梯'),
];

export const getNodesByFloor = (floorId: string): NavNode[] => {
  return navNodes.filter((n) => n.floorId === floorId);
};

export const getNodeById = (id: string): NavNode | undefined => {
  return navNodes.find((n) => n.id === id);
};
