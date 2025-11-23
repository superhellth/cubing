import { Status, type ISolve } from "@cubing/shared";
import { useMemo, useState } from "react";

export function useLocalStorage(key: string, initialValue: any) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: any) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export function useSolvesWithAverages (solves: ISolve[]) {
        return useMemo(() => {
            const processed = new Array(solves.length);
            const calcAvg = (startIndex: number, length: number): number | null => {
                if (startIndex + length > solves.length) return null;

                let sum = 0;
                let min = Infinity;
                let max = -Infinity;
                let dnfCount = 0;

                for (let i = 0; i < length; i++) {
                    const s = solves[startIndex + i];
                    if (s.status === Status.DNF) {
                        dnfCount++;
                        continue;
                    }

                    let time = s.duration;
                    if (s.status === Status.PlusTwo) {
                        time += 2000;
                    }

                    if (time < min) min = time;
                    if (time > max) max = time;
                    sum += time;
                }

                if (dnfCount > 1) {
                    return -1;
                }
                if (dnfCount === 1) {
                    return (sum - min) / (length - 2);
                }

                return (sum - min - max) / (length - 2);
            };

            for (let i = 0; i < solves.length; i++) {
                processed[i] = {
                    ...solves[i],
                    avg5: calcAvg(i, 5),
                    avg12: calcAvg(i, 12),
                    avg100: calcAvg(i, 100),
                    avg1000: calcAvg(i, 1000)
                };
            }

            return processed;
        }, [solves]);
    };