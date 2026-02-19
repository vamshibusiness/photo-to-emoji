import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
    return (
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Logo />
                    <div className="hidden sm:block h-6 w-[1px] bg-gray-200 dark:bg-gray-800" />
                    <p className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-[#1a1a1a] dark:text-gray-500">
                        V2.4 Enterprise Edition
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90 shadow-sm"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
};
