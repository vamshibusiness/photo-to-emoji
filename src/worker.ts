import { EMOJI_SET } from './utils/emojiData';
import { colorDistance } from './utils/colorUtils';

// Types for Worker Messages
export type WorkerMessage =
    | { type: 'INIT' }
    | {
        type: 'PROCESS', payload: {
            imageData: Uint8ClampedArray,
            width: number,
            height: number,
            settings: ProcessingSettings,
            mode: 'image' | 'text' | 'dot'
        }
    }
    | { type: 'CANCEL' };

export interface ProcessingSettings {
    density: number; // e.g., 20px per emoji
    colorEnhancement: number; // 0 to 1 mixing original color
    randomness: number; // 0 to 1
    contrast: number; // 1 = normal
    platform?: string; // e.g., 'instagram', 'whatsapp'
    platformWidth?: number; // for text mode
    deviceMode?: 'mobile' | 'desktop';
    renderingType?: 'emoji' | 'ascii' | 'unicode-box' | 'unicode' | 'dot-symbol';
    dotDensity?: number; // for dot mode
    quality?: 'performance' | 'high';
    watermark?: boolean;
}

interface EmojiColor {
    char: string;
    r: number;
    g: number;
    b: number;
}

let emojiCache: EmojiColor[] = [];
let isInitialized = false;
let isCancelled = false;

