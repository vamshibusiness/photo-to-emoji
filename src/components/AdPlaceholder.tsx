import React from 'react';

export const AdPlaceholder: React.FC = () => {
    return (
        <div className="w-full h-24 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm">
            <span className="font-semibold">Advertisement Space</span>
            <span className="text-xs">Support us by disabling adblock</span>
        </div>
    );
};
