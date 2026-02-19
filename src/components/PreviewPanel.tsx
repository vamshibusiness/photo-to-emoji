import React from 'react';
import { Loader2, Sparkles, Play } from 'lucide-react';
import { UploadSection } from './UploadSection';

interface PreviewPanelProps {
    file: File | null;
    originalImage: string | null;
    isProcessing: boolean;
    progress: number;
    hasResult: boolean;
    onImageSelected: (file: File) => void;
    onGenerate: () => void;
    onCancel: () => void;
    children: React.ReactNode;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    file,
    originalImage,
    isProcessing,
    progress,
    hasResult,
    onImageSelected,
    onGenerate,
    onCancel,
    children
}) => {
    return (
        <div className="flex-1 glass-panel rounded-[2.5rem] p-4 overflow-hidden relative border-2 border-white/20 dark:border-gray-800 flex flex-col min-h-[500px] transition-all duration-500">
            {!file ? (
                <UploadSection onImageSelected={onImageSelected} />
            ) : (
                <div
                    className="flex-1 flex flex-col relative group overflow-hidden"
                >
                    {/* Main Content Area */}
                    <div className="flex-1 rounded-[2rem] overflow-hidden relative transition-colors duration-500 bg-white dark:bg-gray-950">
                        {children}

                        {/* Loading/Progress Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-white/40 dark:bg-gray-950/40 backdrop-blur-[2px] animate-in fade-in duration-500">
                                <div className="w-full max-w-sm px-8 space-y-4 text-center bg-white/80 dark:bg-gray-950/80 p-8 rounded-[2.5rem] shadow-2xl border border-white dark:border-gray-800 backdrop-blur-xl">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Engine Life: {progress}%</span>
                                        </div>
                                        <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                                                <Loader2 size={16} className="animate-spin" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                Building...
                                            </span>
                                        </div>

                                        <button
                                            onClick={onCancel}
                                            className="px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-black uppercase tracking-widest text-[9px] border border-red-100 dark:border-red-900/50 transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Initial Placeholder (Only before first generate) */}
                        {!hasResult && !isProcessing && originalImage && (
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className="absolute inset-0 opacity-10 grayscale blur-[4px]">
                                    <img src={originalImage} alt="Preview Background" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
                                    <div className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-none border border-white dark:border-gray-800 animate-in zoom-in-95 duration-700">
                                        <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                            <Sparkles size={32} />
                                        </div>
                                        <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white mb-2">Ready to Transform</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest max-w-[200px] mx-auto mb-8 leading-relaxed">
                                            Vision uploaded & grid calculated. Click below to ignite the engine.
                                        </p>
                                        <button
                                            onClick={onGenerate}
                                            className="w-full py-4 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] rounded-2xl shadow-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center space-x-3 hover:scale-105 active:scale-95 transition-all outline outline-offset-4 outline-transparent hover:outline-blue-500/30 group/gn"
                                        >
                                            <Play size={16} fill="currentColor" className="group-hover/gn:translate-x-1 transition-transform" />
                                            <span>Ignite Studio Engine</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
