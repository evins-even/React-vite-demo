import { useCallback, useEffect, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay: number,
    options?: { leading?: boolean; trailing?: boolean }
) {
    const fnRef = useRef(fn);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lastExecTimeRef = useRef<number>(0);
    const pendingPromiseRef = useRef<Promise<any> | null>(null); // 跟踪当前正在进行的请求
    const { leading = true, trailing = true } = options || {};

    const stateRef = useRef({
        page: 1,
        token: ''
    });

    const updateState = useCallback((newState: Partial<typeof stateRef.current>) => {
        stateRef.current = { ...stateRef.current, ...newState };
    }, []);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    // 清理函数
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const throttledFn = useCallback(async (...args: Parameters<T>) => {
        const now = Date.now();
        const elapsed = now - lastExecTimeRef.current;

        return new Promise((resolve, reject) => {
            const execute = async () => {
                try {
                    // 如果有请求正在进行，等待它完成
                    if (pendingPromiseRef.current) {
                        await pendingPromiseRef.current;
                    }

                    const currentState = stateRef.current;
                    // 标记新的请求开始
                    pendingPromiseRef.current = fnRef.current(...args, currentState);

                    const result = await pendingPromiseRef.current;
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    pendingPromiseRef.current = null; // 请求完成，清理状态
                }
            };

            // 清理之前的定时器
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            if (elapsed >= delay) {
                // 可以立即执行
                if (leading) {
                    lastExecTimeRef.current = now;
                    execute();
                } else if (trailing) {
                    // 如果不执行 leading，但需要 trailing，设置定时器
                    timerRef.current = setTimeout(() => {
                        lastExecTimeRef.current = Date.now();
                        execute();
                    }, delay);
                }
            } else if (trailing) {
                // 需要等待，设置尾调用定时器
                // 关键修改：使用完整的 delay，而不是 delay - elapsed
                // 这样尾调用会在头调用完成后至少 delay 时间再执行
                timerRef.current = setTimeout(() => {
                    lastExecTimeRef.current = Date.now();
                    execute();
                }, delay);
            }
        });
    }, [delay, leading, trailing]);

    return { throttledFn, updateState };
}