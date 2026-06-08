import {
  Store,
  X,
  Calendar,
  MapPin,
  Phone,
  Clock,
  Tag,
  Building2,
  AlertTriangle,
  CheckCircle,
  PauseCircle,
} from 'lucide-react';
import { useShopStore } from '@/store/useShopStore';
import { useSceneStore } from '@/store/useSceneStore';
import { categoryNames } from '@/data/shops';
import { getFloorById } from '@/data/floors';
import { useNavStore } from '@/store/useNavStore';
import { findNearestNode } from '@/utils/pathfinding';

export function ShopDetailPanel() {
  const { selectedShopId, selectShop, getShopById } = useShopStore();
  const setEndPoint = useNavStore((s) => s.setEndPoint);
  const setActivePanel = useSceneStore((s) => s.setActivePanel);

  const shop = selectedShopId ? getShopById(selectedShopId) : null;

  if (!shop) return null;

  const floor = getFloorById(shop.floorId);

  const statusConfig = {
    operating: {
      label: '营业中',
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
    },
    vacant: {
      label: '空置',
      icon: PauseCircle,
      color: 'text-slate-400',
      bg: 'bg-slate-500/20',
    },
    renovating: {
      label: '装修中',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
    },
  };

  const status = statusConfig[shop.status];
  const StatusIcon = status.icon;

  const handleNavigate = () => {
    const node = findNearestNode(
      shop.position.x,
      shop.position.y,
      shop.position.z,
      shop.floorId
    );
    if (node) {
      setEndPoint(node);
      selectShop(null);
    }
  };

  const isExpiringSoon = shop.leaseEndDate
    ? new Date(shop.leaseEndDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    : false;

  return (
    <div className="absolute right-4 top-20 bottom-16 z-20 w-80">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div
          className="h-32 relative"
          style={{
            background: `linear-gradient(135deg, ${shop.color}40 0%, transparent 70%)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/95" />

          <button
            onClick={() => selectShop(null)}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white font-bold text-xl">{shop.name}</h3>
                <p className="text-slate-400 text-sm">{shop.brand}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Tag className="w-3 h-3" />
                业态分类
              </div>
              <div className="text-white text-sm font-medium">
                {categoryNames[shop.category]}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Building2 className="w-3 h-3" />
                所在楼层
              </div>
              <div className="text-white text-sm font-medium">{floor?.name || '-'}</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <MapPin className="w-3 h-3" />
                店铺面积
              </div>
              <div className="text-white text-sm font-medium">
                {shop.area} <span className="text-slate-500 text-xs">㎡</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                租赁状态
              </div>
              <div className={`text-sm font-medium ${isExpiringSoon ? 'text-amber-400' : 'text-white'}`}>
                {shop.leaseEndDate || '-'}
                {isExpiringSoon && (
                  <span className="ml-1 text-xs">(即将到期)</span>
                )}
              </div>
            </div>
          </div>

          {shop.phone && (
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Phone className="w-3 h-3" />
                联系电话
              </div>
              <div className="text-white text-sm">{shop.phone}</div>
            </div>
          )}

          {shop.openingHours && (
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Clock className="w-3 h-3" />
                营业时间
              </div>
              <div className="text-white text-sm">{shop.openingHours}</div>
            </div>
          )}

          {shop.description && (
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <Store className="w-3 h-3" />
                店铺介绍
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{shop.description}</p>
            </div>
          )}

          {shop.status === 'vacant' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-amber-400 font-medium text-sm">招商中</div>
                  <p className="text-amber-200/70 text-xs mt-1">
                    该铺位正在招商中，位置优越，客流量大，适合多种业态入驻。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button
            onClick={handleNavigate}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            导航到这里
          </button>
          <button className="w-full py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">
            查看更多详情
          </button>
        </div>
      </div>
    </div>
  );
}
