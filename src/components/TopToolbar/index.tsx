import { Search, Maximize2, Camera, RotateCcw, ZoomIn, ZoomOut, Share2, Download } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';
import { useState } from 'react';

export function TopToolbar() {
  const searchQuery = useSceneStore((s) => s.searchQuery);
  const setSearchQuery = useSceneStore((s) => s.setSearchQuery);
  const setActivePanel = useSceneStore((s) => s.setActivePanel);
  const resetView = useSceneStore((s) => s.resetView);
  const zoomIn = useSceneStore((s) => s.zoomIn);
  const zoomOut = useSceneStore((s) => s.zoomOut);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `mall-3d-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleResetView = () => {
    resetView();
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md ml-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索店铺、品牌、设施..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setActivePanel('search')}
              className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              ⌘K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-1 flex items-center gap-1">
            <button
              onClick={handleResetView}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="重置视角"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={zoomIn}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="放大"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="缩小"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-700/50 p-1 flex items-center gap-1">
            <button
              onClick={handleExport}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="导出图片"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="分享"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              title="全屏"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>
    </div>
  );
}
