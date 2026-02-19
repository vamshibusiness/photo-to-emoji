import React from 'react';
import { Copy, Download, Share2, Check } from 'lucide-react';
import { saveAs } from 'file-saver';

export const PLATFORM_PRESETS = {
    instagram: { name: 'Instagram', width: 40, label: 'Square Optimized' },
    whatsapp: { name: 'WhatsApp', width: 33, label: 'Narrow Width' },
    facebook: { name: 'Facebook', width: 50, label: 'Desktop Feed' },
    youtube: { name: 'YouTube', width: 60, label: 'Comments' },
    snapchat: { name: 'Snapchat', width: 30, label: 'Mobile Tall' }
};

interface TextConverterProps {
    textResult: string | null;
    isProcessing: boolean;
    platform: string;
    onPlatformChange: (platform: string) => void;
    isDotArt?: boolean;
}

export const TextConverter: React.FC<TextConverterProps> = ({
    textResult,
    isProcessing,
    platform,
    onPlatformChange,
    isDotArt = false
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (!textResult) return;
        navigator.clipboard.writeText(textResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!textResult) return;
        const blob = new Blob([textResult], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `emoji-art-${platform}.txt`);
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-card rounded-2xl">
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {Object.entries(PLATFORM_PRESETS).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => onPlatformChange(key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${platform === key
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {config.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleCopy}
                        disabled={!textResult}
                        className="p-2.5 glass-card rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 disabled:opacity-50 transition-all flex items-center space-x-2"
                        title="Copy to Clipboard"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Copy</span>
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!textResult}
                        className="p-2.5 glass-card rounded-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 disabled:opacity-50 transition-all flex items-center space-x-2"
                        title="Download as .txt"
                    >
                        <Download size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden relative group">
                {textResult ? (
                    <div className="absolute inset-0 overflow-auto p-4 custom-scrollbar">
                        <pre className="text-[8px] leading-[8px] sm:text-[10px] sm:leading-[10px] font-mono text-center whitespace-pre break-normal mx-auto inline-block min-w-full text-gray-900 dark:text-gray-100 selection:bg-blue-500/30">
                            {textResult}
                        </pre>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                            <Share2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {isProcessing ? 'Generating Art...' : `Ready to Convert to ${isDotArt ? 'Dot Art' : 'Emoji Art'}`}
                            </h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                {isProcessing ? 'We are sampling your image and finding the best characters...' : `Choose a platform preset above and click "Generate Art" to see the magic.`}
                            </p>
                        </div>
                    </div>
                )}

                {isProcessing && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-gray-950/40 backdrop-blur-[2px] z-10" />
                )}
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                Tip: Use "Copy" for social media & "Export" for high-res text files
            </p>
        </div>
    );
};
