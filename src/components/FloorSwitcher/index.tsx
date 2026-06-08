import { floors } from '@/data/floors';
import { useSceneStore } from '@/store/useSceneStore';
import { ChevronUp, ChevronDown, Layers, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function FloorSwitcher() {
  const currentFloor = useSceneStore((s) => s.currentFloor);
  const visibleFloors = useSceneStore((s) => s.visibleFloors);
  const setCurrentFloor = useSceneStore((s) => s.setCurrentFloor);
  const toggleFloor = useSceneStore((s) => s.toggleFloor);
  const showAllFloors = useSceneStore((s) => s.showAllFloors);
  const showSingleFloor = useSceneStore((s) => s.showSingleFloor);
  const [expanded, setExpanded] = useState(true);

  const sortedFloors = [...floors].sort((a, b) => b.level - a.level);

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-3 py-2 bg-slate-800/50 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 hover:bg-slate-700/50 transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>楼层</span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {expanded && (
          <div className="p-2 space-y-1">
            {sortedFloors.map((floor) => {
              const isActive = currentFloor === floor.id;
              const isVisible = visibleFloors.includes(floor.id);

              return (
                <div
                  key={floor.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/20 border border-cyan-500/50'
                      : 'hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFloor(floor.id);
                    }}
                    className={`p-1 rounded transition-colors ${
                      isVisible ? 'text-cyan-400' : 'text-slate-600'
                    }`}
                  >
                    {isVisible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentFloor(floor.id);
                      showSingleFloor(floor.id);
                    }}
                    className={`flex-1 text-left text-sm font-medium ${
                      isActive ? 'text-cyan-400' : 'text-slate-300'
                    }`}
                  >
                    {floor.name}
                  </button>

                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {expanded && (
          <div className="p-2 border-t border-slate-700/50 space-y-1">
            <button
              onClick={showAllFloors}
              className="w-full px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-3 h-3" />
              显示全部
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
