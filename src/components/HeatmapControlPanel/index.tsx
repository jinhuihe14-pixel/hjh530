import { Thermometer, X, Clock, Users, Zap } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';
import { useState } from 'react';

export function HeatmapControlPanel() {
  const isHeatmapVisible = useSceneStore((s) => s.isHeatmapVisible);
  const toggleHeatmap = useSceneStore((s) => s.toggleHeatmap);
  const [intensity, setIntensity] = useState(50);
  const [timeIndex, setTimeIndex] = useState(12);

  const timeLabels = [];
  for (let i = 0; i < 24; i++) {
    timeLabels.push(`${i.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="absolute left-16 top-20 z-10 w-72">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">人流热力图</h3>
              <p className="text-slate-500 text-xs">实时客流分布</p>
            </div>
          </div>
          {isHeatmapVisible && (
            <span className="flex items-center gap-1.5 text-xs text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              实时
            </span>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">热力图开关</span>
            <button
              onClick={toggleHeatmap}
              className={`w-12 h-6 rounded-full relative transition-all ${
                isHeatmapVisible ? 'bg-red-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  isHeatmapVisible ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">热力强度</span>
              <span className="text-white text-sm font-mono">{intensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              disabled={!isHeatmapVisible}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>时间轴</span>
            </div>
            <div className="relative h-12 bg-slate-800/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center px-2">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-6 mx-px rounded"
                    style={{
                      background: `linear-gradient(to top, #ef4444, #f59e0b, #22c55e)`,
                      opacity: 0.3 + Math.abs(i - 6) * 0.1,
                      height: `${20 + Math.sin(i * 0.8) * 15}px`,
                    }}
                  />
                ))}
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white"
                style={{ left: `${(timeIndex / 24) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>00:00</span>
              <span className="text-cyan-400 font-medium">{timeLabels[timeIndex]}</span>
              <span>24:00</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <Users className="w-4 h-4 mx-auto mb-1 text-green-400" />
              <div className="text-white font-bold text-sm">12,847</div>
              <div className="text-slate-500 text-xs">当前客流</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              <div className="text-white font-bold text-sm">F1</div>
              <div className="text-slate-500 text-xs">最热楼层</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <Thermometer className="w-4 h-4 mx-auto mb-1 text-red-400" />
              <div className="text-white font-bold text-sm">87%</div>
              <div className="text-slate-500 text-xs">高峰指数</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">热力图例</div>
            <div
              className="h-3 rounded-full"
              style={{
                background: 'linear-gradient(to right, #3b82f6, #22c55e, #eab308, #ef4444, #dc2626)',
              }}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>低密度</span>
              <span>中密度</span>
              <span>高密度</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
