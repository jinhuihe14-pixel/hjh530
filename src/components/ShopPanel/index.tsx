import { useState } from 'react';
import {
  Store,
  X,
  Filter,
  Search,
  Building2,
  Tag,
  Calendar,
  AlertTriangle,
  CheckCircle,
  PauseCircle,
  ChevronRight,
} from 'lucide-react';
import { useShopStore } from '@/store/useShopStore';
import { getShopCategories, categoryNames } from '@/data/shops';
import type { ShopCategory, ShopStatus } from '@/types';
import { floors } from '@/data/floors';

export function ShopPanel() {
  const {
    shops,
    selectedShopId,
    selectShop,
    filterCategory,
    filterStatus,
    searchQuery,
    setFilterCategory,
    setFilterStatus,
    setSearchQuery,
    getFilteredShops,
    getVacantShops,
    getExpiringSoonShops,
  } = useShopStore();

  const [activeTab, setActiveTab] = useState<'all' | 'vacant' | 'expiring'>('all');
  const categories = getShopCategories();

  const displayShops =
    activeTab === 'all'
      ? getFilteredShops()
      : activeTab === 'vacant'
      ? getVacantShops()
      : getExpiringSoonShops();

  const statusIcons: Record<ShopStatus, typeof CheckCircle> = {
    operating: CheckCircle,
    vacant: PauseCircle,
    renovating: AlertTriangle,
  };

  const statusLabels: Record<ShopStatus, string> = {
    operating: '营业中',
    vacant: '空置',
    renovating: '装修中',
  };

  const statusColors: Record<ShopStatus, string> = {
    operating: 'text-green-400',
    vacant: 'text-slate-400',
    renovating: 'text-amber-400',
  };

  const vacantCount = getVacantShops().length;
  const expiringCount = getExpiringSoonShops().length;

  return (
    <div className="absolute left-16 top-20 bottom-16 z-10 w-80">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">业态铺位</h3>
                <p className="text-slate-500 text-xs">共 {shops.length} 个铺位</p>
              </div>
            </div>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索店铺或品牌..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveTab('vacant')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'vacant'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              空置
              <span className="text-amber-400">{vacantCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('expiring')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'expiring'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              到期
              <span className="text-red-400">{expiringCount}</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">业态筛选</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                !filterCategory
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-800 text-slate-400 border border-transparent hover:text-white'
              }`}
            >
              全部
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterCategory(cat.key as ShopCategory)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  filterCategory === cat.key
                    ? 'text-white border'
                    : 'bg-slate-800 text-slate-400 border border-transparent hover:text-white'
                }`}
                style={{
                  backgroundColor: filterCategory === cat.key ? cat.color + '30' : undefined,
                  borderColor: filterCategory === cat.key ? cat.color + '50' : undefined,
                  color: filterCategory === cat.key ? cat.color : undefined,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {displayShops.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <Store className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>没有找到符合条件的铺位</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {displayShops.map((shop) => {
                const StatusIcon = statusIcons[shop.status];
                const floor = floors.find((f) => f.id === shop.floorId);
                const isSelected = selectedShopId === shop.id;

                return (
                  <button
                    key={shop.id}
                    onClick={() => selectShop(shop.id)}
                    className={`w-full p-3 text-left transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-500/10'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: shop.color + '30' }}
                    >
                      <Store
                        className="w-5 h-5"
                        style={{ color: shop.status === 'vacant' ? '#64748b' : shop.color }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white text-sm font-medium truncate">
                          {shop.name || '空置铺位'}
                        </h4>
                        <div className={`flex items-center gap-1 ${statusColors[shop.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Building2 className="w-3 h-3" />
                        <span>{floor?.name}</span>
                        <span>·</span>
                        <Tag className="w-3 h-3" />
                        <span>{categoryNames[shop.category]}</span>
                      </div>

                      {shop.leaseEndDate && shop.status === 'operating' && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>到期：{shop.leaseEndDate}</span>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-3" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-500/10 rounded-lg p-2">
              <div className="text-green-400 font-bold">
                {shops.filter((s) => s.status === 'operating').length}
              </div>
              <div className="text-green-400/70 text-xs">营业中</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-2">
              <div className="text-amber-400 font-bold">{vacantCount}</div>
              <div className="text-amber-400/70 text-xs">空置</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2">
              <div className="text-red-400 font-bold">{expiringCount}</div>
              <div className="text-red-400/70 text-xs">即将到期</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
