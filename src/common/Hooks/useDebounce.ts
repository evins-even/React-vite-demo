import { useCallback, useEffect, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number = 500): T {
    const fnRef = useRef<T>(fn)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    // 更新函数引用
    useEffect(() => {
        fnRef.current = fn
    }, [fn])

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])
    // 返回一个带防抖的函数
    return useCallback((...args: Parameters<T>) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            fnRef.current(...args);
        }, delay);
    }, [delay]) as T;
}
