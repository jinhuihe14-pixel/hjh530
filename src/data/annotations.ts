import type { Annotation, AnnotationCategory, AnnotationStatus, AnnotationPriority } from '@/types';

export const annotationCategoryNames: Record<AnnotationCategory, string> = {
  illegal_parking: '违停',
  road_damage: '路面异常',
  obstacle: '障碍物',
  garbage: '垃圾堆放',
  facility_damage: '设施损坏',
  other: '其他问题',
};

export const annotationStatusNames: Record<AnnotationStatus, string> = {
  open: '待处理',
  processing: '处理中',
  resolved: '已解决',
};

export const annotationPriorityNames: Record<AnnotationPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急',
};

export const annotationCategoryColors: Record<AnnotationCategory, string> = {
  illegal_parking: '#f59e0b',
  road_damage: '#ef4444',
  obstacle: '#8b5cf6',
  garbage: '#22c55e',
  facility_damage: '#3b82f6',
  other: '#6b7280',
};

export const annotationPriorityColors: Record<AnnotationPriority, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#f97316',
  urgent: '#ef4444',
};

export const annotations: Annotation[] = [
  {
    id: 'a1',
    category: 'illegal_parking',
    title: '东门入口违停车辆',
    description: '一辆白色SUV停放在东门入口禁停区域，影响车辆通行',
    status: 'open',
    priority: 'high',
    position: { x: 75, z: 5 },
    reporter: '张保安',
    reporterPhone: '13800138001',
    createdAt: '2026-06-08 09:30:00',
    updatedAt: '2026-06-08 09:30:00',
    tags: ['违停', '东门'],
  },
  {
    id: 'a2',
    category: 'road_damage',
    title: '中央大道路面坑洼',
    description: '中央大道中段有一处约0.5平方米的路面坑洼，存在安全隐患',
    status: 'processing',
    priority: 'urgent',
    position: { x: 10, z: 0 },
    reporter: '李巡检',
    reporterPhone: '13900139002',
    createdAt: '2026-06-08 08:15:00',
    updatedAt: '2026-06-08 10:00:00',
    assignee: '设施部-王工',
    tags: ['路面', '坑洼', '安全隐患'],
  },
  {
    id: 'a3',
    category: 'obstacle',
    title: '西侧环路建筑材料堆放',
    description: '西侧环路北段堆放有装修材料，占用半幅车道',
    status: 'open',
    priority: 'medium',
    position: { x: -60, z: -20 },
    reporter: '赵司机',
    reporterPhone: '13700137003',
    createdAt: '2026-06-08 07:45:00',
    updatedAt: '2026-06-08 07:45:00',
    tags: ['障碍物', '装修材料'],
  },
  {
    id: 'a4',
    category: 'garbage',
    title: '南区垃圾堆放点清运不及时',
    description: '南区垃圾堆放点垃圾已满，未及时清运，有异味扩散',
    status: 'resolved',
    priority: 'low',
    position: { x: -30, z: 55 },
    reporter: '陈清洁',
    reporterPhone: '13600136004',
    createdAt: '2026-06-07 16:00:00',
    updatedAt: '2026-06-08 08:00:00',
    resolvedAt: '2026-06-08 08:00:00',
    assignee: '物业-刘主管',
    tags: ['垃圾', '清运'],
  },
  {
    id: 'a5',
    category: 'facility_damage',
    title: '北门路灯故障',
    description: '北门入口处路灯不亮，夜间照明不足',
    status: 'processing',
    priority: 'medium',
    position: { x: 0, z: -58 },
    reporter: '王保安',
    reporterPhone: '13500135005',
    createdAt: '2026-06-07 20:30:00',
    updatedAt: '2026-06-08 09:00:00',
    assignee: '电力班-李师傅',
    tags: ['路灯', '照明', '维修'],
  },
  {
    id: 'a6',
    category: 'illegal_parking',
    title: '物流门前货车长时间停放',
    description: '一辆蓝色货车停放在物流门通道超过2小时',
    status: 'open',
    priority: 'high',
    position: { x: 58, z: 52 },
    reporter: '门岗-刘师傅',
    reporterPhone: '13400134006',
    createdAt: '2026-06-08 08:30:00',
    updatedAt: '2026-06-08 08:30:00',
    tags: ['违停', '货车', '物流门'],
  },
  {
    id: 'a7',
    category: 'other',
    title: '园区内流浪猫',
    description: '中央花园发现流浪猫3只，建议联系动物保护组织',
    status: 'open',
    priority: 'low',
    position: { x: 0, z: 15 },
    reporter: '员工-小周',
    createdAt: '2026-06-08 10:15:00',
    updatedAt: '2026-06-08 10:15:00',
    tags: ['动物', '其他'],
  },
  {
    id: 'a8',
    category: 'road_damage',
    title: '东区道路井盖松动',
    description: '东侧环路南段有一处井盖松动，车辆经过有异响',
    status: 'resolved',
    priority: 'medium',
    position: { x: 60, z: 25 },
    reporter: '孙司机',
    reporterPhone: '13300133007',
    createdAt: '2026-06-06 14:00:00',
    updatedAt: '2026-06-07 11:00:00',
    resolvedAt: '2026-06-07 11:00:00',
    assignee: '市政-张队',
    tags: ['井盖', '维修', '已处理'],
  },
];

export function getAnnotationById(id: string): Annotation | undefined {
  return annotations.find((a) => a.id === id);
}

export function getAnnotationsByStatus(status: AnnotationStatus): Annotation[] {
  return annotations.filter((a) => a.status === status);
}

export function getAnnotationsByCategory(category: AnnotationCategory): Annotation[] {
  return annotations.filter((a) => a.category === category);
}

export function getAnnotationsByPriority(priority: AnnotationPriority): Annotation[] {
  return annotations.filter((a) => a.priority === priority);
}

export function getAnnotationsByDateRange(startDate: string, endDate: string): Annotation[] {
  return annotations.filter((a) => {
    const created = new Date(a.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate + ' 23:59:59');
    return created >= start && created <= end;
  });
}

export function searchAnnotations(query: string): Annotation[] {
  const q = query.toLowerCase();
  return annotations.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.reporter.toLowerCase().includes(q) ||
      a.tags?.some((t) => t.toLowerCase().includes(q)),
  );
}
