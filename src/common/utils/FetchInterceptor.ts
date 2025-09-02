// 请求配置接口
interface RequestConfig extends RequestInit {
    baseURL?: string;
    timeout?: number;
    params?: Record<string, string | number | boolean>;
    data?: any;
    // 可以添加拦截器特定配置
    _skipInterceptors?: boolean;
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
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];
    private errorInterceptors: ErrorInterceptor[] = [];

    constructor(baseURL: string = '') {
        this.baseURL = baseURL;
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

    // 执行请求
    async request(url: string, config: RequestConfig = { method: 'GET' }): Promise<any> {
        let finalUrl = this.baseURL + url;

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
            // 发送请求
            const response = await fetch(finalUrl, processedConfig);

            // 执行响应拦截器
            let processedResponse = response;
            for (const interceptor of this.responseInterceptors) {
                processedResponse = await interceptor(processedResponse, processedConfig);
            }

            return processedResponse;
        } catch (error) {
            // 执行错误拦截器
            let processedError = error;
            for (const interceptor of this.errorInterceptors) {
                processedError = await interceptor(processedError);
            }
            throw processedError;
        }
    }

    get(url: string, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }
    post(url: string, data: any, options: RequestConfig = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }
    put(url: string, data: any, options: RequestConfig = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }

    delete(url: string, options: RequestConfig = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }

}