import type { Shop, ShopCategory } from '@/types';

const categoryColors: Record<ShopCategory, string> = {
  fashion: '#ff6b9d',
  food: '#ffb454',
  entertainment: '#a78bfa',
  lifestyle: '#34d399',
  electronics: '#60a5fa',
  sports: '#f87171',
  beauty: '#f472b6',
  home: '#fbbf24',
  education: '#38bdf8',
  services: '#a3a3a3',
};

export const categoryNames: Record<ShopCategory, string> = {
  fashion: '时尚服饰',
  food: '餐饮美食',
  entertainment: '休闲娱乐',
  lifestyle: '生活方式',
  electronics: '数码电子',
  sports: '运动户外',
  beauty: '美妆护肤',
  home: '家居生活',
  education: '教育培训',
  services: '生活服务',
};

function createShop(
  id: string,
  name: string,
  brand: string,
  floorId: string,
  category: ShopCategory,
  subCategory: string,
  status: 'operating' | 'vacant' | 'renovating',
  position: { x: number; y: number; z: number },
  dimensions: { width: number; depth: number; height: number },
  area: number,
  extras: Partial<Shop> = {}
): Shop {
  return {
    id,
    name,
    brand,
    floorId,
    category,
    subCategory,
    status,
    color: status === 'vacant' ? '#374151' : categoryColors[category],
    position,
    dimensions,
    area,
    leaseEndDate: status === 'operating' ? '2026-12-31' : undefined,
    ...extras,
  };
}

