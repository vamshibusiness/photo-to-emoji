import { useState, useEffect, useCallback } from 'react';
import { useWorker } from './hooks/useWorker';
import { ProcessingSettings } from './worker';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ModeSwitcher } from './components/ModeSwitcher';
import { SettingsPanel } from './components/SettingsPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { DownloadPanel } from './components/DownloadPanel';
import { ImageEditorModal } from './components/ImageEditorModal';
import { EmojiImageConverter } from './components/EmojiImageConverter';
import { TextEmojiConverter, PLATFORM_PRESETS } from './components/TextEmojiConverter';
import { DotArtConverter, DOT_PLATFORM_PRESETS } from './components/DotArtConverter';
import { HistoryPanel, HistoryItem } from './components/HistoryPanel';
import { TermsPage } from './components/TermsPage';
import { RotateCcw, Sparkles, Settings } from 'lucide-react';

type AppMode = 'image' | 'text' | 'dot';

function App() {
    // Theme State
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // App State
    const [mode, setMode] = useState<AppMode>('image');
    const [platform, setPlatform] = useState('whatsapp');
    const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
    const [renderingType, setRenderingType] = useState<any>('unicode');
    const [file, setFile] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg'>('png');
    const [frameStyle, setFrameStyle] = useState<'none' | 'square' | 'border'>('none');
    const [showSidebar, setShowSidebar] = useState(true);

    // History State
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const saved = localStorage.getItem('studio-history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('studio-history', JSON.stringify(history));
    }, [history]);

    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [imageData, setImageData] = useState<Uint8ClampedArray | null>(null);

    const [settings, setSettings] = useState<ProcessingSettings>({
        density: 1,
        colorEnhancement: 0.2,
        randomness: 0,
        contrast: 1,
        dotDensity: 10,
        quality: 1,
        watermark: false // Default to OFF as requested
    } as any);

    // Track settings that are "pending" for the next Generate click
    const [pendingSettings, setPendingSettings] = useState<ProcessingSettings>(settings);

    const { isReady, isProcessing, progress, error, result, textResult, processImage, cancelRendering, resetResult } = useWorker();

    // Effect to capture snapshots for history
    useEffect(() => {
        if (!isProcessing && (result || textResult)) {
            const newItem: HistoryItem = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                mode: mode,
                settings: { ...settings },
                // Thumbnail would need a canvas snapshot, we'll omit for now or use a placeholder
            };

            setHistory(prev => [newItem, ...prev].slice(0, 5));
        }
    }, [isProcessing, result, textResult]);

    // Handle Theme
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Handle Image Upload
    const handleImageSelected = useCallback((selectedFile: File) => {
        resetResult();
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setOriginalImage(url);

        const img = new Image();
        img.onload = () => {
            setImageDimensions({ width: img.width, height: img.height });
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, img.width, img.height).data;
                setImageData(data);
            }
        };
        img.src = url;
    }, [resetResult]);

    const handleEditConfirm = async (processedBlob: Blob) => {
        resetResult();
        const url = URL.createObjectURL(processedBlob);
        setOriginalImage(url);
        setIsEditing(false);

        const img = new Image();
        img.onload = () => {
            setImageDimensions({ width: img.width, height: img.height });
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, img.width, img.height).data;
                setImageData(data);
            }
        };
        img.src = url;
    };

    const handleGenerate = () => {
        if (imageData && isReady) {
            setSettings(pendingSettings); // Apply pending settings

            let platformWidth;
            if (mode === 'text') {
                platformWidth = (PLATFORM_PRESETS as any)[platform]?.width || 40;
            } else if (mode === 'dot') {
                platformWidth = (DOT_PLATFORM_PRESETS as any)[platform]?.width || 50;
            }

            const currentSettings = {
                ...pendingSettings,
                platform: platform,
                platformWidth: platformWidth,
                deviceMode: deviceMode,
                renderingType: renderingType || (mode === 'dot' ? 'unicode' : 'emoji')
            };

            processImage(
                imageData,
                imageDimensions.width,
                imageDimensions.height,
                currentSettings,
                mode as any
            );
        }
    };

    const handleReset = () => {
        setFile(null);
        setOriginalImage(null);
        setImageData(null);
        setIsEditing(false);
        resetResult();
    };

    const handleDownload = (format: 'png' | 'jpg') => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `emoji-studio-${mode}-${Date.now()}.${format}`;
        link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`, 1.0);
        link.click();
    };

    const handleShare = async () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        try {
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], 'emoji-studio-share.png', { type: 'image/png' });
                if (navigator.share) {
                    await navigator.share({
                        title: 'Photo to Emoji Studio',
                        text: 'Look at this mosaic I created!',
                        files: [file]
                    });
                } else {
                    alert('Sharing is not supported on this browser/device.');
                }
            });
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleRestoreHistory = (item: HistoryItem) => {
        setMode(item.mode);
        setPendingSettings(item.settings);
        setSettings(item.settings);
        // We can't easily restore the original image source if it's not and we don't have it saved
        // but if it's already there, at least we restore settings.
    };

    if (showTerms) {
        return <TermsPage onBack={() => setShowTerms(false)} />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />

            {error && (
                <div className="max-w-7xl mx-auto mt-4 px-6">
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest leading-none">Engine Error: {error}</span>
                    </div>
                </div>
            )}

            <main className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-8 w-full relative">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="lg:hidden fixed bottom-6 left-6 z-[100] p-4 bg-blue-600 text-white rounded-2xl shadow-2xl active:scale-95 transition-all outline outline-4 outline-white/50 dark:outline-gray-900/50"
                >
                    <Settings className={`w-6 h-6 transition-transform duration-500 ${showSidebar ? 'rotate-180' : ''}`} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-full">

                    {/* Left Panel: Controls */}
                    <div className={`
                        order-2 lg:order-1 lg:col-span-4 xl:col-span-3 space-y-8 flex flex-col transition-all duration-500
                        ${showSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 absolute lg:relative pointer-events-none lg:pointer-events-auto'}
                    `}>
                        <div className="space-y-6">
                            {/* Row 1: Mode Tabs */}
                            <ModeSwitcher mode={mode} onChange={setMode} />

                            {/* Row 2: Platform Presets */}
                            {(mode === 'text' || mode === 'dot') && (
                                <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
                                    {Object.entries(mode === 'text' ? PLATFORM_PRESETS : DOT_PLATFORM_PRESETS).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setPlatform(key)}
                                            className={`
                                                px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-2 whitespace-nowrap border-2
                                                ${platform === key
                                                    ? 'bg-[#1a1a1a] dark:bg-white border-[#1a1a1a] dark:border-white text-white dark:text-[#1a1a1a] shadow-lg scale-105'
                                                    : 'bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                                                }
                                            `}
                                        >
                                            {config.icon}
                                            <span>{config.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Row 3: Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    disabled={!file || isProcessing}
                                    className="flex items-center justify-center space-x-2 py-3.5 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all disabled:opacity-50 group/btn"
                                >
                                    <RotateCcw className="w-4 h-4 text-blue-500 group-hover/btn:rotate-180 transition-transform duration-500" />
                                    <span>Edit Vision</span>
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={!file || isProcessing}
                                    className="flex items-center justify-center space-x-2 py-3.5 bg-white dark:bg-gray-950 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-gray-100 dark:border-gray-800 hover:border-red-500 dark:hover:border-red-500 transition-all disabled:opacity-50 group/btn"
                                >
                                    <RotateCcw className="w-4 h-4 group-hover/btn:rotate-[-45deg] transition-transform" />
                                    <span>Clear Stage</span>
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={!file || isProcessing}
                                    className={`
                                        flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 transition-all disabled:opacity-50
                                        ${!file || isProcessing
                                            ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-transparent'
                                            : 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95'
                                        }
                                    `}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Generate</span>
                                </button>
                            </div>
                        </div>

                        <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-white/20 dark:border-gray-800 shadow-2xl relative overflow-hidden group/controls transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/controls:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <SettingsPanel
                                settings={pendingSettings}
                                onSettingsChange={setPendingSettings}
                                disabled={isProcessing}
                                hasImage={Boolean(imageData)}
                                onGenerate={handleGenerate} // Secondary Generate Button
                            />

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <DownloadPanel
                                    onDownload={handleDownload}
                                    onShare={handleShare}
                                    isProcessed={Boolean(result || textResult)}
                                    format={downloadFormat}
                                    setFormat={setDownloadFormat}
                                    frameStyle={frameStyle}
                                    setFrameStyle={setFrameStyle}
                                    mode={mode}
                                />
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <HistoryPanel
                                    items={history}
                                    onRestore={handleRestoreHistory}
                                    onClear={() => setHistory([])}
                                    onRemoveItem={(id) => setHistory(prev => prev.filter(i => i.id !== id))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Staging & Preview */}
                    <div className={`
                        order-1 lg:order-2 flex flex-col transition-all duration-500
                        ${showSidebar ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}
                    `}>
                        <PreviewPanel
                            file={file}
                            originalImage={originalImage}
                            isProcessing={isProcessing}
                            progress={progress}
                            hasResult={!!(result || textResult)}
                            onImageSelected={handleImageSelected}
                            onGenerate={handleGenerate}
                            onCancel={cancelRendering}
                        >
                            {/* Rendering Stage */}
                            {mode === 'image' ? (
                                <EmojiImageConverter
                                    result={result}
                                    originalImage={originalImage}
                                    width={imageDimensions.width}
                                    height={imageDimensions.height}
                                    isProcessing={isProcessing}
                                    scale={settings.contrast}
                                    frameStyle={frameStyle}
                                />
                            ) : mode === 'text' ? (
                                <TextEmojiConverter
                                    textResult={textResult}
                                    platform={platform}
                                    onPlatformChange={setPlatform}
                                    deviceMode={deviceMode}
                                    onDeviceModeChange={setDeviceMode}
                                />
                            ) : (
                                <DotArtConverter
                                    textResult={textResult}
                                    platform={platform}
                                    onPlatformChange={setPlatform}
                                    deviceMode={deviceMode}
                                    onDeviceModeChange={setDeviceMode}
                                    renderingType={renderingType as any}
                                    onRenderingTypeChange={setRenderingType as any}
                                />
                            )}
                        </PreviewPanel>

                        {/* Status Bar */}
                        {originalImage && (
                            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center px-8 py-4 glass-card rounded-2xl border border-white/20 dark:border-gray-800">
                                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                                    <div className="flex -space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                        <div className="w-2 h-2 rounded-full bg-blue-400 opacity-50 animate-ping" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                                        {imageDimensions.width} × {imageDimensions.height} PX • {mode.toUpperCase()} MODE
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                                        Studio Engine Live
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">
                                        V2.4.0-PRO
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer onTermsClick={() => setShowTerms(true)} />

            {/* Editor Modal */}
            {isEditing && originalImage && (
                <ImageEditorModal
                    image={originalImage}
                    onCancel={() => setIsEditing(false)}
                    onConfirm={handleEditConfirm}
                />
            )}
        </div>
    );
}

export default App;

