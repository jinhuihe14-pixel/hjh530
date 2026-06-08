import { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar,
  Tag,
  Flag,
  Phone,
} from 'lucide-react';
import { useAnnotationStore } from '@/store/useAnnotationStore';
import {
  annotationCategoryNames,
  annotationStatusNames,
  annotationPriorityNames,
  annotationCategoryColors,
  annotationPriorityColors,
} from '@/data/annotations';
import type { AnnotationCategory, AnnotationPriority } from '@/types';

export function AnnotationPanel() {
  const {
    annotations,
    selectedAnnotationId,
    selectAnnotation,
    filterCategory,
    filterPriority,
    searchQuery,
    setFilterCategory,
    setFilterPriority,
    setSearchQuery,
    getFilteredAnnotations,
    getStatistics,
    updateStatus,
    resolveAnnotation,
    isAddAnnotationMode,
    setIsAddAnnotationMode,
  } = useAnnotationStore();

  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'processing' | 'resolved'>('all');

  const stats = getStatistics();
  const displayAnnotations = getFilteredAnnotations().filter((a) => {
    if (activeTab === 'open') return a.status === 'open';
    if (activeTab === 'processing') return a.status === 'processing';
    if (activeTab === 'resolved') return a.status === 'resolved';
    return true;
  });

  const selectedAnnotation = annotations.find((a) => a.id === selectedAnnotationId);

  const categories: AnnotationCategory[] = [
    'illegal_parking',
    'road_damage',
    'obstacle',
    'garbage',
    'facility_damage',
    'other',
  ];
  const priorities: AnnotationPriority[] = ['low', 'medium', 'high', 'urgent'];

  return (
    <div className="absolute left-16 top-20 bottom-16 z-10 w-80">
      <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">区域标注</h3>
                <p className="text-slate-500 text-xs">共 {stats.total} 条标注记录</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddAnnotationMode(!isAddAnnotationMode)}
              className={`p-2 rounded-lg transition-colors ${
                isAddAnnotationMode
                  ? 'bg-purple-500/30 text-purple-400'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="搜索标题、描述、上报人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
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
              onClick={() => setActiveTab('open')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'open' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              待处理
              <span className="text-red-400">{stats.open}</span>
            </button>
            <button
              onClick={() => setActiveTab('processing')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'processing'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              处理中
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              已解决
            </button>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-slate-700/50">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Filter className="w-3 h-3" />
            <span>筛选条件</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
          </button>

          {showFilters && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1.5">问题分类</div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    const color = annotationCategoryColors[cat];
                    const isActive = filterCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(isActive ? null : cat)}
                        className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                          isActive ? 'border-current' : 'bg-slate-800 border-transparent hover:text-white'
                        }`}
                        style={{
                          backgroundColor: isActive ? `${color}20` : undefined,
                          color: isActive ? color : undefined,
                        }}
                      >
                        {annotationCategoryNames[cat]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1.5">优先级</div>
                <div className="flex flex-wrap gap-1.5">
                  {priorities.map((p) => {
                    const color = annotationPriorityColors[p];
                    const isActive = filterPriority === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setFilterPriority(isActive ? null : p)}
                        className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                          isActive ? 'border-current' : 'bg-slate-800 border-transparent hover:text-white'
                        }`}
                        style={{
                          backgroundColor: isActive ? `${color}20` : undefined,
                          color: isActive ? color : undefined,
                        }}
                      >
                        {annotationPriorityNames[p]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {isAddAnnotationMode && (
          <div className="p-3 bg-purple-500/10 border-b border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">点击地图添加标注</span>
            </div>
            <p className="text-purple-400/70 text-xs">
              在3D场景中点击任意位置添加问题标注
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {displayAnnotations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p>没有找到符合条件的标注</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {displayAnnotations.map((annotation) => {
                const categoryColor = annotationCategoryColors[annotation.category];
                const priorityColor = annotationPriorityColors[annotation.priority];
                const isSelected = selectedAnnotationId === annotation.id;

                const StatusIcon =
                  annotation.status === 'resolved'
                    ? CheckCircle
                    : annotation.status === 'processing'
                    ? Clock
                    : AlertTriangle;
                const statusColor =
                  annotation.status === 'resolved'
                    ? 'text-green-400'
                    : annotation.status === 'processing'
                    ? 'text-blue-400'
                    : 'text-red-400';

                return (
                  <button
                    key={annotation.id}
                    onClick={() => selectAnnotation(isSelected ? null : annotation.id)}
                    className={`w-full p-3 text-left transition-colors ${
                      isSelected ? 'bg-purple-500/10' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: `${categoryColor}20` }}
                      >
                        <MapPin className="w-5 h-5" style={{ color: categoryColor }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white text-sm font-medium truncate">
                            {annotation.title}
                          </h4>
                          <div className={`flex items-center gap-1 ${statusColor}`}>
                            <StatusIcon className="w-3 h-3" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                          >
                            {annotationCategoryNames[annotation.category]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flag className="w-3 h-3" style={{ color: priorityColor }} />
                            {annotationPriorityNames[annotation.priority]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span>{annotation.reporter}</span>
                          <span>·</span>
                          <Clock className="w-3 h-3" />
                          <span>{annotation.createdAt.split(' ')[0]}</span>
                        </div>

                        {annotation.tags && annotation.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {annotation.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 text-xs text-slate-500 bg-slate-800/50 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
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
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-red-500/10 rounded-lg p-2">
              <div className="text-red-400 font-bold">{stats.open}</div>
              <div className="text-red-400/70 text-xs">待处理</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-2">
              <div className="text-blue-400 font-bold">{stats.processing}</div>
              <div className="text-blue-400/70 text-xs">处理中</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-2">
              <div className="text-green-400 font-bold">{stats.resolved}</div>
              <div className="text-green-400/70 text-xs">已解决</div>
            </div>
          </div>
        </div>
      </div>

      {selectedAnnotation && (
        <div className="absolute left-full top-0 ml-3 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden z-20">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-bold">标注详情</h4>
              <button
                onClick={() => selectAnnotation(null)}
                className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">{selectedAnnotation.title}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: `${annotationCategoryColors[selectedAnnotation.category]}20`,
                    color: annotationCategoryColors[selectedAnnotation.category],
                  }}
                >
                  {annotationCategoryNames[selectedAnnotation.category]}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs flex items-center gap-1"
                  style={{
                    backgroundColor: `${annotationPriorityColors[selectedAnnotation.priority]}20`,
                    color: annotationPriorityColors[selectedAnnotation.priority],
                  }}
                >
                  <Flag className="w-3 h-3" />
                  {annotationPriorityNames[selectedAnnotation.priority]}优先级
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    selectedAnnotation.status === 'resolved'
                      ? 'bg-green-500/20 text-green-400'
                      : selectedAnnotation.status === 'processing'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {annotationStatusNames[selectedAnnotation.status]}
                </span>
              </div>
              <p className="text-slate-400 text-sm">{selectedAnnotation.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">上报人：</span>
                <span className="text-white">{selectedAnnotation.reporter}</span>
              </div>
              {selectedAnnotation.reporterPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">联系电话：</span>
                  <span className="text-white">{selectedAnnotation.reporterPhone}</span>
                </div>
              )}
              {selectedAnnotation.assignee && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">处理人：</span>
                  <span className="text-white">{selectedAnnotation.assignee}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">上报时间：</span>
                <span className="text-white text-xs">{selectedAnnotation.createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">更新时间：</span>
                <span className="text-white text-xs">{selectedAnnotation.updatedAt}</span>
              </div>
              {selectedAnnotation.resolvedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-slate-400">解决时间：</span>
                  <span className="text-green-400 text-xs">{selectedAnnotation.resolvedAt}</span>
                </div>
              )}
            </div>

            {selectedAnnotation.tags && selectedAnnotation.tags.length > 0 && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="text-slate-400 text-xs mb-2">标签</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAnnotation.tags.map((tag, idx) => (
                    <Tag key={idx} className="w-3 h-3 text-slate-500" />
                  ))}
                  {selectedAnnotation.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs text-slate-400 bg-slate-800/50 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">位置坐标：</span>
                <span className="text-white text-xs">
                  ({selectedAnnotation.position.x.toFixed(1)},{' '}
                  {selectedAnnotation.position.z.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-700/50">
            {selectedAnnotation.status !== 'resolved' ? (
              <div className="grid grid-cols-2 gap-2">
                {selectedAnnotation.status === 'open' && (
                  <button
                    onClick={() => updateStatus(selectedAnnotation.id, 'processing')}
                    className="py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    开始处理
                  </button>
                )}
                <button
                  onClick={() => resolveAnnotation(selectedAnnotation.id)}
                  className="py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                >
                  标记解决
                </button>
                <button className="py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                  定位查看
                </button>
                <button className="py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                  编辑
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateStatus(selectedAnnotation.id, 'open')}
                  className="py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30 transition-colors"
                >
                  重新打开
                </button>
                <button className="py-2 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                  定位查看
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
