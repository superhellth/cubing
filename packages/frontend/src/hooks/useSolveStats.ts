import { useEffect, useRef, useState } from "react";
import { ISolve } from "@cubing/shared";

export function useSolveStats(solves: ISolve[]) {
    // Start with empty stats, or current solves if you want immediate render 
    // (though they won't have averages yet)
    const [stats, setStats] = useState<ISolve[]>([]);
    
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize the worker
        // 'import.meta.url' is standard in Vite/Webpack 5
        workerRef.current = new Worker(
            new URL('../utils/stats.worker.ts', import.meta.url), 
            { type: 'module' }
        );

        // Handle messages from the worker
        workerRef.current.onmessage = (event) => {
            setStats(event.data);
        };

        // Cleanup: Terminate worker when the component unmounts
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    useEffect(() => {
        // Send data to worker whenever 'solves' changes
        if (workerRef.current) {
            workerRef.current.postMessage(solves);
        }
    }, [solves]);

    return stats;
}