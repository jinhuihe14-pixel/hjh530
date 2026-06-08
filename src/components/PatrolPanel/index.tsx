import { useState } from 'react';
import {
  Shield,
  X,
  MapPin,
  Clock,
  Route,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  ChevronRight,
  Calendar,
  User,
  Camera,
  Flame,
  Building2,
  ArrowUpDown,
  Zap,
} from 'lucide-react';
import { usePatrolStore } from '@/store/usePatrolStore';
import type { FacilityType, FacilityStatus } from '@/types';
import { facilityTypeNames } from '@/data/facilities';

const typeIcons: Record<FacilityType, typeof Flame> = {
  escalator: ArrowUpDown,
  elevator: Building2,
  toilet: Shield,
  fire: Flame,
  camera: Camera,
  exit: MapPin,
  electric: Zap,
  atm: Shield,
  information: Shield,
};

const statusConfig: Record<FacilityStatus, { label: string; icon: typeof CheckCircle; color: string }> = {
  normal: { label: '正常', icon: CheckCircle, color: 'text-green-400' },
  warning: { label: '预警', icon: AlertTriangle, color: 'text-amber-400' },
  fault: { label: '故障', icon: XCircle, color: 'text-red-400' },
};

export function PatrolPanel() {
  const {
    routes,
    records,
    selectedRouteId,
    selectedRecordId,
    setSelectedRoute,
    getRouteFacilities,
    startPatrol,
    currentCheckIndex,
    nextCheck,
    prevCheck,
  } = usePatrolStore();

  const [activeTab, setActiveTab] = useState<'routes' | 'records'>('routes');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);
  const routeFacilities = selectedRouteId ? getRouteFacilities(selectedRouteId) : [];

  return (
    <div className="absolute left-16 top-20 bottom-16 z-10 w-80">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">设施巡检</h3>
                <p className="text-slate-500 text-xs">设备状态监控</p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'routes'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              巡检路线
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'records'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              巡检记录
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'routes' ? (
            <div className="p-3 space-y-2">
              {routes.map((route) => {
                const isSelected = selectedRouteId === route.id;
                const facilities = getRouteFacilities(route.id);
                const normalCount = facilities.filter((f) => f.status === 'normal').length;
                const warningCount = facilities.filter((f) => f.status === 'warning').length;
                const faultCount = facilities.filter((f) => f.status === 'fault').length;

                return (
                  <div
                    key={route.id}
                    className={`rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                    onClick={() => setSelectedRoute(isSelected ? null : route.id)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white text-sm font-medium">{route.name}</h4>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-500 transition-transform ${
                            isSelected ? 'rotate-90' : ''
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {facilities.length} 个点位
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {route.estimatedTime} 分钟
                        </div>
                        <div className="flex items-center gap-1">
                          <Route className="w-3 h-3" />
                          {route.distance}m
                        </div>
                      </div>

                      <div className="flex gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-green-400">{normalCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-amber-400">{warningCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span className="text-red-400">{faultCount}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="border-t border-slate-700/50 p-3 space-y-2">
                        <div className="text-xs text-slate-400 mb-2">巡检点位</div>
                        {facilities.slice(0, 5).map((facility, idx) => {
                          const TypeIcon = typeIcons[facility.type] || Shield;
                          const status = statusConfig[facility.status];

                          return (
                            <div
                              key={facility.id}
                              className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg"
                            >
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center ${
                                  idx === currentCheckIndex
                                    ? 'bg-cyan-500/30 ring-2 ring-cyan-500'
                                    : 'bg-slate-700/50'
                                }`}
                              >
                                <span className="text-xs text-slate-400">{idx + 1}</span>
                              </div>
                              <TypeIcon className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-white flex-1 truncate">
                                {facility.name}
                              </span>
                              <status.icon className={`w-3.5 h-3.5 ${status.color}`} />
                            </div>
                          );
                        })}
                        {facilities.length > 5 && (
                          <div className="text-center text-xs text-slate-500 py-1">
                            还有 {facilities.length - 5} 个点位...
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startPatrol(route.id);
                          }}
                          className="w-full mt-2 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          开始巡检
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {records.map((record) => {
                const isSelected = selectedRecordId === record.id;
                const route = routes.find((r) => r.id === record.routeId);

                const statusConfig2 = {
                  pending: { label: '待开始', color: 'text-slate-400', bg: 'bg-slate-500/20' },
                  'in-progress': {
                    label: '进行中',
                    color: 'text-blue-400',
                    bg: 'bg-blue-500/20',
                  },
                  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-500/20' },
                };

                const status = statusConfig2[record.status];

                return (
                  <div
                    key={record.id}
                    onClick={() =>
                      setSelectedRoute(isSelected ? null : record.routeId)
                    }
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white text-sm font-medium">
                        {route?.name || '巡检记录'}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{record.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{record.inspector}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        <span>
                          已检查 {record.checks.length} /{' '}
                          {route?.facilityIds.length || 0} 项
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-500/10 rounded-lg p-2">
              <div className="text-green-400 font-bold text-lg">
                {records.filter((r) => r.status === 'completed').length}
              </div>
              <div className="text-green-400/70 text-xs">已完成</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-2">
              <div className="text-blue-400 font-bold text-lg">
                {records.filter((r) => r.status === 'in-progress').length}
              </div>
              <div className="text-blue-400/70 text-xs">进行中</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2">
              <div className="text-red-400 font-bold text-lg">
                {
                  routeFacilities.filter((f) => f.status === 'fault').length
                }
              </div>
              <div className="text-red-400/70 text-xs">待修复</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
