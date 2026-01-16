import api from "../../../../common/utils/commonFetch";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 类型定义
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 登录请求参数
export interface LoginRequest {
    email: string;
    password: string;
}

// 登录响应数据
export interface LoginResponse {
    token: string;
    refreshToken?: string;
    user: {
        id: number;
        userName: string;
        email: string;
        avatar?: string;
    };
}

// 注册请求参数
export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
    passwordAgain: string;
}

// 注册响应数据
export interface RegisterResponse {
    userId: number;
    message: string;
}

// 用户信息响应
export interface UserInfoResponse {
    id: number;
    userName: string;
    email: string;
    avatar?: string;
    createdAt: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API 方法（完全类型安全）
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 用户登录
 * @param data 登录信息
 * @returns 登录成功后的用户信息和 token
 */
export function loginApi(data: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse, LoginRequest>("/auth/login", data);
}

/**
 * 用户注册
 * @param data 注册信息
 * @returns 注册结果
 */
export function registerApi(data: RegisterRequest): Promise<RegisterResponse> {
    return api.post<RegisterResponse, RegisterRequest>("/auth/register", data);
}

/**
 * 获取用户信息
 * @param userId 用户 ID
 * @returns 用户信息
 */
export function getUserInfoApi(userId: number): Promise<UserInfoResponse> {
    return api.get<UserInfoResponse>(`/user/${userId}`);
}

/**
 * 退出登录
 * @returns 退出结果
 */
export function logoutApi(): Promise<{ message: string }> {
    return api.post<{ message: string }, {}>("/auth/logout", {});
}

/**
 * 刷新 token
 * @param refreshToken 刷新 token
 * @returns 新的 token
 */
export function refreshTokenApi(refreshToken: string): Promise<{ token: string }> {
    return api.post<{ token: string }, { refreshToken: string }>(
        "/auth/refresh",
        { refreshToken }
    );
}