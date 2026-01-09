import { useState, useCallback } from 'react';
import api from '../common/utils/commonFetch';
import { ApiError } from '../common/utils/commonFetch';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法1：泛型约束 - 分页数据通用类型
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PaginatedResponse<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface Order {
    id: number;
    orderNo: string;
    amount: number;
    status: string;
}

// ✅ 通用的分页请求函数
async function fetchPaginatedData<T>(
    endpoint: string,
    page: number,
    pageSize: number
): Promise<PaginatedResponse<T>> {
    return api.get<PaginatedResponse<T>>(endpoint, {
        params: { page, pageSize }
    });
}

// 使用示例
export function PaginatedExample() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const loadProducts = async () => {
        // ✅ TypeScript 自动推断返回类型为 PaginatedResponse<Product>
        const response = await fetchPaginatedData<Product>('/product/list', 1, 10);
        setProducts(response.list);
    };

    const loadOrders = async () => {
        // ✅ TypeScript 自动推断返回类型为 PaginatedResponse<Order>
        const response = await fetchPaginatedData<Order>('/order/list', 1, 10);
        setOrders(response.list);
    };

    return (
        <div>
            <button onClick={loadProducts}>加载商品</button>
            <button onClick={loadOrders}>加载订单</button>
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法2：条件类型 - 根据方法决定参数
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 根据方法类型决定是否需要 data 参数
type RequestParams<M extends HttpMethod, T = any> =
    M extends 'POST' | 'PUT' | 'PATCH'
    ? [url: string, data: T, config?: any]
    : [url: string, config?: any];

// ✅ 类型安全的通用请求函数
async function request<M extends HttpMethod, TResponse = any, TData = any>(
    method: M,
    ...params: RequestParams<M, TData>
): Promise<TResponse> {
    const [url, dataOrConfig, config] = params;

    if (method === 'GET' || method === 'DELETE') {
        return api[method.toLowerCase() as 'get' | 'delete']<TResponse>(url, dataOrConfig);
    } else {
        return api[method.toLowerCase() as 'post' | 'put']<TResponse, TData>(
            url,
            dataOrConfig as TData,
            config
        );
    }
}

// 使用示例
export function ConditionalTypeExample() {
    const handleRequest = async () => {
        // ✅ GET 请求不需要 data 参数
        const user = await request<'GET', { name: string }>('GET', '/user/1');

        // ✅ POST 请求必须提供 data 参数
        const result = await request<'POST', { success: boolean }, { name: string }>(
            'POST',
            '/user',
            { name: 'test' }  // 必须提供
        );

        // ❌ TypeScript 错误：POST 缺少 data 参数
        // const error = await request<'POST', any>('POST', '/user');
    };

    return <button onClick={handleRequest}>测试条件类型</button>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法3：类型推断 - 自动提取响应数据类型
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 定义 API 响应格式
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

// 提取 data 类型
type ExtractData<T> = T extends ApiResponse<infer D> ? D : T;

// 示例：自动提取类型
type UserApiResponse = ApiResponse<{ id: number; name: string }>;
type UserData = ExtractData<UserApiResponse>;  // { id: number; name: string }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法4：请求去重（防止重复请求）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class RequestDeduplicator {
    private pendingRequests = new Map<string, Promise<any>>();

    async request<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
        // 如果已有相同请求在进行中，返回该 Promise
        if (this.pendingRequests.has(key)) {
            console.log('请求去重:', key);
            return this.pendingRequests.get(key)!;
        }

        // 创建新请求
        const promise = fetcher().finally(() => {
            this.pendingRequests.delete(key);
        });

        this.pendingRequests.set(key, promise);
        return promise;
    }
}

const deduplicator = new RequestDeduplicator();

