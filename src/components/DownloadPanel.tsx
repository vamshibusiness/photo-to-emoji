import React, { useState } from 'react';
import { Download, CheckCircle2, ChevronDown, Image as ImageIcon, FileText, Share2, Frame } from 'lucide-react';

interface DownloadPanelProps {
    onDownload: (format: 'png' | 'jpg') => void;
    onShare: () => void;
    isProcessed: boolean;
    format: 'png' | 'jpg';
    setFormat: (format: 'png' | 'jpg') => void;
    frameStyle: 'none' | 'square' | 'border';
    setFrameStyle: (style: 'none' | 'square' | 'border') => void;
    mode: 'image' | 'text' | 'dot';
}

export const DownloadPanel: React.FC<DownloadPanelProps> = ({
    onDownload,
    onShare,
    isProcessed,
    format,
    setFormat,
    frameStyle,
    setFrameStyle,
    mode
}) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const handleDownload = () => {
        onDownload(format);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
    };

    if (mode === 'text' || mode === 'dot') return null;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
                <div className="flex items-center space-x-2 w-full">
                    <button
                        onClick={handleDownload}
                        disabled={!isProcessed}
                        className={`
                            flex-1 flex items-center justify-center space-x-3 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300
                            ${isSuccess
                                ? 'bg-green-600 text-white scale-[1.02] shadow-xl shadow-green-500/20'
                                : isProcessed
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-xl shadow-blue-500/20 active:scale-95'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {isSuccess ? (
                            <>
                                <CheckCircle2 size={18} className="animate-bounce" />
                                <span>Masterpiece Saved</span>
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                <span>Export HD {format.toUpperCase()}</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        disabled={!isProcessed}
                        className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 border-2 border-transparent focus:border-blue-500/20"
                    >
                        <ChevronDown size={20} className={`transition-transform duration-300 ${showOptions ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Success Animation Particles (Visual Hack) */}
                {isSuccess && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <div className="absolute w-4 h-4 bg-green-500/30 rounded-full animate-ping delay-100" />
                    </div>
                )}
            </div>

            {showOptions && isProcessed && (
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4 animate-in slide-in-from-top-2">
                    {/* Format Selection */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">File Format</span>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setFormat('png')}
                                className={`flex items-center justify-center space-x-2 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${format === 'png' ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                            >
                                <ImageIcon size={14} />
                                <span>PNG</span>
                            </button>
                            <button
                                onClick={() => setFormat('jpg')}
                                className={`flex items-center justify-center space-x-2 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${format === 'jpg' ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                            >
                                <ImageIcon size={14} />
                                <span>JPG</span>
                            </button>
                        </div>
                    </div>

                    {/* Frame Selection */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Frame Style</span>
                        <div className="grid grid-cols-3 gap-2">
                            {(['none', 'square', 'border'] as const).map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setFrameStyle(style)}
                                    className={`flex items-center justify-center space-x-2 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${frameStyle === style ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm border border-blue-500/20' : 'text-gray-500 hover:bg-white/50'}`}
                                >
                                    <Frame size={14} />
                                    <span className="capitalize">{style}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Share Button */}
                    <button
                        onClick={onShare}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                    >
                        <Share2 size={14} />
                        <span>Share Masterpiece</span>
                    </button>
                </div>
            )}

            <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-1.5 grayscale opacity-50">
                    <FileText size={12} className="text-gray-400" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Metadata Included</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="flex items-center space-x-1.5 grayscale opacity-50">
                    <ImageIcon size={12} className="text-gray-400" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">High-Res Output</span>
                </div>
            </div>
        </div>
    );
};
