import { useState } from 'react';
import {
  Navigation,
  MapPin,
  X,
  ArrowRight,
  Clock,
  Footprints,
  Layers,
  ArrowLeftRight,
  Play,
  Square,
} from 'lucide-react';
import { useNavStore } from '@/store/useNavStore';
import { navNodes, getNodesByFloor } from '@/data/navigation';
import { floors } from '@/data/floors';
import { findNearestNode } from '@/utils/pathfinding';
import type { NavNode } from '@/types';

export function NavPanel() {
  const {
    startPoint,
    endPoint,
    route,
    isNavActive,
    setStartPoint,
    setEndPoint,
    startNavigation,
    stopNavigation,
    swapPoints,
    clearRoute,
  } = useNavStore();

  const [startFloor, setStartFloor] = useState('f1');
  const [endFloor, setEndFloor] = useState('f1');
  const [searchStart, setSearchStart] = useState('');
  const [searchEnd, setSearchEnd] = useState('');

  const startNodes = getNodesByFloor(startFloor).filter(
    (n) => !searchStart || n.name?.toLowerCase().includes(searchStart.toLowerCase())
  );
  const endNodes = getNodesByFloor(endFloor).filter(
    (n) => !searchEnd || n.name?.toLowerCase().includes(searchEnd.toLowerCase())
  );

  const handleSelectStart = (node: NavNode) => {
    setStartPoint(node);
  };

  const handleSelectEnd = (node: NavNode) => {
    setEndPoint(node);
  };

  const typeLabels: Record<string, string> = {
    walkway: '通道',
    escalator: '扶梯',
    elevator: '电梯',
    entrance: '入口',
    shop: '店铺',
  };

  return (
    <div className="absolute left-16 top-20 bottom-16 z-10 w-80">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">智能导航</h3>
              <p className="text-slate-500 text-xs">室内外一体化路径规划</p>
            </div>
          </div>
          <button
            onClick={clearRoute}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-slate-400 text-sm">起点</span>
              </div>
              <select
                value={startFloor}
                onChange={(e) => setStartFloor(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="搜索位置..."
                value={searchStart}
                onChange={(e) => setSearchStart(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <div className="max-h-32 overflow-y-auto space-y-1">
                {startNodes.slice(0, 8).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleSelectStart(node)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      startPoint?.id === node.id
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{node.name || `节点 ${node.id}`}</span>
                      <span className="text-xs text-slate-500 ml-auto">
                        {typeLabels[node.type]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapPoints}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-slate-400 text-sm">终点</span>
              </div>
              <select
                value={endFloor}
                onChange={(e) => setEndFloor(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                {floors.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="搜索位置..."
                value={searchEnd}
                onChange={(e) => setSearchEnd(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <div className="max-h-32 overflow-y-auto space-y-1">
                {endNodes.slice(0, 8).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleSelectEnd(node)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      endPoint?.id === node.id
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{node.name || `节点 ${node.id}`}</span>
                      <span className="text-xs text-slate-500 ml-auto">
                        {typeLabels[node.type]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {route && (
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-medium text-sm">路径已规划</span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Layers className="w-3 h-3" />
                  <span>途经 {route.floorTransitions.length} 次换乘</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Footprints className="w-3 h-3" />
                    距离
                  </div>
                  <div className="text-white font-bold">
                    {route.totalDistance} <span className="text-sm font-normal text-slate-400">米</span>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    预计时间
                  </div>
                  <div className="text-white font-bold">
                    约 {route.estimatedTime} <span className="text-sm font-normal text-slate-400">分钟</span>
                  </div>
                </div>
              </div>

              {route.floorTransitions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">换乘提示</div>
                  {route.floorTransitions.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm bg-slate-900/50 rounded-lg px-3 py-2"
                    >
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                          t.type === 'elevator'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {t.type === 'elevator' ? '梯' : '扶'}
                      </div>
                      <span className="text-slate-300">
                        {floors.find((f) => f.id === t.from)?.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-300">
                        {floors.find((f) => f.id === t.to)?.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={isNavActive ? stopNavigation : startNavigation}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  isNavActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 text-white'
                }`}
              >
                {isNavActive ? (
                  <>
                    <Square className="w-4 h-4" />
                    结束导航
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    开始导航
                  </>
                )}
              </button>
            </div>
          )}

          {!route && startPoint && endPoint && (
            <div className="text-center py-4 text-slate-500 text-sm">
              未找到可用路径，请尝试其他起终点
            </div>
          )}

          {!startPoint && !endPoint && (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Navigation className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>请选择起点和终点</p>
              <p className="text-xs mt-1">支持跨楼层导航</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
