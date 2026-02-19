import React, { useRef, useEffect, useState } from 'react';

interface EmojiImageConverterProps {
    result: any[] | null;
    originalImage: string | null;
    width: number;
    height: number;
    isProcessing: boolean;
    scale?: number;
    frameStyle?: 'none' | 'square' | 'border';
}

export const EmojiImageConverter: React.FC<EmojiImageConverterProps> = ({
    result,
    originalImage,
    width,
    height,
    isProcessing,
    scale = 2,
    frameStyle = 'none'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [zoom, setZoom] = useState(1);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [showComparison, setShowComparison] = useState(false);

    // Draw Logic
    useEffect(() => {
        if (!result || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // Set canvas dimensions for high-res rendering
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        // Clear and set background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, scaledWidth, scaledHeight);

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        let fontSize = scaledWidth / (width / 20); // fallback
        if (result.length > 1) {
            // Find density from result spacing
            let dx = 0;
            for (let i = 1; i < result.length; i++) {
                if (result[i].y === result[0].y) {
                    dx = result[i].x - result[0].x;
                    break;
                }
            }
            if (dx > 0) fontSize = dx * scale;
        }

        ctx.font = `${fontSize}px sans-serif`;

        // Chunked rendering to keep main thread free
        const CHUNK_SIZE = 2000;
        let index = 0;

        const renderChunk = () => {
            const end = Math.min(index + CHUNK_SIZE, result.length);
            for (let i = index; i < end; i++) {
                const item = result[i];
                if (item.color) {
                    ctx.fillStyle = item.color;
                } else {
                    ctx.fillStyle = '#000';
                }
                const drawX = item.x * scale;
                const drawY = item.y * scale;
                ctx.fillText(item.char, drawX + fontSize / 2, drawY + fontSize / 2 + fontSize * 0.05);
            }

            index = end;
            if (index < result.length) {
                requestAnimationFrame(renderChunk);
            }
        };

        renderChunk();

    }, [result, width, height, scale]);

    // Handle Zoom
    const handleZoom = (delta: number) => {
        setZoom(prev => Math.min(3, Math.max(0.5, prev + delta)));
    };

    if (!result && isProcessing) return null;
    if (!result && !originalImage) return null;

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair group/stage" ref={containerRef}>

            {/* Viewport & Result */}
            <div
                className="relative transition-transform duration-300 ease-out"
                style={{
                    transform: `scale(${zoom})`,
                    width: width,
                    height: height
                }}
            >
                {/* Result Layer */}
                <div className={`
                    absolute inset-0 shadow-2xl overflow-hidden rounded-lg transition-all duration-500
                    ${frameStyle === 'square' ? 'p-12 bg-white ring-1 ring-gray-100' : ''}
                    ${frameStyle === 'border' ? 'border-8 border-white shadow-[0_0_20px_rgba(0,0,0,0.1)]' : ''}
                `}>
                    {/* Base Layer: Emoji Canvas */}
                    <div className="w-full h-full relative">
                        <canvas
                            ref={canvasRef}
                            width={width * scale}
                            height={height * scale}
                            className={`absolute top-0 left-0 w-full h-full bg-white block ${frameStyle === 'square' ? 'shadow-sm' : ''}`}
                        />

                        {/* Comparison Slider */}
                        {showComparison && originalImage && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                            >
                                <img
                                    src={originalImage}
                                    alt="Original"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Zoom Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col space-y-2 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => handleZoom(0.2)}
                    className="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl text-gray-900 dark:text-white hover:scale-110 active:scale-95 transition-all"
                >
                    <span className="text-xl font-bold">+</span>
                </button>
                <button
                    onClick={() => setZoom(1)}
                    className="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl text-gray-900 dark:text-white font-bold hover:scale-110 active:scale-95 transition-all text-[10px]"
                >
                    1:1
                </button>
                <button
                    onClick={() => handleZoom(-0.2)}
                    className="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl text-gray-900 dark:text-white hover:scale-110 active:scale-95 transition-all"
                >
                    <span className="text-xl font-bold">-</span>
                </button>
            </div>

            {/* Comparison Toggle */}
            <div className="absolute top-6 right-6 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`
                        px-6 py-3 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all border-2
                        ${showComparison
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white/90 dark:bg-gray-900/90 border-white dark:border-gray-800 text-gray-900 dark:text-white'
                        }
                    `}
                >
                    Compare Vision
                </button>
            </div>

            {/* Slider Control */}
            {showComparison && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="w-full h-full max-w-none bg-transparent appearance-none pointer-events-auto cursor-col-resize absolute z-[60]"
                        style={{
                            WebkitAppearance: 'none',
                        }}
                    />
                    <div
                        className="absolute h-full w-[2px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.8)] z-[55] pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-full flex items-center justify-center text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-white/50">
                            <div className="flex space-x-0.5">
                                <div className="w-0.5 h-3 bg-blue-600 rounded-full" />
                                <div className="w-0.5 h-3 bg-blue-600 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
