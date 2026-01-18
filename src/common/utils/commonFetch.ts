import { ApiResponse, FetchInterceptor } from "../api/FetchInterceptor";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 统一的 API 响应格式（与后端约定）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 业务错误类
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export class ApiError extends Error {
    status: number;
    response?: any;

    constructor(message: string, status: number, response?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.response = response;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 获取 API 基础地址
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const getApiBaseUrl = () => {
    // 开发环境：使用相对路径，通过 Vite 代理（解决跨域）
    if (import.meta.env.DEV) {
        return '/api';
    }

    // 生产环境：从环境变量读取，或使用相对路径（通过 Nginx 代理）
    return import.meta.env.VITE_API_BASE_URL || '/api';
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 创建实例
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const api = new FetchInterceptor(
    getApiBaseUrl(),
    10000
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 请求拦截器 - JWT 注入
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
api.addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return config;
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. 响应拦截器 - 解析 JSON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✅ 第一个拦截器：接收 Response，返回 ApiResponse
api.addResponseInterceptor<Response, ApiResponse>(async (response: Response): Promise<ApiResponse> => {
    // 检查 HTTP 状态码
    if (!response.ok) {
        throw new ApiError(
            `HTTP error! status: ${response.status}`,
            response.status
        );
    }

    // 解析 JSON
    const data: ApiResponse = await response.json();
    return data
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 响应拦截器 - 业务逻辑处理
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✅ 现在类型正确了：这个拦截器接收的是上一个拦截器的返回值（ApiResponse）
api.addResponseInterceptor<ApiResponse, any>(async (response: ApiResponse) => {
    // response 此时已经是 JSON 对象（被上一个拦截器解析过）
    const data = response;

    // 检查业务状态码
    if (!data.success) {
        // 获取错误信息：优先使用 error 字段，其次使用 message
        const errorMessage = data.error || data.message || '请求失败';
        // 获取状态码：优先使用 status 字段，默认 400
        const statusCode = data.status || 400;

        // 特殊错误码处理
        switch (statusCode) {
            case 401:
                // 未授权，清除 token，跳转登录
                localStorage.removeItem('jwtToken');
                window.location.href = '/login';
                throw new ApiError('未授权，请重新登录', 401, data);

            case 403:
                throw new ApiError('没有权限访问', 403, data);

            case 404:
                throw new ApiError('请求的资源不存在', 404, data);

            case 500:
                throw new ApiError('服务器错误', 500, data);

            default:
                throw new ApiError(errorMessage, statusCode, data);
        }
    }

    // 只返回 data 部分（简化使用）
    // 注意：data.data 可能是 undefined（如果后端没有返回 data 字段）
    // 成功时应该总是有 data，但为了类型安全，返回 data.data ?? null
    return data.data ?? null;
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. 错误拦截器 - 统一错误处理
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
api.addErrorInterceptor(async (error) => {
    // 网络错误
    if (error.name === 'TimeoutError') {
        console.error('请求超时:', error.message);
        // 可以在这里显示全局提示
        // Toast.error('请求超时，请稍后重试');
    } else if (error instanceof ApiError) {
        console.error('业务错误:', error.message, error.status);
        // 可以在这里显示全局提示
        // Toast.error(error.message);
    } else {
        console.error('未知错误:', error);
        // Toast.error('网络错误，请检查网络连接');
    }

    // 继续抛出错误，让调用方可以自行处理
    throw error;
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 导出实例
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default api;