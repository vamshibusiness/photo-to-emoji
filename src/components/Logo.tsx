import React from 'react';
import logoImg from './logo.png';

export const Logo: React.FC<{ className?: string, compact?: boolean }> = ({ className, compact = false }) => {
    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            <div className="relative w-10 h-10 group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <img
                    src={logoImg}
                    alt="Photo to Emoji Studio"
                    className="relative w-full h-full object-contain rounded-xl shadow-lg ring-1 ring-white/20"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    {compact ? 'Emoji Studio' : 'Photo to Emoji Studio'}
                </span>
                {!compact && (
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">
                        Professional Suite
                    </span>
                )}
            </div>
        </div>
    );
};
