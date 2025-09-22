// 请求配置接口
interface RequestConfig extends RequestInit {
    baseURL?: string;
    timeout?: number;
    params?: Record<string, string | number | boolean>;
    data?: any;
    // 可以添加拦截器特定配置
    _skipInterceptors?: boolean;
    signal?: AbortSignal; // 允许外部传入 signal
}

// 请求拦截器类型
type RequestInterceptor = (
    config: RequestConfig
) => Promise<RequestConfig> | RequestConfig;

// 响应拦截器类型
type ResponseInterceptor = (
    response: Response,
    config?: RequestConfig
) => Promise<any> | any;

// 错误拦截器类型
type ErrorInterceptor = (
    error: any,
    config?: RequestConfig
) => Promise<any> | any;

export class FetchInterceptor {
    private baseURL: string;
    private defaultTimeout: number;
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];
    private errorInterceptors: ErrorInterceptor[] = [];

    constructor(baseURL: string = '', defaultTimeout: number = 10000) {
        this.baseURL = baseURL;
        this.defaultTimeout = defaultTimeout;
    }

    // 添加请求拦截器
    addRequestInterceptor(interceptor: RequestInterceptor): void {
        this.requestInterceptors.push(interceptor);
    }

    // 添加响应拦截器
    addResponseInterceptor(interceptor: ResponseInterceptor): void {
        this.responseInterceptors.push(interceptor);
    }

    // 添加错误拦截器
    addErrorInterceptor(interceptor: ErrorInterceptor): void {
        this.errorInterceptors.push(interceptor);
    }

    // 设置默认超时时间
    setDefaultTimeout(timeout: number): void {
        this.defaultTimeout = timeout;
    }

    // 创建带超时的 AbortController
    private createTimeoutController(timeout: number): { controller: AbortController; timeoutId?: NodeJS.Timeout } {
        const controller = new AbortController();

        if (timeout > 0) {
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            return { controller, timeoutId };
        }

        return { controller };
    }

    // 执行请求
    async request(url: string, config: RequestConfig = { method: 'GET' }): Promise<any> {
        let finalUrl = this.baseURL + url;
        let timeoutId: NodeJS.Timeout | undefined;

        // 处理查询参数
        if (config.params) {
            const searchParams = new URLSearchParams();
            Object.keys(config.params).forEach(key => {
                const value = config.params![key];
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });

            const queryString = searchParams.toString();
            if (queryString) {
                finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
            }
        }

        try {
            let processedConfig = { ...config };
            delete processedConfig.params;

            // 执行请求拦截器
            for (const interceptor of this.requestInterceptors) {
                processedConfig = await interceptor(processedConfig);
            }

            // 确定超时时间（优先使用配置的，否则使用默认的）
            const timeout = processedConfig.timeout ?? this.defaultTimeout;

            // 创建超时控制器（如果外部没有传入 signal）
            let controller: AbortController | undefined;
            if (!processedConfig.signal && timeout > 0) {
                const timeoutControl = this.createTimeoutController(timeout);
                controller = timeoutControl.controller;
                timeoutId = timeoutControl.timeoutId;
                processedConfig.signal = controller.signal;
            }

            // 发送请求
            const response = await fetch(finalUrl, processedConfig);

            // 清理超时定时器
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 检查响应状态
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 执行响应拦截器
            let processedResponse = response;
            for (const interceptor of this.responseInterceptors) {
                processedResponse = await interceptor(processedResponse, processedConfig);
            }

            return processedResponse;

        } catch (error: any) {
            // 清理超时定时器
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 如果是超时错误，包装错误信息
            if (error.name === 'AbortError') {
                const timeout = config.timeout ?? this.defaultTimeout;
                error = new Error(`Request timeout after ${timeout}ms`);
                error.name = 'TimeoutError';
            }

            // 执行错误拦截器
            let processedError = error;
            for (const interceptor of this.errorInterceptors) {
                processedError = await interceptor(processedError, config);
            }

            throw processedError;
        }
    }

    // 快捷方法
    get(url: string, config: RequestConfig = {}) {
        return this.request(url, { ...config, method: 'GET' });
    }

    post(url: string, data: any, config: RequestConfig = {}) {
        return this.request(url, {
            ...config,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            }
        });
    }

    put(url: string, data: any, config: RequestConfig = {}) {
        return this.request(url, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            }
        });
    }

    delete(url: string, config: RequestConfig = {}) {
        return this.request(url, { ...config, method: 'DELETE' });
    }

    patch(url: string, data: any, config: RequestConfig = {}) {
        return this.request(url, {
            ...config,
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...config.headers
            }
        });
    }
}