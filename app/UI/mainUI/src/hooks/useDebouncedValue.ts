import { useEffect, useState } from "react";

/**
 * Returns a debounced value that only updates after the specified delay
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
