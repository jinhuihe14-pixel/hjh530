import {
  Map,
  Navigation,
  Store,
  Thermometer,
  Shield,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';
import type { ActivePanel } from '@/types';

interface SidebarItem {
  id: ActivePanel;
  icon: typeof Map;
  label: string;
  color?: string;
}

const items: SidebarItem[] = [
  { id: 'search', icon: Search, label: '搜索' },
  { id: 'nav', icon: Navigation, label: '智能导航', color: '#00D4FF' },
  { id: 'shops', icon: Store, label: '业态铺位', color: '#f59e0b' },
  { id: 'heatmap', icon: Thermometer, label: '人流热力', color: '#ef4444' },
  { id: 'patrol', icon: Shield, label: '设施巡检', color: '#22c55e' },
  { id: 'layers', icon: Layers, label: '图层管理' },
  { id: 'none', icon: Settings, label: '设置' },
];

export function Sidebar() {
  const activePanel = useSceneStore((s) => s.activePanel);
  const setActivePanel = useSceneStore((s) => s.setActivePanel);
  const isCollapsed = useSceneStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useSceneStore((s) => s.toggleSidebar);

  return (
    <div
      className={`absolute left-0 top-0 h-full z-20 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="h-full bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">智慧商管</div>
                <div className="text-slate-500 text-xs">3D可视化平台</div>
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: isActive && item.color ? item.color : undefined }}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: item.color || '#00D4FF' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="p-3 border-t border-slate-700/50">
            <div className="text-xs text-slate-500 text-center">
              v1.0.0 · © 2025
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