export function DeduplicationExample() {
    const handleMultipleClicks = async () => {
        // ✅ 即使快速点击多次，也只会发送一个请求
        const promises = [
            deduplicator.request('user-1', () => api.get('/user/1')),
            deduplicator.request('user-1', () => api.get('/user/1')),
            deduplicator.request('user-1', () => api.get('/user/1')),
        ];

        const results = await Promise.all(promises);
        console.log('所有请求返回相同结果:', results);
    };

    return <button onClick={handleMultipleClicks}>快速点击测试</button>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法5：请求重试（带指数退避）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function requestWithRetry<T>(
    fetcher: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fetcher();
        } catch (error) {
            lastError = error;

            // 最后一次尝试失败，直接抛出错误
            if (attempt === maxRetries) {
                throw error;
            }

            // 指数退避：1s, 2s, 4s, 8s...
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`请求失败，${delay}ms 后重试...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

export function RetryExample() {
    const handleRetryRequest = async () => {
        try {
            // ✅ 自动重试，最多3次
            const result = await requestWithRetry(
                () => api.get('/api/unstable-endpoint'),
                3,
                1000
            );
            console.log('请求成功:', result);
        } catch (err) {
            console.error('重试3次后仍然失败:', err);
        }
    };

    return <button onClick={handleRetryRequest}>测试重试</button>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法6：请求缓存（带过期时间）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class RequestCache {
    private cache = new Map<string, CacheItem<any>>();

    async request<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = 60000  // 默认60秒
    ): Promise<T> {
        const cached = this.cache.get(key);

        // 检查缓存是否有效
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            console.log('使用缓存:', key);
            return cached.data;
        }

        // 发送请求并缓存
        console.log('发送请求:', key);
        const data = await fetcher();
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });

        return data;
    }

    clear(key?: string) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
}

const cache = new RequestCache();

export function CacheExample() {
    const [user, setUser] = useState<any>(null);

    const loadUser = async () => {
        // ✅ 60秒内重复请求会使用缓存
        const userData = await cache.request(
            'user-1',
            () => api.get('/user/1'),
            60000
        );
        setUser(userData);
    };

    const clearCache = () => {
        cache.clear('user-1');
        console.log('缓存已清除');
    };

    return (
        <div>
            <button onClick={loadUser}>加载用户（带缓存）</button>
            <button onClick={clearCache}>清除缓存</button>
            {user && <div>用户名: {user.name}</div>}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法7：并发控制（限制同时请求数）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ConcurrencyController {
    private queue: Array<() => Promise<any>> = [];
    private running = 0;

    constructor(private maxConcurrency: number = 3) { }

    async add<T>(fetcher: () => Promise<T>): Promise<T> {
        // 如果达到并发上限，等待
        while (this.running >= this.maxConcurrency) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.running++;
        try {
            return await fetcher();
        } finally {
            this.running--;
        }
    }
}

const concurrencyController = new ConcurrencyController(3);

export function ConcurrencyExample() {
    const handleBatchRequest = async () => {
        const userIds = Array.from({ length: 20 }, (_, i) => i + 1);

        console.log('开始批量请求（最多同时3个）...');

        // ✅ 同时最多只有3个请求在进行
        const promises = userIds.map(id =>
            concurrencyController.add(() => {
                console.log(`请求用户 ${id}`);
                return api.get(`/user/${id}`);
            })
        );

        const results = await Promise.all(promises);
        console.log('所有请求完成:', results.length);
    };

    return <button onClick={handleBatchRequest}>批量请求（并发控制）</button>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 高级用法8：请求取消（AbortController）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function CancelRequestExample() {
    const [controller, setController] = useState<AbortController | null>(null);

    const startRequest = () => {
        const abortController = new AbortController();
        setController(abortController);

        api.get('/api/long-running-task', {
            signal: abortController.signal
        })
            .then(result => {
                console.log('请求成功:', result);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log('请求已取消');
                } else {
                    console.error('请求失败:', err);
                }
            })
            .finally(() => {
                setController(null);
            });
    };

    const cancelRequest = () => {
        if (controller) {
            controller.abort();
            console.log('取消请求');
        }
    };

    return (
        <div>
            <button onClick={startRequest} disabled={!!controller}>
                开始请求
            </button>
            <button onClick={cancelRequest} disabled={!controller}>
                取消请求
            </button>
        </div>
    );
}

