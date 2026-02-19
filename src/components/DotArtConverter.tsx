import React, { useState } from 'react';
import { Copy, Download, Check, Smartphone, Laptop, Sparkles, Grid, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { saveAs } from 'file-saver';

export const DOT_PLATFORM_PRESETS = {
    whatsapp: { name: 'WhatsApp', icon: <MessageCircle size={14} />, width: 33 },
    instagram: { name: 'Instagram', icon: <Instagram size={14} />, width: 40 },
    youtube: { name: 'YouTube', icon: <Youtube size={14} />, width: 60 },
    facebook: { name: 'Facebook', icon: <Smartphone size={14} />, width: 42 },
    snapchat: { name: 'Snapchat', icon: <Smartphone size={14} className="rotate-90" />, width: 32 }
};

interface DotArtConverterProps {
    textResult: string | null;
    platform: string;
    onPlatformChange: (platform: string) => void;
    deviceMode: 'mobile' | 'desktop';
    onDeviceModeChange: (mode: 'mobile' | 'desktop') => void;
    renderingType: 'ascii' | 'unicode' | 'unicode-box';
    onRenderingTypeChange: (type: 'ascii' | 'unicode' | 'unicode-box') => void;
}

export const DotArtConverter: React.FC<DotArtConverterProps> = ({
    textResult,
    platform,
    onPlatformChange,
    deviceMode,
    onDeviceModeChange,
    renderingType,
    onRenderingTypeChange
}) => {
    const [copied, setCopied] = useState(false);

    const getFormattedText = () => {
        if (!textResult) return '';

        let processed = textResult;

        // Platform specific formatting
        if (platform === 'youtube' || platform === 'instagram') {
            // Replace normal spaces with non-breaking spaces to prevent collapse
            processed = processed.replace(/ /g, '\u00A0');
        }

        if ((platform === 'whatsapp' || platform === 'facebook') && deviceMode === 'mobile') {
            return `\`\`\`\n${processed}\n\`\`\``;
        }

        return processed;
    };

    const handleCopy = () => {
        const formatted = getFormattedText();
        if (!formatted) return;
        navigator.clipboard.writeText(formatted);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const formatted = getFormattedText();
        if (!formatted) return;
        const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `photo-to-dotart-${platform}-${deviceMode}.txt`);
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
            {/* Layer 1: Device & Rendering Mode Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Device View</label>
                    <div className="flex p-1 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => onDeviceModeChange('mobile')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${deviceMode === 'mobile' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Smartphone size={14} />
                            <span>Mobile</span>
                        </button>
                        <button
                            onClick={() => onDeviceModeChange('desktop')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${deviceMode === 'desktop' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Laptop size={14} />
                            <span>Desktop</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Engine Mode</label>
                    <div className="flex p-1 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => onRenderingTypeChange('ascii')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${renderingType === 'ascii' ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Sparkles size={14} />
                            <span>ASCII</span>
                        </button>
                        <button
                            onClick={() => onRenderingTypeChange('unicode')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${renderingType === 'unicode' ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={14} />
                            <span>Dots</span>
                        </button>
                        <button
                            onClick={() => onRenderingTypeChange('unicode-box')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${renderingType === 'unicode-box' ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={14} />
                            <span>Box</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Layer 2: Platform Selector */}
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Platform Formatting</label>
                <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar">
                    {Object.entries(DOT_PLATFORM_PRESETS).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => onPlatformChange(key)}
                            className={`
                                px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 whitespace-nowrap border-2
                                ${platform === key
                                    ? 'bg-[#1a1a1a] dark:bg-white border-[#1a1a1a] dark:border-white text-white dark:text-black shadow-xl scale-105'
                                    : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                                }
                            `}
                        >
                            {config.icon}
                            <span>{config.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Output Output with Device Emulation */}
            <div className="flex-1 bg-white dark:bg-black rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden relative group">
                <div className="absolute inset-0 overflow-auto p-8 custom-scrollbar flex flex-col items-center">
                    {textResult ? (
                        <div
                            className={`transition-all duration-500 w-full mx-auto ${deviceMode === 'mobile' ? 'max-w-[320px]' : 'max-w-full'}`}
                            style={{
                                perspective: '1000px'
                            }}
                        >
                            <div className={`p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-sm ${deviceMode === 'mobile' ? 'shadow-2xl' : ''}`}>
                                <pre className={`art-grid text-[7px] sm:text-[9px] leading-none mx-auto inline-block min-w-full text-black dark:text-white select-all`}>
                                    {getFormattedText()}
                                </pre>
                            </div>
                            {deviceMode === 'mobile' && (
                                <div className="mt-4 text-center">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Mobile Safe Preview</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-950 rounded-3xl flex items-center justify-center text-gray-200 dark:text-gray-800 shadow-inner">
                                <Smartphone size={40} className="animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Layered Rendering Pending</h3>
                                <p className="text-[10px] text-gray-500 font-bold max-w-[200px] leading-relaxed">
                                    Simulating {deviceMode} viewport for {platform} formatting.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {textResult && (
                    <div className="absolute bottom-6 right-6 flex items-center space-x-2 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
                        <button
                            onClick={handleCopy}
                            className={`
                                p-3 rounded-xl transition-all flex items-center space-x-2
                                ${copied ? 'bg-green-500 text-white' : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}
                            `}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                {copied ? 'Copied' : 'Copy'}
                            </span>
                        </button>
                        <div className="w-[1px] h-6 bg-gray-100 dark:bg-gray-800" />
                        <button
                            onClick={handleDownload}
                            className="p-3 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Info Footer */}
            <div className="px-6 py-4 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] opacity-50">
                <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Brightness Map</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Character Density</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
