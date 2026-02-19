import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
    X, RotateCw, FlipHorizontal, FlipVertical, ZoomIn, ZoomOut,
    Maximize, Square, CreditCard, Monitor,
    Smartphone, Check, Undo2
} from 'lucide-react';
import { getCroppedImg } from '../utils/cropUtils';

interface ImageEditorModalProps {
    image: string;
    onCancel: () => void;
    onConfirm: (processedImage: Blob) => void;
}

const ASPECT_RATIOS = [
    { label: 'Free', value: undefined, icon: <Maximize size={16} /> },
    { label: '1:1', value: 1, icon: <Square size={16} /> },
    { label: '4:5', value: 4 / 5, icon: <Smartphone size={16} /> },
    { label: '16:9', value: 16 / 9, icon: <Monitor size={16} /> },
    { label: '9:16', value: 9 / 16, icon: <Smartphone size={16} className="rotate-90" /> },
    { label: '3:4', value: 3 / 4, icon: <CreditCard size={16} className="rotate-90" /> },
    { label: '2:3', value: 2 / 3, icon: <Smartphone size={16} /> },
];

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ image, onCancel, onConfirm }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation,
                flip
            );
            if (croppedImage) {
                onConfirm(croppedImage);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-950/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Refine Masterpiece</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Adjust composition & perspective</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-2xl transition-all hover:scale-110 active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Editor Content */}
                <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                    {/* Main Cropper Area */}
                    <div className="relative flex-1 bg-gray-50 dark:bg-black overflow-hidden m-4 rounded-[2rem] border border-gray-100 dark:border-gray-800 min-h-[300px]">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            classes={{
                                containerClassName: "rounded-[2rem]",
                                mediaClassName: "rounded-[2rem]",
                                cropAreaClassName: "border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                            }}
                        />
                    </div>

                    {/* Controls Sidebar */}
                    <div className="w-full lg:w-80 p-6 space-y-8 overflow-y-auto custom-scrollbar border-l border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">

                        {/* Aspect Ratio */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Aspect Ratio</h3>
                            <div className="grid grid-cols-4 sm:grid-cols-2 gap-2">
                                {ASPECT_RATIOS.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setAspect(item.value)}
                                        className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold transition-all ${aspect === item.value
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Transform Tools */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Transform</h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setRotation((r) => r + 90)}
                                    className="p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all active:scale-95"
                                    title="Rotate 90°"
                                >
                                    <RotateCw size={18} />
                                </button>
                                <button
                                    onClick={() => setFlip(f => ({ ...f, horizontal: !f.horizontal }))}
                                    className="p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all active:scale-95"
                                    title="Flip Horizontal"
                                >
                                    <FlipHorizontal size={18} />
                                </button>
                                <button
                                    onClick={() => setFlip(f => ({ ...f, vertical: !f.vertical }))}
                                    className="p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all active:scale-95"
                                    title="Flip Vertical"
                                >
                                    <FlipVertical size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        setCrop({ x: 0, y: 0 });
                                        setZoom(1);
                                        setRotation(0);
                                        setFlip({ horizontal: false, vertical: false });
                                        setAspect(undefined);
                                    }}
                                    className="p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95"
                                    title="Reset All"
                                >
                                    <Undo2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Zoom Control */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                <span>Zoom Level</span>
                                <span className="text-blue-500">{Math.round(zoom * 100)}%</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <ZoomOut size={16} className="text-gray-400" />
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                                />
                                <ZoomIn size={16} className="text-gray-400" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-100 dark:bg-gray-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                        High-quality cropping • Smart perspective
                    </p>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button
                            onClick={onCancel}
                            className="flex-1 sm:flex-none px-8 py-3.5 bg-transparent border-2 border-gray-200 dark:border-gray-700 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 uppercase tracking-widest text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 sm:flex-none px-10 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center space-x-2 uppercase tracking-widest text-xs"
                        >
                            <Check size={18} />
                            <span>Confirm & Refine</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
