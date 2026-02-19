import React from 'react';
import { Download, FileImage } from 'lucide-react';

interface DownloadSectionProps {
    onDownload: (format: 'png' | 'jpg') => void;
    disabled: boolean;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ onDownload, disabled }) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="flex items-center space-x-2 font-semibold text-lg mb-6">
                <Download className="w-5 h-5 text-primary" />
                <span>Export</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onDownload('png')}
                    disabled={disabled}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <FileImage size={24} />
                    </div>
                    <span className="font-medium">Download PNG</span>
                    <span className="text-xs text-gray-500 mt-1">Best Quality</span>
                </button>

                <button
                    onClick={() => onDownload('jpg')}
                    disabled={disabled}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-secondary hover:bg-secondary/5 dark:hover:bg-secondary/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <FileImage size={24} />
                    </div>
                    <span className="font-medium">Download JPG</span>
                    <span className="text-xs text-gray-500 mt-1">Small Size</span>
                </button>
            </div>
        </div>
    );
};
