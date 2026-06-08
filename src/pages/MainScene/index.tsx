import { useEffect } from 'react';
import { Scene } from '@/three/Scene';
import { Sidebar } from '@/components/Sidebar';
import { TopToolbar } from '@/components/TopToolbar';
import { FloorSwitcher } from '@/components/FloorSwitcher';
import { StatusBar } from '@/components/StatusBar';
import { NavPanel } from '@/components/NavPanel';
import { ShopPanel } from '@/components/ShopPanel';
import { ShopDetailPanel } from '@/components/ShopDetailPanel';
import { HeatmapControlPanel } from '@/components/HeatmapControlPanel';
import { PatrolPanel } from '@/components/PatrolPanel';
import { LayersPanel } from '@/components/LayersPanel';
import { useSceneStore } from '@/store/useSceneStore';

export default function MainScene() {
  const activePanel = useSceneStore((s) => s.activePanel);
  const isSidebarCollapsed = useSceneStore((s) => s.isSidebarCollapsed);
  const selectedShopId = useSceneStore((s) => {
    // @ts-ignore
    return useSceneStore.getState?.()?.selectedShopId;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        useSceneStore.getState().setActivePanel('none');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useSceneStore.getState().setActivePanel('search');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <Scene />
      </div>

      <Sidebar />
      <TopToolbar />
      <FloorSwitcher />
      <StatusBar />

      {activePanel === 'nav' && <NavPanel />}
      {activePanel === 'shops' && <ShopPanel />}
      {activePanel === 'heatmap' && <HeatmapControlPanel />}
      {activePanel === 'patrol' && <PatrolPanel />}
      {activePanel === 'layers' && <LayersPanel />}

      <ShopDetailPanel />
    </div>
  );
}
