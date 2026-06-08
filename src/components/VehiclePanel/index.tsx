import { useState } from 'react';
import {
  Car,
  Search,
  Filter,
  Plus,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Tag,
  ChevronRight,
  KeyRound,
  Ban,
} from 'lucide-react';
import { useVehicleStore } from '@/store/useVehicleStore';
import { vehicleTypeNames, permitTypeNames } from '@/data/vehicles';
import type { VehicleStatus, VehiclePermitType, VehicleType } from '@/types';

const statusConfig: Record<VehicleStatus, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  inside: { label: '在场', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
  outside: { label: '离场', icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-500/20' },
  restricted: { label: '受限', icon: Ban, color: 'text-red-400', bg: 'bg-red-500/20' },
};

const permitColors: Record<VehiclePermitType, string> = {
  permanent: '#22c55e',
  temporary: '#f59e0b',
  visitor: '#3b82f6',
};

export function VehiclePanel() {
  const {
    vehicles,
    selectedVehicleId,
    selectVehicle,
    filterStatus,
    filterPermitType,
    filterType,
    searchQuery,
    setFilterStatus,
    setFilterPermitType,
    setFilterType,
    setSearchQuery,
    getFilteredVehicles,
    getInsideVehicles,
    getPermanentVehicles,
    getTemporaryVehicles,
    getRestrictedVehicles,
  } = useVehicleStore();

  const [activeTab, setActiveTab] = useState<'all' | 'permanent' | 'temporary' | 'restricted'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const displayVehicles = getFilteredVehicles().filter((v) => {
    if (activeTab === 'permanent') return v.permitType === 'permanent';
    if (activeTab === 'temporary') return v.permitType === 'temporary' || v.permitType === 'visitor';
    if (activeTab === 'restricted') return v.status === 'restricted';
    return true;
  });

  const insideCount = getInsideVehicles().length;
  const permanentCount = getPermanentVehicles().length;
  const temporaryCount = getTemporaryVehicles().length;
  const restrictedCount = getRestrictedVehicles().length;

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const vehicleTypes: VehicleType[] = ['sedan', 'suv', 'truck', 'van', 'bus', 'motorcycle'];
  const permitTypes: VehiclePermitType[] = ['permanent', 'temporary', 'visitor'];

  return (
    <div className="absolute left-16 top-20 bottom-16 z-10 w-80">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">车辆管理</h3>
                <p className="text-slate-500 text-xs">共 {vehicles.length} 辆登记车辆</p>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索车牌、车主、车型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveTab('permanent')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'permanent' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              常驻
              <span className="text-green-400">{permanentCount}</span>
            </button>
            <button
              onClick={() => setActiveTab('temporary')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'temporary' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              临时
              <span className="text-amber-400">{temporaryCount}</span>
            </button>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-slate-700/50">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Filter className="w-3 h-3" />
            <span>筛选条件</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
          </button>

          {showFilters && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1.5">车辆状态</div>
                <div className="flex flex-wrap gap-1.5">
                  {(['inside', 'outside', 'restricted'] as VehicleStatus[]).map((status) => {
                    const config = statusConfig[status];
                    const isActive = filterStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(isActive ? null : status)}
                        className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                          isActive
                            ? `${config.bg} ${config.color} border-current`
                            : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">通行权限</div>
                <div className="flex flex-wrap gap-1.5">
                  {permitTypes.map((type) => {
                    const color = permitColors[type];
                    const isActive = filterPermitType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setFilterPermitType(isActive ? null : type)}
                        className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                          isActive
                            ? 'border-current'
                            : 'bg-slate-800 border-transparent hover:text-white'
                        }`}
                        style={{
                          backgroundColor: isActive ? `${color}20` : undefined,
                          color: isActive ? color : undefined,
                        }}
                      >
                        {permitTypeNames[type]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">车辆类型</div>
                <div className="flex flex-wrap gap-1.5">
                  {vehicleTypes.map((type) => {
                    const isActive = filterType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setFilterType(isActive ? null : type)}
                        className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                          isActive
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                            : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
                        }`}
                      >
                        {vehicleTypeNames[type]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {displayVehicles.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <Car className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>没有找到符合条件的车辆</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {displayVehicles.map((vehicle) => {
                const StatusIcon = statusConfig[vehicle.status].icon;
                const status = statusConfig[vehicle.status];
                const isSelected = selectedVehicleId === vehicle.id;
                const permitColor = permitColors[vehicle.permitType];

                return (
                  <button
                    key={vehicle.id}
                    onClick={() => selectVehicle(isSelected ? null : vehicle.id)}
                    className={`w-full p-3 text-left transition-colors ${
                      isSelected ? 'bg-blue-500/10' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${permitColor}20` }}
                      >
                        <Car className="w-5 h-5" style={{ color: permitColor }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-sm font-medium font-mono">
                            {vehicle.plateNumber}
                          </h4>
                          <div className={`flex items-center gap-1 ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="text-xs">{status.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span>{vehicle.ownerName}</span>
                          <span>·</span>
                          <Tag className="w-3 h-3" />
                          <span>{vehicleTypeNames[vehicle.type]}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{ backgroundColor: `${permitColor}20`, color: permitColor }}
                          >
                            {permitTypeNames[vehicle.permitType]}
                          </span>
                          {vehicle.enterTime && (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              入场 {vehicle.enterTime.split(' ')[1]}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-2" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-500/10 rounded-lg p-2">
              <div className="text-green-400 font-bold text-lg">{insideCount}</div>
              <div className="text-green-400/70 text-xs">在场车辆</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-2">
              <div className="text-amber-400 font-bold text-lg">{temporaryCount}</div>
              <div className="text-amber-400/70 text-xs">临时车辆</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2">
              <div className="text-red-400 font-bold text-lg">{restrictedCount}</div>
              <div className="text-red-400/70 text-xs">受限车辆</div>
            </div>
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <div className="absolute left-full top-0 ml-3 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden z-20">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-bold">车辆详情</h4>
              <button
                onClick={() => selectVehicle(null)}
                className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${permitColors[selectedVehicle.permitType]}20` }}
              >
                <Car className="w-7 h-7" style={{ color: permitColors[selectedVehicle.permitType] }} />
              </div>
              <div>
                <div className="text-white font-bold text-lg font-mono">{selectedVehicle.plateNumber}</div>
                <div className="text-slate-500 text-sm">{selectedVehicle.brand || '未登记品牌'}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">车主：</span>
                <span className="text-white">{selectedVehicle.ownerName}</span>
              </div>
              {selectedVehicle.ownerPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">电话：</span>
                  <span className="text-white">{selectedVehicle.ownerPhone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">车型：</span>
                <span className="text-white">{vehicleTypeNames[selectedVehicle.type]}</span>
              </div>
              {selectedVehicle.color && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-slate-500" />
                  <span className="text-slate-400">颜色：</span>
                  <span className="text-white">{selectedVehicle.color}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <KeyRound className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">权限类型：</span>
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: `${permitColors[selectedVehicle.permitType]}20`,
                    color: permitColors[selectedVehicle.permitType],
                  }}
                >
                  {permitTypeNames[selectedVehicle.permitType]}
                </span>
              </div>
              {selectedVehicle.validFrom && selectedVehicle.validTo && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">有效期：</span>
                  <span className="text-white text-xs">
                    {selectedVehicle.validFrom} ~ {selectedVehicle.validTo}
                  </span>
                </div>
              )}
              {selectedVehicle.status === 'restricted' && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>通行权限已受限</span>
                </div>
              )}
            </div>

            {selectedVehicle.notes && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="text-slate-400 text-xs mb-1">备注</div>
                <p className="text-slate-300 text-sm">{selectedVehicle.notes}</p>
              </div>
            )}

            {selectedVehicle.position && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">当前位置：</span>
                  <span className="text-white text-xs">
                    ({selectedVehicle.position.x.toFixed(1)}, {selectedVehicle.position.z.toFixed(1)})
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-700/50">
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                编辑信息
              </button>
              <button className="py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
                定位车辆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
