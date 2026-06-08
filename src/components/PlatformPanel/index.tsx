import { useState } from 'react';
import {
  Truck,
  Clock,
  Calendar,
  User,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Bell,
  MapPin,
  Tag,
  Square,
} from 'lucide-react';
import { usePlatformStore } from '@/store/usePlatformStore';
import { platformStatusNames, platformStatusColors } from '@/data/platforms';

export function PlatformPanel() {
  const {
    platforms,
    selectedPlatformId,
    selectPlatform,
    activeTab,
    setActiveTab,
    getFilteredPlatforms,
    getOvertimePlatforms,
    getUpcomingReservations,
    getStatistics,
    releasePlatform,
  } = usePlatformStore();

  const [showReminders, setShowReminders] = useState(true);

  const displayPlatforms = getFilteredPlatforms();
  const stats = getStatistics();
  const overtimePlatforms = getOvertimePlatforms();
  const upcomingReservations = getUpcomingReservations();
  const selectedPlatform = platforms.find((p) => p.id === selectedPlatformId);

  const formatRemainingTime = (minutes?: number) => {
    if (minutes === undefined) return '--';
    if (minutes < 0) {
      return `超时 ${Math.abs(minutes)} 分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  return (
    <div className="absolute left-16 top-20 bottom-16 z-10 w-80">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">月台管理</h3>
                <p className="text-slate-500 text-xs">共 {stats.total} 个装卸月台</p>
              </div>
            </div>
            <button
              onClick={() => setShowReminders(!showReminders)}
              className={`p-2 rounded-lg transition-colors relative ${
                showReminders ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
              }`}
            >
              <Bell className="w-4 h-4" />
              {overtimePlatforms.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {overtimePlatforms.length}
                </span>
              )}
            </button>
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
              onClick={() => setActiveTab('occupied')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'occupied' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              使用中
            </button>
            <button
              onClick={() => setActiveTab('reserved')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'reserved' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              已预约
            </button>
            <button
              onClick={() => setActiveTab('overtime')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'overtime' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              超时
              {overtimePlatforms.length > 0 && (
                <span className="text-red-400">{overtimePlatforms.length}</span>
              )}
            </button>
          </div>
        </div>

        {showReminders && (overtimePlatforms.length > 0 || upcomingReservations.length > 0) && (
          <div className="p-3 border-b border-slate-700/50 space-y-2">
            {overtimePlatforms.map((p) => (
              <div
                key={`reminder-${p.id}`}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-red-400 text-xs font-medium">{p.name} 超时占用</div>
                  <div className="text-red-400/70 text-xs">
                    {p.currentPlateNumber} · {formatRemainingTime(p.remainingTime)}
                  </div>
                </div>
                <button
                  onClick={() => selectPlatform(p.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  查看
                </button>
              </div>
            ))}
            {upcomingReservations.map((p) => (
              <div
                key={`upcoming-${p.id}`}
                className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-amber-400 text-xs font-medium">{p.name} 即将到预约时间</div>
                  <div className="text-amber-400/70 text-xs">
                    {p.reservedBy} · {p.reservedFrom?.split(' ')[1]}
                  </div>
                </div>
                <button
                  onClick={() => selectPlatform(p.id)}
                  className="text-xs text-amber-400 hover:text-amber-300"
                >
                  查看
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {displayPlatforms.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <Truck className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>没有符合条件的月台</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {displayPlatforms.map((platform) => {
                const color = platformStatusColors[platform.status];
                const isSelected = selectedPlatformId === platform.id;

                return (
                  <button
                    key={platform.id}
                    onClick={() => selectPlatform(isSelected ? null : platform.id)}
                    className={`w-full p-3 text-left transition-colors ${
                      isSelected ? 'bg-amber-500/10' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Truck className="w-5 h-5" style={{ color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-sm font-medium">{platform.name}</h4>
                          <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            {platformStatusNames[platform.status]}
                          </span>
                        </div>

                        {platform.currentPlateNumber && (
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <Tag className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-400 font-mono">
                              {platform.currentPlateNumber}
                            </span>
                          </div>
                        )}

                        {platform.reservedBy && (
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-400">{platform.reservedBy}</span>
                          </div>
                        )}

                        {platform.remainingTime !== undefined && platform.status === 'occupied' && (
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <Clock
                              className={`w-3 h-3 ${
                                platform.remainingTime < 0 ? 'text-red-400' : 'text-slate-500'
                              }`}
                            />
                            <span
                              className={
                                platform.remainingTime < 0 ? 'text-red-400' : 'text-slate-400'
                              }
                            >
                              剩余 {formatRemainingTime(platform.remainingTime)}
                            </span>
                          </div>
                        )}

                        {platform.notes && (
                          <div className="mt-1 text-xs text-slate-500 truncate">{platform.notes}</div>
                        )}
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
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-green-500/10 rounded-lg p-2">
              <div className="text-green-400 font-bold text-lg">{stats.idle}</div>
              <div className="text-green-400/70 text-xs">空闲</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-2">
              <div className="text-blue-400 font-bold text-lg">{stats.occupied}</div>
              <div className="text-blue-400/70 text-xs">使用中</div>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-2">
              <div className="text-amber-400 font-bold text-lg">{stats.reserved}</div>
              <div className="text-amber-400/70 text-xs">预约</div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-2">
              <div className="text-red-400 font-bold text-lg">{stats.overtime}</div>
              <div className="text-red-400/70 text-xs">超时</div>
            </div>
          </div>
        </div>
      </div>

      {selectedPlatform && (
        <div className="absolute left-full top-0 ml-3 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden z-20">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-bold">{selectedPlatform.name}</h4>
              <button
                onClick={() => selectPlatform(null)}
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
                style={{ backgroundColor: `${platformStatusColors[selectedPlatform.status]}20` }}
              >
                <Truck
                  className="w-7 h-7"
                  style={{ color: platformStatusColors[selectedPlatform.status] }}
                />
              </div>
              <div>
                <span
                  className="text-sm px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${platformStatusColors[selectedPlatform.status]}20`,
                    color: platformStatusColors[selectedPlatform.status],
                  }}
                >
                  {platformStatusNames[selectedPlatform.status]}
                </span>
                <div className="text-slate-500 text-sm mt-1">
                  {selectedPlatform.type === 'loading'
                    ? '装货月台'
                    : selectedPlatform.type === 'unloading'
                    ? '卸货月台'
                    : '装卸两用'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {selectedPlatform.currentPlateNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">当前车辆：</span>
                  <span className="text-white font-mono">{selectedPlatform.currentPlateNumber}</span>
                </div>
              )}
              {selectedPlatform.occupiedSince && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">占用时间：</span>
                  <span className="text-white">{selectedPlatform.occupiedSince}</span>
                </div>
              )}
              {selectedPlatform.remainingTime !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock
                    className={`w-4 h-4 ${
                      selectedPlatform.remainingTime < 0 ? 'text-red-400' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-slate-400">剩余时长：</span>
                  <span
                    className={selectedPlatform.remainingTime < 0 ? 'text-red-400' : 'text-white'}
                  >
                    {formatRemainingTime(selectedPlatform.remainingTime)}
                  </span>
                </div>
              )}
              {selectedPlatform.reservedBy && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">预约人：</span>
                  <span className="text-white">{selectedPlatform.reservedBy}</span>
                </div>
              )}
              {selectedPlatform.reservedFrom && selectedPlatform.reservedTo && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">预约时段：</span>
                  <span className="text-white text-xs">
                    {selectedPlatform.reservedFrom.split(' ')[1]} -{' '}
                    {selectedPlatform.reservedTo.split(' ')[1]}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">最长时长：</span>
                <span className="text-white">{selectedPlatform.maxDuration} 分钟</span>
              </div>
            </div>

            {selectedPlatform.notes && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="text-slate-400 text-xs mb-1">备注</div>
                <p className="text-slate-300 text-sm">{selectedPlatform.notes}</p>
              </div>
            )}

            {selectedPlatform.position && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">位置：</span>
                  <span className="text-white text-xs">
                    ({selectedPlatform.position.x.toFixed(1)}, {selectedPlatform.position.z.toFixed(1)})
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-700/50">
            {selectedPlatform.status === 'occupied' || selectedPlatform.status === 'overtime' ? (
              <button
                onClick={() => releasePlatform(selectedPlatform.id)}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4" />
                释放月台
              </button>
            ) : selectedPlatform.status === 'idle' ? (
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
                  预约月台
                </button>
                <button className="py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                  开始使用
                </button>
              </div>
            ) : (
              <button className="w-full py-2 bg-slate-700/50 text-slate-400 rounded-lg text-sm cursor-not-allowed">
                维护中
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
