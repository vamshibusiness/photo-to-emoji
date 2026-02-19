import React, { useCallback, memo } from 'react';
import {
    Settings, Zap, Sparkles, Grid, Layers,
    ShieldCheck, Activity, Gauge
} from 'lucide-react';
import { ProcessingSettings } from '../worker';

interface SettingsPanelProps {
    settings: ProcessingSettings;
    onSettingsChange: (newSettings: ProcessingSettings) => void;
    disabled: boolean;
    hasImage: boolean;
    onGenerate: () => void;
}

const QUALITY_LEVELS = [
    { label: 'Performance', value: 'performance' },
    { label: 'High Quality', value: 'high' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(({
    settings,
    onSettingsChange,
    disabled,
    hasImage,
    onGenerate
}) => {

    const [localThresholds, setLocalThresholds] = React.useState({
        density: settings.density,
        colorEnhancement: settings.colorEnhancement,
        randomness: settings.randomness
    });

    const updateSetting = useCallback((key: keyof ProcessingSettings, value: any) => {
        onSettingsChange({ ...settings, [key]: value });
    }, [settings, onSettingsChange]);

    // Sync local state when external settings change (e.g. from history or reset)
    React.useEffect(() => {
        setLocalThresholds({
            density: settings.density,
            colorEnhancement: settings.colorEnhancement,
            randomness: settings.randomness
        });
    }, [settings.density, settings.colorEnhancement, settings.randomness]);

    const debouncedUpdate = React.useRef<any>(null);

    const handleSliderChange = (key: string, value: number) => {
        setLocalThresholds(prev => ({ ...prev, [key]: value }));

        if (debouncedUpdate.current) clearTimeout(debouncedUpdate.current);
        debouncedUpdate.current = setTimeout(() => {
            onSettingsChange({ ...settings, [key]: value });
        }, 300);
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            {/* Branding/Header */}
            <div className="flex items-center space-x-2 font-black text-[#1a1a1a] dark:text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                <Settings className="w-3 h-3 text-blue-600" />
                <span>Control Center</span>
            </div>

            {!hasImage && (
                <div className="p-4 bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest leading-relaxed">
                        ✨ Pro Tip: Adjust settings below & click Generate to see the magic.
                    </p>
                </div>
            )}

            {/* Core Rendering Controls - Always usable as requested */}
            <div className={`space-y-8 transition-all duration-500 ${!hasImage ? 'opacity-80 scale-95' : ''}`}>

                {/* Detail Density */}
                <div className="space-y-4 group/item">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#1a1a1a] dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Grid size={14} className="text-blue-600" />
                            <span>Detail Density</span>
                        </div>
                        <span className="text-[10px] font-mono bg-blue-600/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
                            {localThresholds.density}PX
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={localThresholds.density}
                        onChange={(e) => handleSliderChange('density', Number(e.target.value))}
                        className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-black text-gray-500 dark:text-gray-500 uppercase tracking-tighter">
                        <span>High Detail</span>
                        <span>Low Detail</span>
                    </div>
                </div>

                {/* Vibrancy */}
                <div className="space-y-4 group/item">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#1a1a1a] dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-purple-600" />
                            <span>Color Vibrancy</span>
                        </div>
                        <span className="text-[10px] font-mono bg-purple-600/10 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/20">
                            {(localThresholds.colorEnhancement * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={localThresholds.colorEnhancement}
                        onChange={(e) => handleSliderChange('colorEnhancement', Number(e.target.value))}
                        className="w-full accent-purple-600 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Artistry/Randomness */}
                <div className="space-y-4 group/item">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#1a1a1a] dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-orange-600" />
                            <span>Artistic Randomness</span>
                        </div>
                        <span className="text-[10px] font-mono bg-orange-600/10 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20">
                            {(localThresholds.randomness * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={localThresholds.randomness}
                        onChange={(e) => handleSliderChange('randomness', Number(e.target.value))}
                        className="w-full accent-orange-600 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Quality Selector */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1a1a1a] dark:text-gray-400">
                        <Activity size={14} className="text-red-600" />
                        <span>Rendering Quality</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {QUALITY_LEVELS.map((level) => (
                            <button
                                key={level.label}
                                onClick={() => updateSetting('quality', level.value)}
                                className={`py-2 rounded-xl text-[10px] font-black transition-all border-2 ${settings.quality === level.value
                                    ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-black shadow-lg'
                                    : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-400 dark:hover:border-gray-600'
                                    }`}
                            >
                                {level.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resolution Scaling */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1a1a1a] dark:text-gray-400">
                        <Layers size={14} className="text-green-600" />
                        <span>Export Resolution</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 4].map((scale) => (
                            <button
                                key={scale}
                                onClick={() => updateSetting('contrast', scale)}
                                className={`py-2 rounded-xl text-xs font-black transition-all border-2 ${settings.contrast === scale
                                    ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/20'
                                    : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-400 dark:hover:border-gray-600'
                                    }`}
                            >
                                {scale}X Scale
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:bg-white dark:hover:bg-gray-900">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
                                <ShieldCheck size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black uppercase tracking-wider text-[#1a1a1a] dark:text-gray-300">Watermark</span>
                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Toggle ON for export credit</span>
                            </div>
                        </div>
                        <button
                            onClick={() => updateSetting('watermark', !settings.watermark)}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300
                                ${settings.watermark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}
                            `}
                        >
                            <span className="sr-only">Toggle Watermark</span>
                            <span
                                className={`
                                    inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm
                                    ${settings.watermark ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Secondary Generate Button */}
            <div className="pt-4">
                <button
                    onClick={onGenerate}
                    disabled={disabled || !hasImage}
                    className={`
                        w-full py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 font-black uppercase tracking-widest text-[11px]
                        ${disabled || !hasImage
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-2 border-transparent'
                            : 'bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] shadow-xl hover:scale-[1.02] active:scale-95 border-2 border-[#1a1a1a] dark:border-white'
                        }
                    `}
                >
                    {disabled ? (
                        <Gauge className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    <span>{disabled ? 'Processing...' : 'Ignite Rendering'}</span>
                </button>
            </div>

            <div className="pt-8">
                <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-3 mb-2">
                        <Gauge className="w-4 h-4 text-blue-400 dark:text-blue-600" />
                        <h4 className="text-white dark:text-[#1a1a1a] text-[10px] font-black uppercase tracking-widest">Speed Optimization</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold leading-relaxed">
                        Dual-core Web Workers enabled. Estimated render time: <span className="text-white dark:text-[#1a1a1a]">1.2s - 4.5s</span>
                    </p>
                </div>
            </div>
        </div>
    );
});

export default SettingsPanel;
