import {
  Layers,
  Store,
  ArrowUpDown,
  Building2,
  Users,
  Flame,
  Camera,
  DoorOpen,
  Zap,
  Info,
  Wallet,
} from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';

interface LayerItem {
  key: string;
  label: string;
  icon: typeof Store;
  color: string;
}

const layers: LayerItem[] = [
  { key: 'shops', label: '商铺', icon: Store, color: '#f59e0b' },
  { key: 'escalators', label: '自动扶梯', icon: ArrowUpDown, color: '#8b5cf6' },
  { key: 'elevators', label: '电梯', icon: Building2, color: '#3b82f6' },
  { key: 'toilets', label: '卫生间', icon: Users, color: '#10b981' },
  { key: 'fireEquipment', label: '消防设施', icon: Flame, color: '#ef4444' },
  { key: 'cameras', label: '监控点位', icon: Camera, color: '#06b6d4' },
  { key: 'exits', label: '安全出口', icon: DoorOpen, color: '#22c55e' },
  { key: 'electric', label: '电力设施', icon: Zap, color: '#f97316' },
  { key: 'services', label: '服务设施', icon: Info, color: '#ec4899' },
  { key: 'atm', label: 'ATM机', icon: Wallet, color: '#14b8a6' },
];

export function LayersPanel() {
  const visibleLayers = useSceneStore((s) => s.visibleLayers);
  const toggleLayer = useSceneStore((s) => s.toggleLayer);

  return (
    <div className="absolute left-16 top-20 z-10 w-64">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">图层管理</h3>
              <p className="text-slate-500 text-xs">控制场景元素显隐</p>
            </div>
          </div>
        </div>

        <div className="p-3 space-y-1">
          {layers.map((layer) => {
            const Icon = layer.icon;
            const isVisible = visibleLayers.includes(layer.key);
            return (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isVisible
                    ? 'bg-slate-800/80 text-white'
                    : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isVisible ? 'opacity-100' : 'opacity-40'
                  }`}
                  style={{ backgroundColor: `${layer.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: layer.color }} />
                </div>
                <span className="text-sm flex-1 text-left">{layer.label}</span>
                <div
                  className={`w-10 h-6 rounded-full relative transition-all ${
                    isVisible ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      isVisible ? 'left-5' : 'left-1'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-700/50 flex gap-2">
          <button
            onClick={() => {
              layers.forEach((l) => {
                if (!visibleLayers.includes(l.key)) {
                  toggleLayer(l.key);
                }
              });
            }}
            className="flex-1 py-2 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            全部显示
          </button>
          <button
            onClick={() => {
              visibleLayers.forEach((l) => {
                if (l !== 'shops') {
                  toggleLayer(l);
                }
              });
            }}
            className="flex-1 py-2 text-xs text-slate-400 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            仅商铺
          </button>
        </div>
      </div>
    </div>
  );
}
