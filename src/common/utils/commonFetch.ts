import { FetchInterceptor } from "../utils/FetchInterceptor";

const Mapi = new FetchInterceptor("http://localhost:3000/api")

//添加请求拦截器 - JWT注入
Mapi.addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return config;
})

// 添加响应拦截器 - 错误处理

Mapi.addResponseInterceptor(async (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})

// 添加错误拦截器

Mapi.addResponseInterceptor(async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '请求失败');
    }
    return response;
});

// 添加响应拦截器 - 解析JSON
Mapi.addResponseInterceptor(async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
    }
    return response;
});
export default Mapi;