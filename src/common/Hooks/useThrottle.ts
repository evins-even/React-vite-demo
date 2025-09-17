import { useCallback, useEffect, useRef, useState } from 'react';
/**
 * 一个增强版的节流 Hook，专门解决 React 闭包陷阱和异步状态同步问题。
 * 通过 Ref 存储关键状态保证执行时获取最新值，并返回 Promise 支持异步操作协调。
 *
 * @template T 被节流的函数类型，应该返回一个 Promise
 * @param {T} fn 需要被节流的异步函数。该函数可以接收一个包含最新状态的 state 参数
 * @param {number} delay 节流时间间隔（毫秒）
 * @param {Object} [options] 配置选项
 * @param {boolean} [options.leading=true] 是否在节流开始时立即执行
 * @param {boolean} [options.trailing=true] 是否在节流结束后执行最后一次调用
 * 
 * @returns {{
 *   throttledFn: (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;
 *   updateState: (state: Partial<S>) => void;
 * }} 返回包含节流函数和状态更新方法的对象
 * 
 * @example
 * // 在组件中使用
 * const { throttledFn, updateState } = useThrottle(async (arg1, state) => {
 *   // state 保证是从 ref 中实时获取的最新状态
 *   const response = await fetch(`/api?page=${state.page}`);
 *   return response.json();
 * }, 1000);
 * 
 * // 更新状态（会同步更新到 ref）
 * const handlePageChange = (newPage) => {
 *   setPage(newPage);        // 用于界面渲染
 *   updateState({ page: newPage }); // 用于节流函数执行
 * };
 * 
 * // 调用节流函数
 * const loadData = async () => {
 *   try {
 *     const data = await throttledFn('some argument');
 *     console.log('Loaded:', data);
 *   } catch (error) {
 *     console.error('Failed:', error);
 *   }
 * };
 * 
 * @note 此实现专门解决以下场景：
 * 1. 异步操作需要依赖频繁变化的状态（如分页、令牌等）
 * 2. 需要避免 React 闭包导致的 stale closure 问题
 * 3. 需要支持 Promise 链式调用和错误处理
 */
export function useThrottle<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay: number,
    options?: { leading?: boolean; trailing?: boolean }
) {
    const fnRef = useRef(fn);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lastExecTimeRef = useRef<number>(0);

    // 关键：使用 ref 来存储需要同步的最新状态
    const stateRef = useRef({
        page: 1,
        token: ''
    });

    // 暴露一个方法来更新 ref 中的状态
    const updateState = useCallback((newState: Partial<typeof stateRef.current>) => {
        stateRef.current = { ...stateRef.current, ...newState };
    }, []);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    const throttledFn = useCallback(async (...args: Parameters<T>) => {
        const now = Date.now();
        const elapsed = now - lastExecTimeRef.current;

        return new Promise((resolve, reject) => {
            const execute = async () => {
                try {
                    // 关键：在执行时从 ref 中获取最新的状态，而不是依赖闭包
                    const currentState = stateRef.current;
                    // 可以将状态作为参数传递，或者在函数内部使用
                    const result = await fnRef.current(...args, currentState);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            if (elapsed >= delay) {
                lastExecTimeRef.current = now;
                execute();
            } else if (!timerRef.current) {
                timerRef.current = setTimeout(() => {
                    lastExecTimeRef.current = Date.now();
                    timerRef.current = null;
                    execute();
                }, delay - elapsed);
            }
        });
    }, [delay]);

    return { throttledFn, updateState };
}