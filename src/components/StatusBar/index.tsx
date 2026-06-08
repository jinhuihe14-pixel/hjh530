import { MapPin, Ruler, Clock, Wifi, Users, Building2 } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';
import { floors } from '@/data/floors';
import { shops } from '@/data/shops';
import { useEffect, useState } from 'react';

export function StatusBar() {
  const currentFloor = useSceneStore((s) => s.currentFloor);
  const isHeatmapVisible = useSceneStore((s) => s.isHeatmapVisible);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const floor = floors.find((f) => f.id === currentFloor);
  const floorShops = shops.filter((s) => s.floorId === currentFloor);
  const vacantShops = floorShops.filter((s) => s.status === 'vacant');

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      <div className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>当前楼层：</span>
              <span className="text-white font-medium">{floor?.name || '-'}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Users className="w-4 h-4 text-green-400" />
              <span>商铺：</span>
              <span className="text-white">{floorShops.length}</span>
              <span className="text-slate-500">/</span>
              <span className="text-amber-400">空置 {vacantShops.length}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>坐标：</span>
              <span className="text-white font-mono text-xs">
                (0.00, 0.00, 0.00)
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Ruler className="w-4 h-4 text-purple-400" />
              <span>比例尺：</span>
              <span className="text-white text-xs">1 : 100</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Wifi className={`w-4 h-4 ${fps > 50 ? 'text-green-400' : fps > 30 ? 'text-amber-400' : 'text-red-400'}`} />
              <span>FPS：</span>
              <span className={`font-mono ${fps > 50 ? 'text-green-400' : fps > 30 ? 'text-amber-400' : 'text-red-400'}`}>
                {fps}
              </span>
            </div>

            {isHeatmapVisible && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400">热力图已开启</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-mono">
                {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