export const shops: Shop[] = [
  // === F1 一层 ===
  createShop(
    'f1-s001',
    '星巴克臻选',
    'Starbucks Reserve',
    'f1',
    'food',
    '咖啡',
    'operating',
    { x: -30, y: 0, z: -20 },
    { width: 8, depth: 6, height: 4.5 },
    48,
    { phone: '021-12345678', openingHours: '07:00 - 22:00' }
  ),
  createShop(
    'f1-s002',
    '优衣库',
    'UNIQLO',
    'f1',
    'fashion',
    '快时尚',
    'operating',
    { x: -15, y: 0, z: -25 },
    { width: 12, depth: 10, height: 4.5 },
    120,
    { phone: '021-23456789' }
  ),
  createShop(
    'f1-s003',
    '苹果授权店',
    'Apple Store',
    'f1',
    'electronics',
    '数码产品',
    'operating',
    { x: 5, y: 0, z: -25 },
    { width: 10, depth: 8, height: 4.5 },
    80
  ),
  createShop(
    'f1-s004',
    '无印良品',
    'MUJI',
    'f1',
    'lifestyle',
    '生活百货',
    'operating',
    { x: 20, y: 0, z: -25 },
    { width: 14, depth: 10, height: 4.5 },
    140
  ),
  createShop(
    'f1-s005',
    '丝芙兰',
    'SEPHORA',
    'f1',
    'beauty',
    '化妆品',
    'operating',
    { x: 35, y: 0, z: -20 },
    { width: 8, depth: 6, height: 4.5 },
    48
  ),
  createShop(
    'f1-s006',
    '哈根达斯',
    "Haagen-Dazs",
    'f1',
    'food',
    '冰淇淋',
    'operating',
    { x: -30, y: 0, z: 0 },
    { width: 6, depth: 5, height: 4.5 },
    30
  ),
  createShop(
    'f1-s007',
    '周大福',
    'CHOW TAI FOOK',
    'f1',
    'lifestyle',
    '珠宝首饰',
    'operating',
    { x: -18, y: 0, z: 0 },
    { width: 6, depth: 5, height: 4.5 },
    30
  ),
  createShop(
    'f1-s008',
    '潮宏基',
    'CHJ',
    'f1',
    'lifestyle',
    '珠宝首饰',
    'operating',
    { x: -8, y: 0, z: 0 },
    { width: 5, depth: 4, height: 4.5 },
    20
  ),
  createShop(
    'f1-s009',
    '空置铺位A',
    '',
    'f1',
    'services',
    '',
    'vacant',
    { x: 3, y: 0, z: 0 },
    { width: 6, depth: 5, height: 4.5 },
    30,
    { description: '黄金位置，临街铺面，适合轻奢品牌' }
  ),
  createShop(
    'f1-s010',
    '老凤祥',
    'Lao Feng Xiang',
    'f1',
    'lifestyle',
    '珠宝首饰',
    'operating',
    { x: 15, y: 0, z: 0 },
    { width: 6, depth: 5, height: 4.5 },
    30
  ),
  createShop(
    'f1-s011',
    '即将到期铺',
    '到期品牌',
    'f1',
    'fashion',
    '鞋履',
    'operating',
    { x: 28, y: 0, z: 0 },
    { width: 7, depth: 5, height: 4.5 },
    35,
    { leaseEndDate: '2025-07-15' }
  ),
  createShop(
    'f1-s012',
    '屈臣氏',
    'Watsons',
    'f1',
    'beauty',
    '个人护理',
    'operating',
    { x: 35, y: 0, z: 5 },
    { width: 8, depth: 6, height: 4.5 },
    48
  ),
  createShop(
    'f1-s013',
    '喜茶',
    'HEYTEA',
    'f1',
    'food',
    '茶饮',
    'operating',
    { x: -32, y: 0, z: 20 },
    { width: 6, depth: 5, height: 4.5 },
    30
  ),
  createShop(
    'f1-s014',
    '奈雪的茶',
    "NAYUKI",
    'f1',
    'food',
    '茶饮',
    'renovating',
    { x: -15, y: 0, z: 20 },
    { width: 8, depth: 6, height: 4.5 },
    48,
    { description: '装修中，预计下月开业' }
  ),
  createShop(
    'f1-s015',
    '华为体验店',
    'HUAWEI',
    'f1',
    'electronics',
    '手机数码',
    'operating',
    { x: 0, y: 0, z: 20 },
    { width: 10, depth: 7, height: 4.5 },
    70
  ),
  createShop(
    'f1-s016',
    '小米之家',
    'Xiaomi',
    'f1',
    'electronics',
    '智能家居',
    'operating',
    { x: 15, y: 0, z: 20 },
    { width: 8, depth: 6, height: 4.5 },
    48
  ),
  createShop(
    'f1-s017',
    '优衣库',
    'UNIQLO',
    'f1',
    'fashion',
    '快时尚',
    'operating',
    { x: 30, y: 0, z: 22 },
    { width: 10, depth: 8, height: 4.5 },
    80
  ),

  // === F2 二层 ===
  createShop(
    'f2-s001',
    'ZARA',
    'ZARA',
    'f2',
    'fashion',
    '快时尚',
    'operating',
    { x: -28, y: 5, z: -24 },
    { width: 14, depth: 10, height: 4 },
    140
  ),
  createShop(
    'f2-s002',
    'H&M',
    'H&M',
    'f2',
    'fashion',
    '快时尚',
    'operating',
    { x: -8, y: 5, z: -24 },
    { width: 12, depth: 10, height: 4 },
    120
  ),
  createShop(
    'f2-s003',
    'UR',
    'URBAN REVIVO',
    'f2',
    'fashion',
    '快时尚',
    'operating',
    { x: 10, y: 5, z: -24 },
    { width: 10, depth: 8, height: 4 },
    80
  ),
  createShop(
    'f2-s004',
    '太平鸟',
    "Peacebird",
    'f2',
    'fashion',
    '女装',
    'operating',
    { x: 26, y: 5, z: -22 },
    { width: 8, depth: 6, height: 4 },
    48
  ),
  createShop(
    'f2-s005',
    'ONLY',
    'ONLY',
    'f2',
    'fashion',
    '女装',
    'operating',
    { x: 35, y: 5, z: -18 },
    { width: 6, depth: 5, height: 4 },
    30
  ),
  createShop(
    'f2-s006',
    '杰克琼斯',
    'Jack & Jones',
    'f2',
    'fashion',
    '男装',
    'operating',
    { x: -30, y: 5, z: -5 },
    { width: 7, depth: 5, height: 4 },
    35
  ),
  createShop(
    'f2-s007',
    '思莱德',
    'Selected',
    'f2',
    'fashion',
    '男装',
    'operating',
    { x: -20, y: 5, z: -5 },
    { width: 6, depth: 5, height: 4 },
    30
  ),
  createShop(
    'f2-s008',
    '空置铺位B',
    '',
    'f2',
    'fashion',
    '',
    'vacant',
    { x: -10, y: 5, z: -5 },
    { width: 8, depth: 6, height: 4 },
    48,
    { description: '女装区核心位置' }
  ),
  createShop(
    'f2-s009',
    'Nike',
    'NIKE',
    'f2',
    'sports',
    '运动品牌',
    'operating',
    { x: 5, y: 5, z: -8 },
    { width: 10, depth: 7, height: 4 },
    70
  ),
  createShop(
    'f2-s010',
    'Adidas',
    'Adidas',
    'f2',
    'sports',
    '运动品牌',
    'operating',
    { x: 20, y: 5, z: -8 },
    { width: 9, depth: 7, height: 4 },
    63
  ),
  createShop(
    'f2-s011',
    '李宁',
    'LI-NING',
    'f2',
    'sports',
    '运动品牌',
    'operating',
    { x: 33, y: 5, z: -5 },
    { width: 7, depth: 5, height: 4 },
    35
  ),
  createShop(
    'f2-s012',
    '海底捞',
    'Haidilao',
    'f2',
    'food',
    '火锅',
    'operating',
    { x: -28, y: 5, z: 15 },
    { width: 14, depth: 10, height: 4 },
    140,
    { phone: '021-34567890', openingHours: '10:00 - 22:00' }
  ),
  createShop(
    'f2-s013',
    '外婆家',
    'Grandma',
    'f2',
    'food',
    '中餐',
    'operating',
    { x: -8, y: 5, z: 15 },
    { width: 10, depth: 8, height: 4 },
    80
  ),
  createShop(
    'f2-s014',
    '西贝莜面村',
    'Xibei',
    'f2',
    'food',
    '西北菜',
    'operating',
    { x: 8, y: 5, z: 15 },
    { width: 9, depth: 7, height: 4 },
    63
  ),
  createShop(
    'f2-s015',
    '探鱼',
    'Tan Yu',
    'f2',
    'food',
    '烤鱼',
    'operating',
    { x: 22, y: 5, z: 15 },
    { width: 8, depth: 7, height: 4 },
    56
  ),
  createShop(
    'f2-s016',
    '太二酸菜鱼',
    "Tai Er",
    'f2',
    'food',
    '川菜',
    'operating',
    { x: 35, y: 5, z: 15 },
    { width: 7, depth: 6, height: 4 },
    42
  ),

  // === F3 三层 ===
  createShop(
    'f3-s001',
    '万达影城',
    'Wanda Cinema',
    'f3',
    'entertainment',
    '电影院',
    'operating',
    { x: -28, y: 9.5, z: -22 },
    { width: 20, depth: 15, height: 4 },
    300
  ),
  createShop(
    'f3-s002',
    '大玩家',
    'Play1',
    'f3',
    'entertainment',
    '游戏厅',
    'operating',
    { x: 0, y: 9.5, z: -22 },
    { width: 15, depth: 12, height: 4 },
    180
  ),
  createShop(
    'f3-s003',
    'KTV',
    'Party World',
    'f3',
    'entertainment',
    'KTV',
    'operating',
    { x: 25, y: 9.5, z: -20 },
    { width: 12, depth: 10, height: 4 },
    120
  ),
  createShop(
    'f3-s004',
    '儿童乐园',
    'Kidland',
    'f3',
    'entertainment',
    '儿童游乐',
    'operating',
    { x: -30, y: 9.5, z: 0 },
    { width: 12, depth: 10, height: 4 },
    120
  ),
  createShop(
    'f3-s005',
    '玩具反斗城',
    'Toys R Us',
    'f3',
    'lifestyle',
    '玩具',
    'operating',
    { x: -12, y: 9.5, z: 0 },
    { width: 10, depth: 7, height: 4 },
    70
  ),
  createShop(
    'f3-s006',
    '空置铺位C',
    '',
    'f3',
    'entertainment',
    '',
    'vacant',
    { x: 3, y: 9.5, z: 0 },
    { width: 8, depth: 6, height: 4 },
    48,
    { description: '适合儿童教育或亲子业态' }
  ),
  createShop(
    'f3-s007',
    '乐高',
    'LEGO',
    'f3',
    'lifestyle',
    '益智玩具',
    'operating',
    { x: 16, y: 9.5, z: 0 },
    { width: 6, depth: 5, height: 4 },
    30
  ),
  createShop(
    'f3-s008',
    '泡泡玛特',
    'POP MART',
    'f3',
    'lifestyle',
    '潮玩',
    'operating',
    { x: 28, y: 9.5, z: 0 },
    { width: 5, depth: 4, height: 4 },
    20
  ),
  createShop(
    'f3-s009',
    '西西弗书店',
    'Sisyphe',
    'f3',
    'lifestyle',
    '书店',
    'operating',
    { x: -25, y: 9.5, z: 18 },
    { width: 12, depth: 8, height: 4 },
    96
  ),
  createShop(
    'f3-s010',
    '海马体照相馆',
    'HIMO',
    'f3',
    'services',
    '摄影',
    'operating',
    { x: -8, y: 9.5, z: 18 },
    { width: 6, depth: 5, height: 4 },
    30
  ),
  createShop(
    'f3-s011',
    '健身俱乐部',
    'Fitness',
    'f3',
    'sports',
    '健身',
    'operating',
    { x: 10, y: 9.5, z: 18 },
    { width: 15, depth: 10, height: 4 },
    150
  ),
  createShop(
    'f3-s012',
    '瑜伽馆',
    'Yoga',
    'f3',
    'sports',
    '瑜伽',
    'operating',
    { x: 30, y: 9.5, z: 18 },
    { width: 8, depth: 7, height: 4 },
    56
  ),

  // === F4 四层（餐饮/娱乐层）===
  createShop(
    'f4-s001',
    '空中花园餐厅',
    'Sky Garden',
    'f4',
    'food',
    '西餐',
    'operating',
    { x: -18, y: 14, z: -15 },
    { width: 12, depth: 10, height: 4.5 },
    120
  ),
  createShop(
    'f4-s002',
    '日式料理',
    'Sushi',
    'f4',
    'food',
    '日料',
    'operating',
    { x: 0, y: 14, z: -15 },
    { width: 10, depth: 8, height: 4.5 },
    80
  ),
  createShop(
    'f4-s003',
    '韩式烤肉',
    'Korean BBQ',
    'f4',
    'food',
    '烤肉',
    'operating',
    { x: 18, y: 14, z: -15 },
    { width: 10, depth: 8, height: 4.5 },
    80
  ),
  createShop(
    'f4-s004',
    '茶馆',
    'Tea House',
    'f4',
    'food',
    '茶',
    'operating',
    { x: -18, y: 14, z: 5 },
    { width: 8, depth: 6, height: 4.5 },
    48
  ),
  createShop(
    'f4-s005',
    '轰趴馆',
    'Party',
    'f4',
    'entertainment',
    '聚会',
    'operating',
    { x: 0, y: 14, z: 5 },
    { width: 12, depth: 8, height: 4.5 },
    96
  ),
  createShop(
    'f4-s006',
    '密室逃脱',
    'Escape Room',
    'f4',
    'entertainment',
    '密室',
    'operating',
    { x: 18, y: 14, z: 5 },
    { width: 10, depth: 8, height: 4.5 },
    80
  ),

  // === B1 地下车库 ===
  createShop(
    'b1-s001',
    '便利店',
    'FamilyMart',
    'b1',
    'services',
    '便利店',
    'operating',
    { x: -30, y: -3.5, z: -20 },
    { width: 6, depth: 4, height: 3 },
    24
  ),
  createShop(
    'b1-s002',
    '干洗店',
    'Dry Clean',
    'b1',
    'services',
    '洗衣',
    'operating',
    { x: 25, y: -3.5, z: -20 },
    { width: 5, depth: 4, height: 3 },
    20
  ),
];

export const getShopsByFloor = (floorId: string): Shop[] => {
  return shops.filter((s) => s.floorId === floorId);
};

export const getShopById = (id: string): Shop | undefined => {
  return shops.find((s) => s.id === id);
};

export const getShopCategories = (): { key: ShopCategory; name: string; color: string }[] => {
  return (Object.keys(categoryColors) as ShopCategory[]).map((key) => ({
    key,
    name: categoryNames[key],
    color: categoryColors[key],
  }));
};
