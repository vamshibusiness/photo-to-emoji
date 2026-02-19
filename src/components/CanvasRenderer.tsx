import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, SplitSquareHorizontal } from 'lucide-react';

interface CanvasRendererProps {
    result: any[] | null;
    originalImage: string | null;
    width: number;
    height: number;
    isProcessing: boolean;
    scale?: number;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
    result,
    originalImage,
    width,
    height,
    isProcessing,
    scale = 2
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
                const item = result[index + (i - index)];
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
        setZoom(prev => Math.min(Math.max(0.1, prev + delta), 5));
    };

    if (!originalImage) return null;

    return (
        <div className="relative flex flex-col h-full">

            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-20 flex space-x-2">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-lg rounded-lg p-1 flex space-x-1">
                    <button onClick={() => setShowComparison(!showComparison)} className={`p-2 rounded ${showComparison ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                        <SplitSquareHorizontal size={20} />
                    </button>
                    <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                    <button onClick={() => handleZoom(-0.2)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><ZoomOut size={20} /></button>
                    <span className="flex items-center text-xs w-12 justify-center font-mono">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => handleZoom(0.2)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><ZoomIn size={20} /></button>
                    <button onClick={() => setZoom(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Maximize size={20} /></button>
                </div>
            </div>

            {/* Viewport */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto bg-gray-100 dark:bg-black/20 rounded-2xl relative flex items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700"
            >
                <div
                    className="relative transition-transform duration-200 shadow-2xl"
                    style={{
                        width: width,
                        height: height,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center'
                    }}
                >
                    {/* Base Layer: Emoji Canvas */}
                    <canvas
                        ref={canvasRef}
                        width={width * scale}
                        height={height * scale}
                        className="absolute top-0 left-0 w-full h-full bg-white block"
                    />

                    {/* Overlay: Original Image (for comparison) */}
                    {showComparison && (
                        <div
                            className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white/50 shadow-[2px_0_10px_rgba(0,0,0,0.3)]"
                            style={{ width: `${sliderPosition}%` }}
                        >
                            <img
                                src={originalImage}
                                className="max-w-none"
                                style={{ width: width, height: height }}
                                alt="Original"
                            />
                        </div>
                    )}

                    {/* Slider Handle */}
                    {showComparison && (
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPosition}
                            onChange={(e) => setSliderPosition(Number(e.target.value))}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                            title="Drag to compare"
                        />
                    )}

                    {/* Loading Overlay */}
                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center space-x-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                <span className="font-medium">Rendering...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
