import { useState } from 'react';
import {
  TrendingUp,
  Car,
  ArrowRightLeft,
  Clock,
  MapPin,
  BarChart3,
  Activity,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useTrafficStore } from '@/store/useTrafficStore';
import { vehicleTypeNames } from '@/data/vehicles';
import type { VehicleType, RoadSegment } from '@/types';

const congestionColors: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const congestionLabels: Record<string, string> = {
  low: '畅通',
  medium: '缓行',
  high: '拥堵',
};

export function TrafficPanel() {
  const {
    stats,
    selectedDate,
    setSelectedDate,
    activeTab,
    setActiveTab,
    roadSegments,
    selectedRoadId,
    selectRoad,
    getTodayRecords,
    getCongestedRoads,
    getVehicleTypeDistribution,
    getPeakHours,
  } = useTrafficStore();

  const [dateInput, setDateInput] = useState(selectedDate);

  const todayRecords = getTodayRecords();
  const congestedRoads = getCongestedRoads();
  const typeDistribution = getVehicleTypeDistribution();
  const peakHours = getPeakHours();

  const maxHourlyValue = stats
    ? Math.max(...stats.hourly.map((h) => Math.max(h.in, h.out)))
    : 0;

  return (
    <div className="absolute left-16 top-20 bottom-16 z-10 w-96">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">车流统计</h3>
                <p className="text-slate-500 text-xs">进出车辆数据分析</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                onBlur={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              统计概览
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'records' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              通行记录
            </button>
            <button
              onClick={() => setActiveTab('roads')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'roads' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              道路状态
              {congestedRoads.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && stats && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-3 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Car className="w-4 h-4 text-green-400" />
                    <span className="text-green-400/70 text-xs">入场车辆</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{stats.totalIn}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl p-3 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400/70 text-xs">出场车辆</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{stats.totalOut}</div>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-white text-sm font-medium">高峰时段</span>
                </div>
                <div className="space-y-2">
                  {peakHours.slice(0, 2).map((peak, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {peak.hour}:00 - {peak.hour + 1}:00
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={peak.type === 'in' ? 'text-green-400' : 'text-blue-400'}>
                          {peak.count} 辆
                        </span>
                        <span className="text-xs text-slate-500">
                          {peak.type === 'in' ? '入场高峰' : '出场高峰'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span className="text-white text-sm font-medium">24小时车流分布</span>
                </div>
                <div className="h-32 flex items-end gap-0.5">
                  {stats.hourly.map((h) => {
                    const height = maxHourlyValue > 0 ? (Math.max(h.in, h.out) / maxHourlyValue) * 100 : 0;
                    const isPeak = Math.max(h.in, h.out) === Math.max(stats.peakHourIn, stats.peakHourOut);
                    return (
                      <div key={h.hour} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col gap-px">
                          <div
                            className={`w-full rounded-t transition-all ${isPeak ? 'bg-amber-500' : 'bg-green-500/60'}`}
                            style={{ height: `${(h.in / Math.max(h.in, h.out, 1)) * 50}%` }}
                          />
                          <div
                            className={`w-full rounded-b transition-all ${isPeak ? 'bg-amber-400' : 'bg-blue-500/60'}`}
                            style={{ height: `${(h.out / Math.max(h.in, h.out, 1)) * 50}%` }}
                          />
                        </div>
                        <div
                          className="w-full h-16 flex items-end justify-center"
                          style={{ height: '64px' }}
                        >
                          <div
                            className={`w-full rounded-t transition-all ${
                              isPeak ? 'bg-amber-500' : 'bg-cyan-500/40'
                            }`}
                            style={{ height: `${height}%`, minHeight: '2px' }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 mt-1">{h.hour}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-green-500/60" />
                    <span className="text-slate-500">入场</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-blue-500/60" />
                    <span className="text-slate-500">出场</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm font-medium">车型占比</span>
                </div>
                <div className="space-y-2">
                  {typeDistribution.map((item) => (
                    <div key={item.type} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{vehicleTypeNames[item.type as VehicleType]}</span>
                        <span className="text-white font-medium">
                          {item.count} 辆
                          <span className="text-slate-500 text-xs ml-1">({item.percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="divide-y divide-slate-700/30">
              {todayRecords.map((record) => (
                <div key={record.id} className="p-3 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-mono">{record.plateNumber}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        record.direction === 'in'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {record.direction === 'in' ? '入场' : '出场'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {record.gateName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {record.timestamp.split(' ')[1]}
                    </div>
                    <span>{vehicleTypeNames[record.vehicleType]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'roads' && (
            <div className="p-3 space-y-2">
              {congestedRoads.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">拥堵路段提醒</span>
                  </div>
                  <p className="text-xs text-red-400/70">
                    当前有 {congestedRoads.length} 条道路处于拥堵状态
                  </p>
                </div>
              )}

              {roadSegments.map((road: RoadSegment) => {
                const color = congestionColors[road.congestionLevel];
                const label = congestionLabels[road.congestionLevel];
                const isSelected = selectedRoadId === road.id;

                return (
                  <div
                    key={road.id}
                    onClick={() => selectRoad(isSelected ? null : road.id)}
                    className={`rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white text-sm font-medium">{road.name}</h4>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs" style={{ color }}>
                            {label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-white font-medium">{road.currentSpeed}</div>
                          <div className="text-slate-500">km/h</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-medium">{road.vehicleCount}</div>
                          <div className="text-slate-500">车辆数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-medium">{road.lanes}</div>
                          <div className="text-slate-500">车道</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <div className="text-xs text-slate-500 mb-2">道路信息</div>
                          <div className="space-y-1 text-xs text-slate-400">
                            <div>全长：{road.length}m</div>
                            <div>限速：{road.lanes * 20}km/h</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {activeTab === 'overview' && stats && (
          <div className="p-4 border-t border-slate-700/50">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-white font-bold">{stats.totalIn + stats.totalOut}</div>
                <div className="text-slate-500 text-xs">总通行量</div>
              </div>
              <div>
                <div className="text-cyan-400 font-bold">
                  {((stats.totalIn + stats.totalOut) / 24).toFixed(1)}
                </div>
                <div className="text-slate-500 text-xs">小时均</div>
              </div>
              <div>
                <div className="text-amber-400 font-bold">{congestedRoads.length}</div>
                <div className="text-slate-500 text-xs">拥堵路段</div>
              </div>
              <div>
                <div className="text-green-400 font-bold">
                  {roadSegments.filter((r) => r.congestionLevel === 'low').length}
                </div>
                <div className="text-slate-500 text-xs">畅通路段</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
