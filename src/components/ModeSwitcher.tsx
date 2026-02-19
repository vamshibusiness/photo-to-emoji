import React from 'react';
import { Image, Type, Grid } from 'lucide-react';

interface ModeSwitcherProps {
    mode: 'image' | 'text' | 'dot';
    onChange: (mode: 'image' | 'text' | 'dot') => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, onChange }) => {
    return (
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <button
                onClick={() => onChange('image')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all ${mode === 'image' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
            >
                <Image size={18} />
                <span className="text-sm font-bold">Image</span>
            </button>
            <button
                onClick={() => onChange('text')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all ${mode === 'text' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
            >
                <Type size={18} />
                <span className="text-sm font-bold">Text</span>
            </button>
            <button
                onClick={() => onChange('dot')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all ${mode === 'dot' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
            >
                <Grid size={18} />
                <span className="text-sm font-bold">Dot Art</span>
            </button>
        </div>
    );
};
