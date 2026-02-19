import { useEffect, useRef, useState, useCallback } from 'react';
import type { ProcessingSettings } from '../worker';

export function useWorker() {
    const workerRef = useRef<Worker | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<any[] | null>(null);
    const [textResult, setTextResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const initWorker = useCallback(() => {
        if (workerRef.current) workerRef.current.terminate();

        workerRef.current = new Worker(new URL('../worker.ts', import.meta.url), {
            type: 'module'
        });

        workerRef.current.onmessage = (e) => {
            const { type, result: processedResult, text, progress: workProgress, message } = e.data;
            if (type === 'INIT_COMPLETE') {
                setIsReady(true);
            } else if (type === 'PROGRESS') {
                setProgress(workProgress);
            } else if (type === 'RESULT') {
                setResult(processedResult);
                setIsProcessing(false);
                setProgress(100);
            } else if (type === 'TEXT_RESULT') {
                setTextResult(text);
                setIsProcessing(false);
                setProgress(100);
            } else if (type === 'CANCELLED') {
                setIsProcessing(false);
                setProgress(0);
            } else if (type === 'ERROR') {
                setError(message);
                setIsProcessing(false);
            }
        };

        workerRef.current.postMessage({ type: 'INIT' });
    }, []);

    useEffect(() => {
        initWorker();
        return () => {
            workerRef.current?.terminate();
        };
    }, [initWorker]);

    const processImage = useCallback((
        imageData: Uint8ClampedArray,
        width: number,
        height: number,
        settings: ProcessingSettings,
        mode: 'image' | 'text' | 'dot' = 'image'
    ) => {
        if (!workerRef.current || !isReady) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);

        if (mode === 'image') setResult(null);
        else setTextResult(null);

        workerRef.current.postMessage({
            type: 'PROCESS',
            payload: { imageData, width, height, settings, mode }
        });
    }, [isReady]);

    const cancelRendering = useCallback(() => {
        if (!workerRef.current) return;
        workerRef.current.postMessage({ type: 'CANCEL' });
    }, []);

    const resetResult = useCallback(() => {
        setResult(null);
        setTextResult(null);
        setProgress(0);
        setError(null);
    }, []);

    return { isReady, isProcessing, progress, error, result, textResult, processImage, cancelRendering, resetResult };
}

