// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 基础类型定义（类型体操基建）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 统一的 API 响应格式
interface ApiResponse<T = any> {
    data: T
    status: number
    message: string
}

// HTTP 方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求配置（泛型化）
interface RequestConfig<T = any> extends RequestInit {
    baseURL?: string
    timeout?: number
    params?: Record<string, string | number | boolean>
    data?: T  // 泛型：请求体数据类型
    _skipInterceptors?: boolean
    signal?: AbortSignal
    // 响应类型提示
    responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer'
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 拦截器类型（泛型化）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type RequestInterceptor<T = any> = (
    config: RequestConfig<T>
) => Promise<RequestConfig<T>> | RequestConfig<T>

type ResponseInterceptor<T = any, R = any> = (
    response: Response,
    config?: RequestConfig<T>
) => Promise<R> | R

type ErrorInterceptor = (
    error: any,
    config?: RequestConfig
) => Promise<any> | any

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 类型体操工具
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 提取响应数据类型
type ExtractData<T> = T extends ApiResponse<infer D> ? D : T

// 根据方法类型决定是否需要 data 参数
type RequiresData<M extends HttpMethod> =
    M extends 'POST' | 'PUT' | 'PATCH' ? true : false

// 条件参数类型
type RequestParams<M extends HttpMethod, T = any> =
    RequiresData<M> extends true
    ? [url: string, data: T, config?: RequestConfig<T>]
    : [url: string, config?: RequestConfig<T>]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 优化后的 FetchInterceptor 类
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class FetchInterceptor {
    private baseURL: string
    private defaultTimeout: number
    private requestInterceptors: RequestInterceptor[] = []
    private responseInterceptors: ResponseInterceptor[] = []
    private errorInterceptors: ErrorInterceptor[] = []

    constructor(baseURL: string = '', defaultTimeout: number = 10000) {
        this.baseURL = baseURL
        this.defaultTimeout = defaultTimeout
    }

    // 添加拦截器（泛型化）
    addRequestInterceptor<T = any>(interceptor: RequestInterceptor<T>): void {
        this.requestInterceptors.push(interceptor as RequestInterceptor)
    }

    addResponseInterceptor<T = any, R = any>(
        interceptor: ResponseInterceptor<T, R>
    ): void {
        this.responseInterceptors.push(interceptor as ResponseInterceptor)
    }

    addErrorInterceptor(interceptor: ErrorInterceptor): void {
        this.errorInterceptors.push(interceptor)
    }

    setDefaultTimeout(timeout: number): void {
        this.defaultTimeout = timeout
    }

    private createTimeoutController(timeout: number) {
        const controller = new AbortController()
        if (timeout > 0) {
            const timeoutId = setTimeout(() => controller.abort(), timeout)
            return { controller, timeoutId }
        }
        return { controller }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 核心请求方法（完全类型安全）
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    async request<TResponse = any, TData = any>(
        url: string,
        config: RequestConfig<TData> = {}
    ): Promise<TResponse> {
        let finalUrl = this.baseURL + url
        let timeoutId: NodeJS.Timeout | undefined

        // 处理查询参数
        if (config.params) {
            const searchParams = new URLSearchParams()
            Object.keys(config.params).forEach(key => {
                const value = config.params![key]
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value))
                }
            })
            const queryString = searchParams.toString()
            if (queryString) {
                finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString
            }
        }

        try {
            let processedConfig = { ...config }
            delete processedConfig.params

            // 执行请求拦截器
            for (const interceptor of this.requestInterceptors) {
                processedConfig = await interceptor(processedConfig)
            }

            // 超时处理
            const timeout = processedConfig.timeout ?? this.defaultTimeout
            let controller: AbortController | undefined
            if (!processedConfig.signal && timeout > 0) {
                const timeoutControl = this.createTimeoutController(timeout)
                controller = timeoutControl.controller
                timeoutId = timeoutControl.timeoutId
                processedConfig.signal = controller.signal
            }

            // 发送请求
            const response = await fetch(finalUrl, processedConfig)
            if (timeoutId) clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // 执行响应拦截器
            let processedResponse: any = response
            for (const interceptor of this.responseInterceptors) {
                processedResponse = await interceptor(processedResponse, processedConfig)
            }

            return processedResponse as TResponse

        } catch (error: any) {
            if (timeoutId) clearTimeout(timeoutId)

            if (error.name === 'AbortError') {
                const timeout = config.timeout ?? this.defaultTimeout
                error = new Error(`Request timeout after ${timeout}ms`)
                error.name = 'TimeoutError'
            }

            let processedError = error
            for (const interceptor of this.errorInterceptors) {
                processedError = await interceptor(processedError, config)
            }

            throw processedError
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 快捷方法（完全类型安全 + 智能提示）
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    get<TResponse = any>(
        url: string,
        config?: RequestConfig
    ): Promise<TResponse> {
        return this.request<TResponse>(url, { ...config, method: 'GET' })
    }

    post<TResponse = any, TData = any>(
        url: string,
        data: TData,
        config?: RequestConfig<TData>
    ): Promise<TResponse> {
        return this.request<TResponse, TData>(url, {
            ...config,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers
            }
        })
    }

    put<TResponse = any, TData = any>(
        url: string,
        data: TData,
        config?: RequestConfig<TData>
    ): Promise<TResponse> {
        return this.request<TResponse, TData>(url, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers
            }
        })
    }

    delete<TResponse = any>(
        url: string,
        config?: RequestConfig
    ): Promise<TResponse> {
        return this.request<TResponse>(url, { ...config, method: 'DELETE' })
    }

    patch<TResponse = any, TData = any>(
        url: string,
        data: TData,
        config?: RequestConfig<TData>
    ): Promise<TResponse> {
        return this.request<TResponse, TData>(url, {
            ...config,
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers
            }
        })
    }
}