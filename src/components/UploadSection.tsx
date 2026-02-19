import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadSectionProps {
    onImageSelected: (file: File) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelected }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const validateAndUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (JPG, PNG, WebP).');
            return;
        }
        setError(null);
        onImageSelected(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndUpload(e.target.files[0]);
        }
    };

    return (
        <div
            className={`
                relative overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all duration-500
                flex flex-col items-center justify-center p-12 h-full min-h-[450px]
                ${isDragging
                    ? 'border-blue-500 bg-blue-500/5 scale-[0.98]'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
            />

            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 transition-transform duration-500 ${isDragging ? 'scale-110 animate-bounce' : 'animate-float'}`}>
                <Upload className="w-10 h-10 text-white" />
            </div>

            <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                    {isDragging ? 'Drop it here' : 'Art Starts Here'}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Drag and drop your masterpiece, or <span className="text-blue-500 font-bold cursor-pointer hover:underline">browse</span> to begin the transformation.
                </p>

                <div className="pt-4 flex flex-col items-center">
                    <label
                        htmlFor="file-upload"
                        className="btn-primary cursor-pointer flex items-center space-x-2 group"
                    >
                        <span>Choose Masterpiece</span>
                        <ImageIcon size={18} className="group-hover:rotate-12 transition-transform" />
                    </label>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-6 animate-pulse">
                        Supports: JPG, PNG, WEBP • Max 10MB
                    </p>
                </div>
            </div>

            {error && (
                <div className="absolute bottom-8 left-0 right-0 mx-8 p-4 glass-card border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                </div>
            )}
        </div>
    );
};
