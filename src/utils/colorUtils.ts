// Helper to get average color of an image data chunk
export function getAverageColor(data: Uint8ClampedArray): { r: number, g: number, b: number } {
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
        // Skip fully transparent pixels
        if (data[i + 3] < 20) continue;

        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }

    if (count === 0) return { r: 0, g: 0, b: 0 };

    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
    };
}

// Euclidean distance squared (faster than sqrt)
export function colorDistance(c1: { r: number, g: number, b: number }, c2: { r: number, g: number, b: number }) {
    return (c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2;
}
