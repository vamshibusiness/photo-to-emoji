import React from 'react';
import { History, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { ProcessingSettings } from '../worker';

export interface HistoryItem {
    id: string;
    timestamp: number;
    mode: 'image' | 'text' | 'dot';
    settings: ProcessingSettings;
    thumbnail?: string; // Base64 or ObjectURL of the output
}

interface HistoryPanelProps {
    items: HistoryItem[];
    onRestore: (item: HistoryItem) => void;
    onClear: () => void;
    onRemoveItem: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    items,
    onRestore,
    onClear,
    onRemoveItem
}) => {
    if (items.length === 0) return null;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-black text-[#1a1a1a] dark:text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                    <History className="w-3 h-3 text-blue-600" />
                    <span>Studio History</span>
                </div>
                <button
                    onClick={onClear}
                    className="text-[8px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-3 flex items-center space-x-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        onClick={() => onRestore(item)}
                    >
                        {/* Thumbnail or Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-black flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-800">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} alt="History Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-blue-500/30">
                                    <Clock size={20} />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                                    {item.mode} Mode
                                </span>
                                <span className="text-[8px] font-bold text-gray-400 tabular-nums">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-900 dark:text-gray-200 truncate">
                                Density: {item.settings.density}px • Quality: {item.settings.quality}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveItem(item.id);
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                            <div className="p-2 text-blue-600">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPanel;
