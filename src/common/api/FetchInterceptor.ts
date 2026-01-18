// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 基础类型定义（类型体操基建）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 统一的 API 响应格式（与后端保持一致）
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;        // 可选：成功时存在
    message?: string; // 可选：成功时的提示信息
    error?: string;  // 可选：错误时的错误信息
    status?: number; // 可选：HTTP 状态码
}

// HTTP 方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求配置（泛型化）
interface RequestConfig<T = any> extends RequestInit {
    baseURL?: string
    timeout?: number
    params?: Record<string, string | number | boolean>
    data?: T  // 泛型：请求体数据类型（用于在拦截器中访问原始数据）
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

// 响应拦截器：支持泛型输入和输出类型
// I: 输入类型（第一个拦截器是 Response，后续拦截器是前一个的返回值）
// R: 输出类型
// T: 请求数据类型（用于 config）
type ResponseInterceptor<I = Response, R = any, T = any> = (
    response: I,
    config?: RequestConfig<T>
) => Promise<R> | R

type ErrorInterceptor = (
    error: any,
    config?: RequestConfig
) => Promise<any> | any

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 类型体操工具
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 提取响应数据类型
 * 如果 T 是 ApiResponse<D> 格式，则提取出 D；否则返回 T 本身
 * 
 * @example
 * type UserApiResponse = ApiResponse<{ id: number; name: string }>
 * type UserData = ExtractData<UserApiResponse>  // { id: number; name: string }
 * 
 * @example
 * // 如果响应不是 ApiResponse 格式，原样返回
 * type PlainData = ExtractData<{ id: number }>  // { id: number }
 */
export type ExtractData<T> = T extends ApiResponse<infer D> ? D : T

/**
 * 根据方法类型决定是否需要 data 参数
 * POST/PUT/PATCH 需要 data，GET/DELETE 不需要
 * 
 * @example
 * type PostNeedsData = RequiresData<'POST'>      // true
 * type GetNeedsData = RequiresData<'GET'>        // false
 */
type RequiresData<M extends HttpMethod> =
    M extends 'POST' | 'PUT' | 'PATCH' ? true : false

/**
 * 条件参数类型 - 根据 HTTP 方法智能推断函数参数
 * 
 * - POST/PUT/PATCH: [url: string, data: T, config?: RequestConfig<T>]
 * - GET/DELETE:     [url: string, config?: RequestConfig<T>]
 * 
 * @example
 * // 用于创建通用的请求函数
 * async function request<M extends HttpMethod, TResponse, TData>(
 *   method: M,
 *   ...params: RequestParams<M, TData>  // 根据 M 自动推断参数
 * ): Promise<TResponse> { ... }
 */
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

    addResponseInterceptor<I = Response, R = any, T = any>(
        interceptor: ResponseInterceptor<I, R, T>
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

    async request<TResponse = ApiResponse<any>, TData = any>(
        url: string,
        config: RequestConfig<TData> = {}
    ): Promise<ExtractData<TResponse>> {
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

            // ✅ 使用 ExtractData 自动提取解包后的类型
            return processedResponse as ExtractData<TResponse>

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
    // 高级用法：使用 RequestParams 的通用方法（可选）
    // 注意：如果你更喜欢明确的 get/post/put/delete 方法，可以跳过这个方法
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    /**
     * 通用请求方法 - 使用 RequestParams 工具类型
     * 根据 HTTP 方法类型智能推断参数（使用工具类型实现）
     * 
     * @example
     * // GET 请求：只需要 url 和可选的 config（TypeScript 会检查参数数量）
     * const user = await api.requestMethod<'GET', UserResponse>('GET', '/user/1')
     * 
     * @example
     * // POST 请求：必须有 url、data 和可选的 config
     * const result = await api.requestMethod<'POST', CreateResponse, CreateRequest>(
     *   'POST', '/user', { name: 'test' }
     * )
     * 
     * @example
     * // 如果后端返回 ApiResponse<T> 格式，可以使用 ExtractData 提取类型
     * type UserApiResponse = ApiResponse<{ id: number; name: string }>
     * const user = await api.requestMethod<'GET', UserApiResponse>('GET', '/user/1')
     * // 返回类型会自动提取为 { id: number; name: string }
     */
    async requestMethod<M extends HttpMethod, TResponse = ApiResponse<any>, TData = any>(
        method: M,
        ...params: RequestParams<M, TData>  // ✅ 使用 RequestParams 工具类型
    ): Promise<ExtractData<TResponse>> {
        const [url, dataOrConfig, config] = params

        // GET 和 DELETE 不需要 data 参数（RequiresData<'GET'> = false）
        if (method === 'GET' || method === 'DELETE') {
            return this.request<TResponse>(url, {
                ...(dataOrConfig as RequestConfig | undefined),
                method
            })
        }

        // POST、PUT、PATCH 需要 data 参数（RequiresData<'POST'> = true）
        const data = dataOrConfig as TData
        const finalConfig = config as RequestConfig<TData> | undefined

        return this.request<TResponse, TData>(url, {
            ...finalConfig,
            method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...finalConfig?.headers
            }
        })
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 快捷方法（完全类型安全 + 智能提示）
    // 推荐使用：更加明确和易读
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    get<TResponse = ApiResponse<any>>(
        url: string,
        config?: RequestConfig
    ): Promise<ExtractData<TResponse>> {
        return this.request<TResponse>(url, { ...config, method: 'GET' })
    }

    post<TResponse = ApiResponse<any>, TData = any>(
        url: string,
        data: TData,
        config?: RequestConfig<TData>
    ): Promise<ExtractData<TResponse>> {
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

    put<TResponse = ApiResponse<any>, TData = any>(
        url: string,
        data: TData,
        config?: RequestConfig<TData>
    ): Promise<ExtractData<TResponse>> {
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

    delete<TResponse = ApiResponse<any>>(
        url: string,
        config?: RequestConfig
    ): Promise<ExtractData<TResponse>> {
        return this.request<TResponse>(url, { ...config, method: 'DELETE' })
    }

    patch<TResponse = ApiResponse<any>, TData = any>(
        url: string,
        data: TData,
        config?: RequestConfig<TData>
    ): Promise<ExtractData<TResponse>> {
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