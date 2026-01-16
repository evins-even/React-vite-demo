import { FetchInterceptor } from "../api/FetchInterceptor";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 统一的 API 响应格式（与后端约定）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message: string;
    code: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 业务错误类
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export class ApiError extends Error {
    code: number;
    response?: any;

    constructor(message: string, code: number, response?: any) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
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
api.addResponseInterceptor(async (response) => {
    // 检查 HTTP 状态码
    if (!response.ok) {
        throw new ApiError(
            `HTTP error! status: ${response.status}`,
            response.status
        );
    }

    // 解析 JSON
    const data = await response.json();
    return data;
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. 响应拦截器 - 业务逻辑处理
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
api.addResponseInterceptor(async (response: any) => {
    // response 此时已经是 JSON 对象（被上一个拦截器解析过）
    const data = response as ApiResponse;
    
    // 检查业务状态码
    if (!data.success) {
        // 特殊错误码处理
        switch (data.code) {
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
                throw new ApiError(data.message || '请求失败', data.code, data);
        }
    }

    // 只返回 data 部分（简化使用）
    return data.data;
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
        console.error('业务错误:', error.message, error.code);
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