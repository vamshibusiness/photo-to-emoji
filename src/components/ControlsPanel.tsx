import React from 'react';
import { Settings, Zap, Sparkles, Grid, Layers } from 'lucide-react';
import { ProcessingSettings } from '../worker';

interface ControlsPanelProps {
    settings: ProcessingSettings;
    onSettingsChange: (newSettings: ProcessingSettings) => void;
    disabled: boolean;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({ settings, onSettingsChange, disabled }) => {

    const updateSetting = (key: keyof ProcessingSettings, value: number) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-2 font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                <Settings className="w-3 h-3" />
                <span>Configuration</span>
            </div>

            {/* Density Control */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-2">
                        <Grid size={14} className="text-blue-500" />
                        <span>Detail Density</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                        {settings.density}PX
                    </span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={settings.density}
                    onChange={(e) => updateSetting('density', Number(e.target.value))}
                    disabled={disabled}
                    className="w-full accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Color Enhancement */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-500" />
                        <span>Vibrancy</span>
                    </div>
                    <span className="text-[10px] font-mono bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded">
                        {(settings.colorEnhancement * 100).toFixed(0)}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.colorEnhancement}
                    onChange={(e) => updateSetting('colorEnhancement', Number(e.target.value))}
                    disabled={disabled}
                    className="w-full accent-purple-600 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Randomness */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-orange-500" />
                        <span>Artistry</span>
                    </div>
                    <span className="text-[10px] font-mono bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">
                        {(settings.randomness * 100).toFixed(0)}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.randomness}
                    onChange={(e) => updateSetting('randomness', Number(e.target.value))}
                    disabled={disabled}
                    className="w-full accent-orange-600 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Resolution Scaling */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Layers size={14} className="text-green-500" />
                    <span>Resolution Scale</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 4].map((scale) => (
                        <button
                            key={scale}
                            onClick={() => updateSetting('contrast', scale)} // Reusing contrast for scaling internally
                            disabled={disabled}
                            className={`py-2 rounded-xl text-xs font-black transition-all ${settings.contrast === scale
                                ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                                : 'glass-card text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                }`}
                        >
                            {scale}X
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Performance Note</h4>
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 font-medium">
                        Resolution scales over 2X may increase processing time significantly.
                    </p>
                </div>
            </div>
        </div>
    );
};
