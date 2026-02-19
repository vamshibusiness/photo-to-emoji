import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, ZoomIn, Check, X } from 'lucide-react';
import { getCroppedImg } from '../utils/cropUtils';

interface ImageEditorProps {
    image: string;
    onCancel: () => void;
    onConfirm: (croppedImage: Blob) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ image, onCancel, onConfirm }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [flip, setFlip] = useState({ horizontal: false, vertical: false });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            {/* Cropper Area */}
            <div className="relative flex-1 bg-black min-h-[400px]">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={undefined}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    transform={[
                        `translate(${crop.x}px, ${crop.y}px)`,
                        `rotateZ(${rotation}deg)`,
                        `rotateY(${flip.horizontal ? 180 : 0}deg)`,
                        `rotateX(${flip.vertical ? 180 : 0}deg)`,
                        `scale(${zoom})`,
                    ].join(' ')}
                />
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6 glass-panel border-t-0 rounded-t-none">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Zoom */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <ZoomIn size={14} className="mr-1" /> Zoom
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                        </div>
                    </div>

                    {/* Rotation */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <RotateCw size={14} className="mr-1" /> Rotation
                        </label>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setRotation(r => (r - 90) % 360)} className="p-2 glass-card rounded-lg hover:text-blue-500"><RotateCcw size={18} /></button>
                            <input
                                type="range"
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                onChange={(e) => setRotation(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                            <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2 glass-card rounded-lg hover:text-blue-500"><RotateCw size={18} /></button>
                        </div>
                    </div>

                    {/* Flip */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Flip & Mirror</label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFlip(f => ({ ...f, horizontal: !f.horizontal }))}
                                className={`flex-1 flex items-center justify-center p-2 rounded-lg border transition-all ${flip.horizontal ? 'bg-blue-600 text-white border-blue-600' : 'glass-card'}`}
                                title="Mirror Horizontal"
                            >
                                <FlipHorizontal size={18} />
                            </button>
                            <button
                                onClick={() => setFlip(f => ({ ...f, vertical: !f.vertical }))}
                                className={`flex-1 flex items-center justify-center p-2 rounded-lg border transition-all ${flip.vertical ? 'bg-blue-600 text-white border-blue-600' : 'glass-card'}`}
                                title="Mirror Vertical"
                            >
                                <FlipVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-end space-x-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-all"
                        >
                            <X size={18} className="mr-2" /> Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-[2] btn-primary flex items-center justify-center"
                        >
                            <Check size={18} className="mr-2" /> Confirm Edits
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