// Initialize Emoji Colors using OffscreenCanvas
async function initEmojiColors() {
    if (isInitialized) return;

    const size = 32;
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.font = `${size}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const processedEmojis: EmojiColor[] = [];

    for (const char of EMOJI_SET) {
        ctx.clearRect(0, 0, size, size);
        ctx.fillText(char, size / 2, size / 2 + 2);

        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 128) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
            }
        }

        if (count > 0) {
            processedEmojis.push({
                char,
                r: Math.round(r / count),
                g: Math.round(g / count),
                b: Math.round(b / count)
            });
        }
    }

    emojiCache = processedEmojis;
    isInitialized = true;
    self.postMessage({ type: 'INIT_COMPLETE', count: emojiCache.length });
}

async function processImage(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    settings: ProcessingSettings,
    mode: 'image' | 'text' | 'dot'
) {
    if (!isInitialized || emojiCache.length === 0) {
        self.postMessage({ type: 'ERROR', message: 'Worker not initialized' });
        return;
    }

    isCancelled = false;
    const { density, platformWidth, quality } = settings;
    const platform = settings.platform || 'standard';
    const device = settings.deviceMode || 'mobile';
    const isDotMode = mode === 'dot';
    const isTextMode = mode === 'text';

    // 1. Determine Grid Dimensions
    let cols = 40;
    if (mode === 'image') {
        cols = Math.max(1, Math.floor(width / (density || 10)));
    } else if (isTextMode) {
        const baseWidth = platformWidth || 40;
        cols = device === 'mobile' ? baseWidth : Math.floor(baseWidth * 2.2);
    } else if (isDotMode) {
        cols = platformWidth ? (device === 'mobile' ? platformWidth : Math.floor(platformWidth * 2.2)) : (device === 'mobile' ? 40 : 80);
    }

    const aspectRatio = height / width;
    const correctionFactor = 0.55;
    const rows = Math.floor(cols * aspectRatio * correctionFactor);
    const sampleWidth = width / cols;
    const sampleHeight = height / rows;

    const result: any[] = [];
    let textResult = '';
    const totalSteps = rows * cols;
    let processedSteps = 0;

    // Quality-based sampling
    const subSteps = quality === 'performance' ? 1 : 2;

    // Process in row chunks to keep worker responsive and provide progressive feedback
    const CHUNK_SIZE = 4; // Process 4 rows at a time for smooth live feedback

    for (let y = 0; y < rows; y++) {
        if (isCancelled) {
            self.postMessage({ type: 'CANCELLED' });
            return;
        }

        let textRow = '';
        const startY = y * sampleHeight;

        for (let x = 0; x < cols; x++) {
            const startX = x * sampleWidth;
            let r = 0, g = 0, b = 0, count = 0;
            const stepX = sampleWidth / subSteps;
            const stepY = sampleHeight / subSteps;

            for (let sy = 0; sy < subSteps; sy++) {
                const py = Math.floor(startY + sy * stepY);
                if (py >= height) continue;
                const rowOffset = py * width;

                for (let sx = 0; sx < subSteps; sx++) {
                    const px = Math.floor(startX + sx * stepX);
                    if (px >= width) continue;

                    const offset = (rowOffset + px) * 4;
                    r += data[offset];
                    g += data[offset + 1];
                    b += data[offset + 2];
                    count++;
                }
            }

            if (count > 0) {
                const avgR = r / count;
                const avgG = g / count;
                const avgB = b / count;
                const brightness = (avgR * 0.299 + avgG * 0.587 + avgB * 0.114);

                if (isDotMode) {
                    // STRICT DOT ART: ASCII, Symbols, Dots only
                    const renderingType = settings.renderingType || 'ascii';
                    let dotSet = ' .:-=+*#%@';

                    if (renderingType === 'unicode') {
                        dotSet = (platform === 'whatsapp' || platform === 'facebook')
                            ? ' ⠄⠆⠖⠶⠷⠿'
                            : '  ░▒▓█';
                    } else if (renderingType === 'unicode-box') {
                        dotSet = '  ░▒▓█';
                    } else if (renderingType === 'ascii') {
                        // High contrast ASCII set
                        dotSet = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczMW&8%B@$';
                    }

                    const charIndex = Math.min(dotSet.length - 1, Math.floor((brightness / 255) * dotSet.length));
                    let char = dotSet[charIndex];
                    if (char === ' ' && (platform === 'instagram' || platform === 'youtube')) char = '\u00A0';
                    textRow += char;
                } else if (isTextMode) {
                    // STRICT TEXT MODE: Emojis ONLY
                    let closestEmoji = emojiCache[0];
                    let minDist = Infinity;
                    for (let i = 0; i < emojiCache.length; i++) {
                        const emoji = emojiCache[i];
                        const dist = colorDistance({ r: avgR, g: avgG, b: avgB }, { r: emoji.r, g: emoji.g, b: emoji.b });
                        if (dist < minDist) {
                            minDist = dist;
                            closestEmoji = emoji;
                        }
                    }
                    textRow += closestEmoji.char;
                } else {
                    // IMAGE MODE: Mapping data for Canvas rendering
                    let closestEmoji = emojiCache[0];
                    let minDist = Infinity;
                    for (let i = 0; i < emojiCache.length; i++) {
                        const emoji = emojiCache[i];
                        const dist = colorDistance({ r: avgR, g: avgG, b: avgB }, { r: emoji.r, g: emoji.g, b: emoji.b });
                        if (dist < minDist) {
                            minDist = dist;
                            closestEmoji = emoji;
                        }
                    }
                    result.push({
                        char: closestEmoji.char,
                        x: Math.round(startX),
                        y: Math.round(startY),
                        color: `rgb(${Math.round(avgR)}, ${Math.round(avgG)}, ${Math.round(avgB)})`
                    });
                }
            } else {
                // Handle empty/transparent pixels
                if (isDotMode || isTextMode) {
                    const emptyChar = (platform === 'instagram' || platform === 'youtube') ? '\u00A0' : ' ';
                    textRow += emptyChar;
                }
            }
            processedSteps++;
        }

        if (isTextMode || isDotMode) {
            textResult += textRow + '\n';
        }

        // Periodic yield and progress update
        if (y % CHUNK_SIZE === 0 || y === rows - 1) {
            self.postMessage({ type: 'PROGRESS', progress: Math.round((processedSteps / totalSteps) * 100) });
            // Yield to event loop to allow CANCEL message to be processed
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    if (mode === 'image') {
        if (settings.watermark) {
            const watermarkText = "Made with Photo to Emoji Studio";
            const chars = watermarkText.split('');
            const watermarkDensity = density || 10;
            chars.forEach((char, i) => {
                result.push({
                    char,
                    x: width - (chars.length - i) * (watermarkDensity * 0.8),
                    y: height - watermarkDensity,
                    color: 'rgba(128, 128, 128, 0.5)'
                });
            });
        }
        self.postMessage({ type: 'RESULT', result });
    } else {
        let finalOutput = textResult;
        if (settings.watermark) {
            finalOutput += "\n\nGenerated by Photo to Emoji Studio";
        }
        self.postMessage({ type: 'TEXT_RESULT', text: finalOutput });
    }
}

self.onmessage = (e) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'INIT':
            initEmojiColors();
            break;
        case 'PROCESS':
            processImage(payload.imageData, payload.width, payload.height, payload.settings, payload.mode);
            break;
        case 'CANCEL':
            isCancelled = true;
            break;
    }
};

