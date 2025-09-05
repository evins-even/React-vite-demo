import { FetchInterceptor } from "../api/FetchInterceptor";

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
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})

// 添加错误拦截器

Mapi.addErrorInterceptor(async (response) => {
    if (!response.success) {
        const error = response
        throw new Error(error || '请求失败');
    }
    return response;
});

// 添加响应拦截器 - 解析JSON
Mapi.addResponseInterceptor(async (response) => {
    console.log('响应拦截器', response)
    const data = JSON.stringify(response)
    console.log('响应数据', data)
    return data;
});
export default Mapi;